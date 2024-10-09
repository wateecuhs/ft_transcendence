import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.session = await sync_to_async( self.scope["session"].load)()
		print(self.session)
		if "user_info" in self.session:
			await self.channel_layer.group_add(f"user_{self.session['user_info']['login']}", self.channel_name)
		await self.channel_layer.group_add("chat", self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		print("Disconnected")
		await self.channel_layer.group_discard("chat", self.channel_name)

	async def receive(self, text_data):
		print("Received", text_data)
		event = json.loads(text_data)

		if event['type'] == 'chat_message':
			if event['data']['message'].startswith("/"):
				print("Command", event['data']['message'].split(" ")[0])
				if event['data']['message'].split(" ")[0] == "/w":
					print("Whisper")
					recipient = event['data']['message'].split(" ")[1]
					message = {
						"type": "chat_message_private",
						"data": {
							"message": " ".join(event['data']['message'].split(" ")[2:]),
							"sender": self.session["user_info"]["login"],
							"recipient": recipient
						}
					}
					await self.channel_layer.group_send(f"user_{self.session['user_info']['login']}", message)
					await self.channel_layer.group_send(f"user_{recipient}", message)
			else:
				message = {
					"type": "chat_message",
					"data": {
						"message": event['data']['message'],
						"sender": self.session["user_info"]["login"]
					}
				}
				await self.channel_layer.group_send("chat", message)

	async def chat_message(self, event):
		print("Chat message", event)
		message = event['data']['message']
		sender = event['data']['sender']
		await self.send(text_data=json.dumps({
			"type": "chat_message",
			"data": {
				"message": message,
				"sender": sender
			}
		}))
	
	async def chat_message_private(self, event):
		print("Chat message private", event)
		message = event['data']['message']
		sender = event['data']['sender']
		await self.send(text_data=json.dumps({
			"type": "chat_message",
			"data": {
				"message": message,
				"sender": sender
			}
		}))