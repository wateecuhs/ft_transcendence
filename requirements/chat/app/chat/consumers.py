from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from .serializers import MessageSerializer
from django.db import transaction
from typing import Dict, Any
from .enums import MessageType
from .models import Message
import chat.models as cmod
import datetime
import logging
import random
import json
import uuid

logger = logging.getLogger(__name__)

# TODO
# Fix the private messages fields, type and handling
# Refactor handlers
# Proper exception handling

"""
	ChatConsumer class is a subclass of AsyncWebsocketConsumer, which is a class provided by Django Channels.
	AsyncWebsocketConsumer is a class that provides a simple interface for handling WebSockets.
	We define the methods connect, disconnect, and receive to handle the WebSocket connection lifecycle.

    Websocket message fields:
        - type: The type of the message. (str)
        - data: The data of the message. (dict)
            - author: The author of the message. (str)

            - status: The status of the author. (str) (optional: for status messages)
            - content: The content of the message. (str) (optional: for chat messages)
            - created_at: The creation date of the message. (str) (optional: for chat messages)
            - target: The target of the message. (str) (optional: for private messages)
"""


class ChatConsumer(AsyncWebsocketConsumer):
    GLOBAL_CHAT = "chat"
    PRIVATE_CHAT_CMD = "/w"
    user_count = 0

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_id = None

    async def connect(self):
        # self.user_id = str(random.randint(10000000, 99999999))
        print("Connecting", flush=True)
        self.user_id = str(type(self).user_count)
        type(self).user_count += 1

        logger.info(f"[{self.user_id}] Connected.")

        await self.channel_layer.group_add(f"user.{self.user_id}", self.channel_name)
        await self.channel_layer.group_add(self.GLOBAL_CHAT, self.channel_name)

        contacts = [1, 2, 3, 4]
        for contact in contacts:
            await self.channel_layer.group_send(f"user.{contact}", {"type": MessageType.Status.REQUEST, "data": {"author": self.user_id}})
            await self.channel_layer.group_send(f"user.{contact}", {"type": MessageType.Status.UPDATE, "data": {"author": self.user_id, "status": cmod.User.Status.ONLINE}})

        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f"[{self.user_id}] Disconnected. ({close_code})")
        await self.channel_layer.group_discard(self.GLOBAL_CHAT, self.channel_name)
        await self.channel_layer.group_discard(f"user.{self.user_id}", self.channel_name)
        contacts = [1, 2, 3, 4]
        for contact in contacts:
            if str(contact) == self.user_id:
                continue
            await self.channel_layer.group_send(f"user.{contact}", {"type": MessageType.Status.UPDATE, "data": {"author": self.user_id, "status": cmod.User.Status.OFFLINE}})

    async def receive(self, text_data):
        logger.info(f"[{self.user_id}] Received message: {text_data}")

        try:
            event = json.loads(text_data)
        except json.JSONDecodeError as e:
            await self.error(f"Invalid JSON format. ({e})")
            return

        match event["type"]:
            case "chat_message":
                await self._handle_chat_message(event)
            case _:
                await self.error(f"Invalid message type. ({event['type']})")

    """
		Rooting functions for handling chat messages.
	"""

    async def _handle_chat_message(self, event: Dict[str, Any]):
        message = event["data"]["message"]
        if message[0] == "/":
            match message.split(" ")[0]:
                case self.PRIVATE_CHAT_CMD:
                    await self._handle_private_message(message)
                case _:
                    self.error(f"Invalid command. ({message.split(' ')[0]})")
        else:
            await self._handle_public_message(message)

    async def _handle_private_message(self, message: str):
        splitted_message = message.split(" ")
        if len(splitted_message) < 3:
            self.error(f"Invalid private message format. ({message})")
            return

        target = splitted_message[1]
        content = " ".join(splitted_message[2:])

        if target == self.user_id:
            self.error(f"You can't send a message to yourself.")
            return

        message_data = {
            "content": content,
            "author": self.user_id,
            "target": target,
            "is_author": False,
        }

        await self.channel_layer.group_send(f"user.{target}", {"type": MessageType.Chat.PRIVATE, "data": message_data})
        message_data["is_author"] = True
        await self.chat_private({"data": message_data})

    async def _handle_public_message(self, message: str):
        serializer = MessageSerializer(data={"type": cmod.Message.Type.PUBLIC, "author": self.user_id, "content": message})
        serializer.is_valid(raise_exception=True)
        message_data = {"content": message, "author": self.user_id}
        await self.channel_layer.group_send(
            self.GLOBAL_CHAT, {"type": MessageType.Chat.PUBLIC, "data": message_data}
        )
        await sync_to_async(serializer.save)()
    """
		These methods are called by the channel layer when a message is received /
		from the group or a private message is received.
	"""

    async def status_request(self, event):
        await self.channel_layer.group_send(event["data"]["author"], {"type": MessageType.Status.UPDATE, "data": {"author": self.user_id, "status": cmod.User.Status.ONLINE}})

    async def status_update(self, event):
        event["data"]["content"] = f"{event['data']['author']} is now {event['data']['status']}."
        await self._json_send("status_update", event["data"])

    async def chat_public(self, event):
        await self._json_send(MessageType.Chat.PUBLIC, event["data"])

    async def chat_private(self, event):
        await self._json_send(MessageType.Chat.PRIVATE, event["data"])

    async def error(self, error):
        logger.error(f"[{self.user_id}] Error: {error}")
        await self._json_send("error", {"error": error})

    async def _json_send(self, message_type: str, data: Dict[str, Any]):
        data["created_at"] = datetime.datetime.now().strftime("%H:%M")
        try:
            message = json.dumps({"type": message_type, "data": data})
            await self.send(text_data=message)
        except json.JSONDecodeError as e:
            await self.error(f"Invalid JSON format. ({e})")
