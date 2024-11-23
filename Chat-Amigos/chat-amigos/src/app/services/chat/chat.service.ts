import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Chat } from 'src/app/interface/chat';
import { AuthService } from '../auth/auth.service';
import { DatabaseReference, off, onValue, remove } from '@angular/fire/database';
import { ChatGroup } from 'src/app/interface/chat-group';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatMessages = signal<Chat[] | null>([]);
  chatGroupMessages = signal<ChatGroup[] | null>([]);

  private chatsRef:DatabaseReference | null = null;
  private chatListener: any = null ;
  private friendRef:DatabaseReference | null = null

  private auth = inject(AuthService);
  private api = inject(ApiService);

  currentUserId = computed(()=> this.auth.uid())
  

  constructor() { 
    this.auth.getId();
  
  }

  async sendMessage(chatroomId:string, message: string){
    try {

      const chatsRef = this.api.getRef(`chatrooms/${chatroomId}/messages`);
      //prepare message object
      const chatData: Chat ={
        senderId :this.currentUserId()!,
        message,
        timestamp: Date.now(),
      }
  
      //push new message
      const newMessageRef = this.api.pushData(chatsRef);
      await this.api.setRefData(newMessageRef, chatData);
    } catch (error) {
      throw(error)
    }

  }

  async sendMessageGroup(message: string){
    try {

      const chatsRef = this.api.getRef(`chatrooms/group/messagesGroup`);
      //prepare message object
      const chatData:ChatGroup ={
        senderId:this.currentUserId()!,
        message,
        timestamp: Date.now(),
      }
  
      //push new message
      const newMessageRef = this.api.pushData(chatsRef);
      await this.api.setRefData(newMessageRef, chatData);
    } catch (error) {
      throw(error)
    }

  }

    getChatMessages(chatroomId:string){
      this.chatsRef = this.api.getRef(`chatrooms/${chatroomId}/messages`);

      //listen for realtime update to the chat messages
      this.chatListener = onValue(this.chatsRef, (snapshot)=>{
        if(snapshot?.exists()){
          const messages = snapshot.val();


          const messagesArray:Chat[] = Object.keys(messages).map(messageId =>({
            id:messageId,
            ...messages[messageId],
            isCurrentUser: messages[messageId].senderId == this.currentUserId()?true : false,
          }));
          this.chatMessages.set(messagesArray);
        }else{
          this.chatMessages.set([]);
        }
      },(error)=>{
        console.error(error)
      })
    }

    getChatGroupMessages(){
      this.chatsRef = this.api.getRef(`chatrooms/group/messagesGroup`);
      //listen for realtime update to the chat messages
      this.chatListener = onValue(this.chatsRef, (snapshot)=>{
        if(snapshot?.exists()){
          const messages = snapshot.val();

          const messagesArray:ChatGroup[] = Object.keys(messages).map(messageId =>({
            id:messageId,
            ...messages[messageId],
            isCurrentUser: messages[messageId].senderId == this.currentUserId()?true : false,
          }));

          this.chatGroupMessages.set(messagesArray);
        }else{
          this.chatGroupMessages.set([]);
        }
      },(error)=>{
        console.error(error)
      })
    }

    /* unsubscribeChats(){
      if(this.chatsRef){
        off(this.chatsRef, 'value', this.chatListener);
        this.chatsRef = null; //reset the reference
        this.chatListener = null;
      }
    } */

    async deleteMessages(chatRoomId: string ): Promise<void> {
      try {
        this.chatsRef = this.api.getRef(`chatrooms/${chatRoomId}/messages`);
        // Elimina los mensajes
        await remove(this.chatsRef);
        console.log(`Mensajes en el chatroom ${chatRoomId} eliminados exitosamente.`);
      } catch (error) {
        console.error('Error al eliminar los mensajes:', error);
      }
    }

    async deleteFriend(chatRoomId: string ): Promise<void> {
      try {
        this.friendRef = this.api.getRef(`chatrooms/${chatRoomId}`);

        await remove(this.friendRef);
        console.log(`chat de amigo ${chatRoomId} eliminados `);
      } catch (error) {
        console.error('Error al eliminar chaat:', error);
      }
    }
}
