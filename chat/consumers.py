import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		print("Connected")
		await self.channel_layer.group_add("chat", self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		print("Disconnected")
		await self.channel_layer.group_discard("chat", self.channel_name)

	async def receive(self, text_data):
		print("Received", text_data)
		event = json.loads(text_data)
		if event['type'] == 'chat_message':
			message = {
				"type": "chat_message",
				"data": {
					"message": event['data']['message'],
					"username": event['data']['username']
				}
			}
			await self.channel_layer.group_send("chat", message)

	async def chat_message(self, event):
		message = event['data']['message']
		username = event['data']['username']
		await self.send(text_data=json.dumps({
			"type": "chat_message",
			"data": {
				"message": message,
				"username": username
			}
		}))