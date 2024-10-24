import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        request_user = self.scope['user']
        print("User: ", request_user)
        if request_user.is_authenticated:
            chat_with_user = self.scope['url_route']['kwargs']['id']
            user_ids = [str(request_user.id), str(chat_with_user)]
            user_ids = sorted(user_ids)
            self.room_group_name = f'chat_{"-".join(user_ids)}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        user_id = str(self.scope['user'].id)  
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": 'chat_message',
                "message": message,
                "user_id": user_id  
            }
        )

    async def disconnect(self, code):
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def chat_message(self, event):
        message = event['message']
        sender_user_id = event['user_id']  
        
        await self.send(text_data=json.dumps({
            "message": message,
            "userId": sender_user_id 
        }))
