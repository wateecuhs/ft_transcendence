from channels.generic.websocket import AsyncWebsocketConsumer
from .serializers import MessageSerializer, RelationshipSerializer
from asgiref.sync import sync_to_async
from .enums import MessageType
from channels.db import database_sync_to_async
from typing import Dict, Any
import chat.models as cmod
import datetime
import logging
import json

logger = logging.getLogger(__name__)

# TODO
# Proper exception handling
# Change handler routing bc its ass (this needs frontend change so wont be done rn)

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
    user = None
    GLOBAL_CHAT = "chat"
    PRIVATE_CHAT_CMD = "/w"
    BLOCK_CHAT_CMD = "/block"
    UNBLOCK_CHAT_CMD = "/unblock"
    ADD_FRIEND_CMD = "/add"
    REMOVE_FRIEND_CMD = "/remove"
    ACCEPT_FRIEND_CMD = "/accept"
    DECLINE_FRIEND_CMD = "/decline"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_id = None

    async def connect(self):
        if self.scope["user"] is None:
            await self.close()
            return
        self.user = str(self.scope["user"])

        logger.info(f"[{self.user}] Connected.")

        await self.channel_layer.group_add(f"user.{self.user}", self.channel_name)
        await self.channel_layer.group_add(self.GLOBAL_CHAT, self.channel_name)

        await database_sync_to_async(set_online)(self.user)

        contacts = await database_sync_to_async(get_friends)(self.user)
        for contact in contacts:
            logger.info(f"[{self.user}] Sending status request to {contact}.")
            await self.channel_layer.group_send(f"user.{contact}", {"type": MessageType.Status.REQUEST, "data": {"author": self.user}})
            await self.channel_layer.group_send(f"user.{contact}", {"type": MessageType.Status.UPDATE, "data": {"author": self.user, "status": cmod.User.Status.ONLINE}})

        await self.accept()

    async def disconnect(self, close_code):
        if self.user is None:
            logger.info(f"[ANON] User is not authenticated.")
            return
        logger.info(f"[{self.user}] Disconnected. ({close_code})")
        await database_sync_to_async(set_offline)(self.user)
        await self.channel_layer.group_discard(self.GLOBAL_CHAT, self.channel_name)
        await self.channel_layer.group_discard(f"user.{self.user}", self.channel_name)
        contacts = await database_sync_to_async(get_friends)(self.user)
        for contact in contacts:
            logger.info(f"[{self.user}] Sending status update to {contact}.")
            await self.channel_layer.group_send(f"user.{contact}", {"type": MessageType.Status.UPDATE, "data": {"author": self.user, "status": cmod.User.Status.OFFLINE}})

    async def receive(self, text_data):

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
                case self.BLOCK_CHAT_CMD | self.UNBLOCK_CHAT_CMD:
                    await self._handle_block_command(message)
                case self.ADD_FRIEND_CMD | self.REMOVE_FRIEND_CMD | self.ACCEPT_FRIEND_CMD | self.DECLINE_FRIEND_CMD:
                    await self._handle_friend_command(message)
                case _:
                    self.error(f"Invalid command. ({message.split(' ')[0]})")
        else:
            await self._handle_public_message(message)

    async def _handle_block_command(self, message: str):
        logger.info(f"[{self.user}] Handling block command. ({message})")
        splitted_message = message.split(" ")
        if len(splitted_message) != 2:
            self.error(f"Invalid block command format. ({message})")
            return

        target = splitted_message[1]
        if target == self.user:
            print("Handling block command: You can't block yourself.", flush=True)
            self.error(f"You can't block yourself.")
            return
        else:
            print(f"Handling block command: {type(target)} and {type(self.user)}", flush=True)
            print(f"Handling block command: {target} and {self.user}", flush=True)

        if splitted_message[0] == self.BLOCK_CHAT_CMD:
            await database_sync_to_async(block_user)(self.user, target)
        elif splitted_message[0] == self.UNBLOCK_CHAT_CMD:
            await database_sync_to_async(unblock_user)(self.user, target)

    async def _handle_friend_command(self, message: str):
        logger.info(f"[{self.user}] Handling friend command. ({message})")
        splitted_message = message.split(" ")
        if len(splitted_message) != 2:
            self.error(f"Invalid friend command format. ({message})")
            return

        target = splitted_message[1]
        if target == self.user_id:
            self.error(f"You can't add/remove yourself.")
            return

        try :
            match splitted_message[0]:
                case self.ADD_FRIEND_CMD:
                    await database_sync_to_async(request_user)(self.user, target)
                    await self.channel_layer.group_send(f"user.{target}", {"type": MessageType.Relationship.REQUEST, "data": {"author": self.user}})
                case self.REMOVE_FRIEND_CMD:
                    await database_sync_to_async(remove_user)(self.user, target)
                    await self.channel_layer.group_send(f"user.{target}", {"type": MessageType.Relationship.REMOVE, "data": {"author": self.user}})
                    await self.channel_layer.group_send(f"user.{self.user}", {"type": MessageType.Relationship.REMOVE, "data": {"author": target}})
                case self.ACCEPT_FRIEND_CMD:
                    await database_sync_to_async(accept_user)(self.user, target)
                    await self.channel_layer.group_send(f"user.{target}", {"type": MessageType.Relationship.ACCEPT, "data": {"author": self.user}})
                    await self.channel_layer.group_send(f"user.{self.user}", {"type": MessageType.Relationship.ACCEPT, "data": {"author": target}})
                case self.DECLINE_FRIEND_CMD:
                    await database_sync_to_async(reject_user)(self.user, target)
                case _:
                    self.error(f"Invalid friend command. ({message})")
        except Exception as e:
            logger.info(f"[{self.user}] Error: {e}")
            self.error(e)
        

    async def _handle_private_message(self, message: str):
        logger.info(f"[{self.user}] Sending private message.")
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
            "author": self.user,
            "target": target,
            "is_author": False,
        }
        if await database_sync_to_async(get_relationship_status)(self.user, target) == cmod.Relationship.Status.BLOCKED or \
            await database_sync_to_async(get_relationship_status)(target, self.user) == cmod.Relationship.Status.BLOCKED:
            self.error(f"User {target} has blocked you.")
            return
        await self.channel_layer.group_send(f"user.{target}", {"type": MessageType.Chat.PRIVATE, "data": message_data})
        message_data["is_author"] = True
        await self.chat_private({"data": message_data})

    async def _handle_public_message(self, message: str):
        logger.info(f"[{self.user}] Sending public message : {message}")
        serializer = MessageSerializer(data={"type": cmod.Message.Type.PUBLIC, "author": self.user, "content": message})
        serializer.is_valid(raise_exception=True)
        message_data = {"content": message, "author": self.user}
        await self.channel_layer.group_send(
            self.GLOBAL_CHAT, {"type": MessageType.Chat.PUBLIC, "data": message_data}
        )

        await sync_to_async(serializer.save)()

    """
		These methods are called by the channel layer when a message is received /
		from the group or a private message is received.
	"""

    async def relationship_request(self, event):
        await self._json_send(MessageType.Relationship.REQUEST, event["data"])

    async def relationship_accept(self, event):
        await self._json_send(MessageType.Relationship.ACCEPT, event["data"])

    async def relationship_reject(self, event):
        await self._json_send(MessageType.Relationship.REJECT, event["data"])

    async def relationship_remove(self, event):
        await self._json_send(MessageType.Relationship.REMOVE, event["data"])

    async def status_request(self, event):
        await self.channel_layer.group_send(f"user.{event['data']['author']}", {"type": MessageType.Status.UPDATE, "data": {"author": self.user, "status": cmod.User.Status.ONLINE}})

    async def status_update(self, event):
        event["data"]["content"] = f"{event['data']['author']} is now {event['data']['status']}."
        await self._json_send(MessageType.Status.UPDATE, event["data"])

    async def chat_public(self, event):
        try:
            author = event["data"]["author"]
            if await database_sync_to_async(get_relationship_status)(self.user, author) == cmod.Relationship.Status.BLOCKED or \
                await database_sync_to_async(get_relationship_status)(author, self.user) == cmod.Relationship.Status.BLOCKED:
                return
        except KeyError:
            return
        await self._json_send(MessageType.Chat.PUBLIC, event["data"])

    async def chat_private(self, event):
        logger.info(f"[{self.user}] Sending private message: {event['data']}")
        await self._json_send(MessageType.Chat.PRIVATE, event["data"])

    async def error(self, error):
        logger.error(f"[{self.user}] Error: {error}")
        logger.info(f"[{self.user}] Error: {error}.")
        await self._json_send("error", {"error": error})

    async def _json_send(self, message_type: str, data: Dict[str, Any]):
        data["created_at"] = datetime.datetime.now().strftime("%H:%M")
        try:
            message = json.dumps({"type": message_type, "data": data})
            await self.send(text_data=message)
        except json.JSONDecodeError as e:
            await self.error(f"Invalid JSON format. ({e})")


