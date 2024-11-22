import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonFooter, IonTextarea, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ChatBoxComponent } from 'src/app/components/chat-box/chat-box.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { addIcons } from 'ionicons';
import { chatbubblesOutline, send } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonItem, IonTextarea, IonFooter, IonList, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ChatBoxComponent, EmptyScreenComponent, FormsModule]
})
export class ChatPage implements OnInit {

  name= signal<string | null>(null);
  id= signal<string | null>(null);
  message = signal<string | null>(null)
  private router = inject(ActivatedRoute)
  chats= signal([]);
  model = {
    icon:'chatbubbles-outline',
    title:'No hay converzaciones',
    color:'primary',
  }


  constructor() {
    addIcons({send,chatbubblesOutline});
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
    this.id.set(id)
  }

}
