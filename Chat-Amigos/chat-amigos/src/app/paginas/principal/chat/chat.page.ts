import { Component, computed, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonFooter, IonTextarea, IonItem, IonButton, IonIcon, IonSpinner, IonPopover } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatBoxComponent } from 'src/app/components/chat-box/chat-box.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { addIcons } from 'ionicons';
import { chatbubblesOutline, send, ellipsisVertical } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonPopover, IonSpinner, IonIcon, IonButton, IonItem, IonTextarea, IonFooter, IonList, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ChatBoxComponent, EmptyScreenComponent, FormsModule]
})
export class ChatPage implements OnInit {


  content = viewChild<IonContent>(IonContent)
  name= signal<string | null>(null);
  id= signal<string | null>(null);
  message = signal<string | null>(null)
  private router = inject(ActivatedRoute)
  private routerNav = inject(Router)
  private chatService = inject(ChatService)

  isMenuOpen = false; 
  event: any = null;

  isLoading = signal<boolean>(false)

  model = {
    icon:'chatbubbles-outline',
    title:'No hay converzaciones',
    color:'primary',
  }

  chats = computed(()=> this.chatService.chatMessages())


  constructor() {
    addIcons({ellipsisVertical,send,chatbubblesOutline});
    effect(()=>{
      if(this.chats() && this.chats()?.length!) {
        setTimeout(()=>{
          this.scrollToBottom()
        },500)
      
      }
    })
   }

  ngOnInit() {
    const data: any = this.router.snapshot.queryParams;
    if(data?.name){
      this.name.set(data.name)
    }
    const id = this.router.snapshot.paramMap.get('id');
    if(!id){
      return;
    }
    this.id.set(id);

    this.chatService.getChatMessages(id);
  }

  async sendMessage(){
    if(!this.message() || this.message()?.trim() == ''){
      //show a toast message
      return;
    }
    try {
      this.setIsLoading(true);
      await this.chatService.sendMessage(this.id()!, this.message()!);

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
 /*  ngOnDestroy(){
    this.chatService.unsubscribeChats();
  } */
  clearMessages(){
    this.chatService.deleteMessages(this.id()!)
    this.closeMenu();
  }
  clearFriend(){
    this.closeMenu();
    this.chatService.deleteFriend(this.id()!)
    this.routerNav.navigate(['/', 'principal','chats',])
  }


  openMenu(event: Event) {
    this.isMenuOpen = true; 
    this.event = event; 
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

}
