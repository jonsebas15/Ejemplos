import { Component, computed, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonBackButton, IonButtons, IonItem, IonList, IonFooter, IonButton, IonSpinner, IonTextarea } from '@ionic/angular/standalone';
import { ChatService } from 'src/app/services/chat/chat.service';
import { addIcons } from 'ionicons';
import { chatbubblesOutline, ellipsisVertical, send } from 'ionicons/icons';
import { ChatBoxMundoComponent } from 'src/app/components/chat-box-mundo/chat-box-mundo.component';

@Component({
  selector: 'app-chat-mundo',
  templateUrl: './chat-mundo.page.html',
  styleUrls: ['./chat-mundo.page.scss'],
  standalone: true,
  imports: [IonTextarea, IonSpinner, IonButton, IonFooter, IonList, IonItem, IonButtons, IonBackButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar,  FormsModule, ChatBoxMundoComponent, ReactiveFormsModule ]
})
export class ChatMundoPage implements OnInit {

  content = viewChild<IonContent>(IonContent)
  message = signal<string | null>(null)
  private chatService = inject(ChatService)


  isLoading = signal<boolean>(false)

  model = {
    icon:'chatbubbles-outline',
    title:'No hay converzaciones',
    color:'primary',
  }

  chats = computed(()=> this.chatService.chatGroupMessages())


  constructor() {
    addIcons({ellipsisVertical,send,chatbubblesOutline});
   }

  ngOnInit() {

    this.chatService.getChatGroupMessages();
  }

  async sendMessage(){
    if(!this.message() || this.message()?.trim() == ''){
      return;
    }
    try {
      this.setIsLoading(true);
      await this.chatService.sendMessageGroup(this.message()!);

      this.message.set('')
      this.setIsLoading(false);
      this.scrollToBottom();
    } catch (error) {
      console.log(error)
      this.setIsLoading(false);
    }
  }

  setIsLoading(value:boolean){
    this.isLoading.set(value);
  }

  scrollToBottom(){
    this.content()?.scrollToBottom(500)
  }


}