def get_relationship_status(sender, receiver):
    try:
        return cmod.Relationship.objects.get(sender=sender, receiver=receiver).status
    except cmod.Relationship.DoesNotExist:
        return None
    
def block_user(sender, target):
    relationship, created = cmod.Relationship.objects.get_or_create(sender=sender, receiver=target)
    relationship.block()

def unblock_user(sender, target):
    relationship, created = cmod.Relationship.objects.get_or_create(sender=sender, receiver=target)
    relationship.unblock()

def request_user(sender, target):
    rel_status = get_relationship_status(sender, target)
    if rel_status != cmod.Relationship.Status.NEUTRAL and rel_status != None:
        raise Exception(f"You can't add {target}.")
    relationship, created = cmod.Relationship.objects.get_or_create(sender=sender, receiver=target)
    relationship.request()

def accept_user(sender, target):
    if get_relationship_status(target, sender) != cmod.Relationship.Status.PENDING:
        raise Exception(f"No request to accept from {target}.")
    relationship, created = cmod.Relationship.objects.get_or_create(sender=sender, receiver=target)
    relationship.accept()

def reject_user(sender, target):
    if get_relationship_status(target, sender) != cmod.Relationship.Status.PENDING:
        raise Exception(f"No request to reject from {target}.")
    relationship, created = cmod.Relationship.objects.get_or_create(sender=sender, receiver=target)
    relationship.reject()

def remove_user(sender, target):
    if get_relationship_status(sender, target) != cmod.Relationship.Status.ACCEPTED:
        raise Exception(f"No friendship to remove with {target}.")
    relationship, created = cmod.Relationship.objects.get_or_create(sender=sender, receiver=target)
    relationship.remove()

def get_friends(username):
    return list(cmod.User.objects.get(username=username).get_friends())

def set_offline(user):
    user = cmod.User.objects.get(username=user)
    user.offline()

def set_online(user):
    user = cmod.User.objects.get(username=user)
    user.online()