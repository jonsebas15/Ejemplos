import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonButton, IonIcon, IonModal, IonRadio, IonButtons } from '@ionic/angular/standalone';
import { addCircle, arrowBack } from 'ionicons/icons';
import { UsersComponent } from 'src/app/components/users/users.component';
import { ChatRoomService } from 'src/app/services/chat-room/chat-room.service';
import { User } from 'src/app/interface/user';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonButtons, IonModal, IonIcon, IonButton, IonLabel, IonImg, IonAvatar, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, UsersComponent]
})
export class ChatsPage implements OnInit {

  isNewChat = signal<boolean>(false)

  private router = inject(Router)
  private chatroom = inject(ChatRoomService)
  users = computed<User[] | null>(()=>this.chatroom.users())

  constructor() { 
    addIcons({addCircle,arrowBack});
    
  }
  ngOnInit() {
  }

  chats = Array(10);
  setIsNewChat(value:boolean){
    //call users data
    if(this.users() || this.users()?.length! == 0){
      this.chatroom.getUsers();
      
    }
    this.isNewChat.set(value)
  }
  async startChat(user:User, modal: IonModal){
    try {
      const room = await this.chatroom.createChatRoom([user.uid], user.name); 
      //dismiss modal
      modal.dismiss();

      //navigate to chat
      const navData: NavigationExtras ={
        queryParams: {
          name:user?.name
        }
      }
      this.router.navigate(['/', 'principal','chats', room?.id], navData)
    } catch (error) {
      console.log(error);
    }
  }
}