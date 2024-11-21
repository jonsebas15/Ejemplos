import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { onValue, query } from '@firebase/database';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/app/interface/user';
import { object } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  users = signal<User[] | null>([])

  private api= inject(ApiService)
  private auth = inject(AuthService)
  currentUserId = computed(()=> this.auth.uid())
  constructor() { 
    this.auth.getId();
  }
  getUsers(){
    const usersRef = this.api.getRef('users');

    //lista de los usuarios 
    onValue(usersRef,(snapshot)=>{
      if(snapshot?.exists()){
        const users = snapshot.val();
        console.log(users);

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
}
