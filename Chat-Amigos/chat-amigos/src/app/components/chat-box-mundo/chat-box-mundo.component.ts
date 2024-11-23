import { Component, input, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { ChatGroup } from 'src/app/interface/chat-group';
import { IonItem, IonText, IonNote, IonIcon } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-box-mundo',
  templateUrl: './chat-box-mundo.component.html',
  styleUrls: ['./chat-box-mundo.component.scss'],
  standalone: true,
  imports: [IonIcon, IonNote, IonText, IonItem, DatePipe]
})
export class ChatBoxMundoComponent  implements OnInit {

  chat = input<ChatGroup | null>(null);
  constructor() { 
    addIcons({checkmarkDoneOutline});
  }

  ngOnInit() {}

  conociendo(alerta:any){
    console.log(alerta)
  }

}
