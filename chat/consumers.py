import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import datetime
from typing import Dict, Any

"""
	ChatConsumer class is a subclass of AsyncWebsocketConsumer, which is a class provided by Django Channels.
	AsyncWebsocketConsumer is a class that provides a simple interface for handling WebSockets.
	We define the methods connect, disconnect, and receive to handle the WebSocket connection lifecycle.
"""

class ChatConsumer(AsyncWebsocketConsumer):
	GLOBAL_CHAT = "chat"
	PRIVATE_CHAT_CMD = "/w"

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user_id = None

	async def connect(self):
		self.session = await sync_to_async( self.scope["session"].load)()
		if "user_info" in self.session:
			self.user_id = self.session['user_info']['login']
		await self.channel_layer.group_add(self.GLOBAL_CHAT, self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		if self.user_id:
			await self.channel_layer.group_discard(self.GLOBAL_CHAT, self.channel_name)

	async def receive(self, text_data):
		event = json.loads(text_data)
		if event['type'] == 'chat_message':
			await self._handle_chat_message(event)

	"""
		Rooting functions for handling chat messages.
	"""

	async def _handle_chat_message(self, event: Dict[str, Any]):
		message = event["data"]["message"]
		if message.startswith(self.PRIVATE_CHAT_CMD):
			await self._handle_private_message(message)
		else:
			await self._handle_public_message(message)

	async def _handle_private_message(self,message: str):
		splitted_message = message.split(" ")
		if len(splitted_message) < 3:
			return

		recipient = splitted_message[1]
		content = " ".join(splitted_message[2:])

		message_data = {
			"message": content,
			"sender": self.user_id,
			"recipient": recipient
		}
		await self.channel_layer.send(f"user.{recipient}", {
			"type": "chat.private_message",
			"is_sender": False,
			"data": message_data
		})
		await self.chat_private_message({"is_sender": True, "data": message_data})

	async def _handle_public_message(self, message: str):
		message_data = {
			"message": message,
			"sender": self.user_id
		}
		await self.channel_layer.group_send(self.GLOBAL_CHAT, {
			"type": "chat.message",
			"data": message_data
		})

	""" 
		These methods are called by the channel layer when a message is received /
		from the group or a private message is received.
	"""
	
	async def chat_message(self, event):
		await self._send_message_to_client("chat_message", event['data'])

	async def chat_private_message(self, event):
		message_type = "chat_message_private_sent" if event['is_sender'] else "chat_message_private_received"
		await self._send_message_to_client(message_type, event['data'])

	async def _send_message_to_client(self, message_type:str, data: Dict[str, Any]):
		data["timestamp"] = datetime.datetime.now().strftime("%H:%M")
		await self.send(text_data=json.dumps({
			"type": message_type,
			"data": data
		}))