import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { onValue, query } from '@firebase/database';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/app/interface/user';
import { object } from '@angular/fire/database';
import { ChatRoom } from 'src/app/interface/chat-room';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  users = signal<User[] | null>([])
  chatrooms = signal<ChatRoom[] | null>([])

  private api= inject(ApiService)
  private auth = inject(AuthService)
  currentUserId = computed(()=> this.auth.uid())
  constructor() { 
    this.auth.getId();
    this.getChatRooms();
  }
  getUsers(){
    const usersRef = this.api.getRef('users');

    //lista de los usuarios 
    onValue(usersRef,(snapshot)=>{
      if(snapshot?.exists()){
        const users = snapshot.val();

        const usersArray: User[] = Object.values(users);
        
        const filteredUsers: User[] = usersArray.filter((user)=>{
          return user.uid !== this.currentUserId()
        })
        this.users.set(filteredUsers);
      } else{
        this.users.set([])
      }
    },(error)=>{
      console.error('Fetching real-time users list', error)
    })
  }

  async createChatRoom(userIds: string[], roomName:string, type: string = 'private'):Promise<any>{
    const chatRoomRef = this.api.getRef('chatrooms')
    const usersList = [this.currentUserId(), ...userIds];

    const sortedUserList = usersList.sort();
    const usersHash = sortedUserList.join(',');

    const existingChatRoomQuery = query(
      chatRoomRef,
      this.api.orderByChild('usersHash'), // consultas por usersHash
      this.api.equealTo(usersHash)
    );

    const existingChatRoomSnapshot = await this.api.getData(existingChatRoomQuery);
    if(existingChatRoomSnapshot?.exists()){

      const chatRooms = existingChatRoomSnapshot.val();

      //check for private chat room
      const privateChatRoom = Object.values(chatRooms).find((chatRoom:any)=> chatRoom.type === 'private')

      if(privateChatRoom){
        return privateChatRoom
      }
    }
    //if no matching private chat room eist, create a new one
    const newChatRoom = this.api.pushData(chatRoomRef)
    const chatRoomId = newChatRoom.key;
    const chatRoomData = {
      id: chatRoomId,
      users: sortedUserList,
      usersHash,
      name: roomName,
      type,
      createAt: new Date().toISOString(),
    };
    await this.api.setRefData(newChatRoom, chatRoomData)
    return chatRoomData
  }
  getChatRooms(){
    const chatroomsRef = this.api.getRef('chatrooms');

    //listen for realtime chats
    onValue(
      chatroomsRef,
      (snapshot)=>{
        if(snapshot?.exists()){
          const chatrooms = snapshot.val();

          const chatroomkeys = Object.keys(chatrooms);

          const chatroomData = chatroomkeys.map((roomId)=>{
            const room = chatrooms[roomId];

            // check if current user is part of the chatroom
            if(room.type == 'private' && room.users.includes(this.currentUserId())){  
              //find the other user in the chatroom
              const otherUserId = room.users.find((userId: string)=>{
                return userId !== this.currentUserId()
              });

              //fetch the other user and last message
              return this.getUserDataAndLastMessage(
                otherUserId,
                roomId,
                room,
                room.messages
              );
             }/*else {
              //group chat
            } */
            return null;
          });

          //execute all promises and filter our not 
          Promise.all(chatroomData).then((chatroomswithDetails)=>{
            const validChatrooms = chatroomswithDetails.filter((room)=> room !== null);
            this.chatrooms.set(validChatrooms as ChatRoom[]);
          })
          .catch(e=>{
            console.log(e)
          });
        }else{
          //no chatrooms founds
          this.chatrooms.set([])
        }
      }
    )
  }

  private async getUserDataAndLastMessage( 
    otherUserId: string,
    roomId: string,
    room: any,
    messages: any
  ){
    try {
      //fetch other user datails
      const userRef = this.api.getRef(`users/${otherUserId}`);
      const snapshot = await this.api.getData(userRef);
      const user = snapshot?.exists() ? snapshot.val():null;

      //fetch last message

      let lastMessage: any = null
      if(messages){
        const messageArray = Object.values(messages);
        const sorteMessages = messageArray.sort((a:any, b:any)=>b.timestamp - a.timestap);

        lastMessage = sorteMessages[0]
      }
       // const lastMessage = messages ? Object.values(messages).sort((a:any, b:any)=>b.timestamp - a.timestap)[0]:null;

       //return structured data for the chatroom
       const roomUserData: ChatRoom = {
        roomId,
        name: user?.name || null,
        photo: user?.photo || null,
        room,
        lastMessage: lastMessage?.message || null,
        lastMessageTimestamp : lastMessage?.timestamp || null,
       };

       return roomUserData
    } catch (error) {
      console.log(error)
      return null
    }

  }
}
