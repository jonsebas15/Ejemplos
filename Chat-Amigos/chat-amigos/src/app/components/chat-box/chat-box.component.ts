import { DatePipe } from '@angular/common';
import { Component, input, OnInit} from '@angular/core';
import { IonItem, IonText, IonNote, IonIcon} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { Chat } from 'src/app/interface/chat';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  standalone:true,
  imports: [IonItem, IonText, IonNote, IonIcon, DatePipe],
})
export class ChatBoxComponent  implements OnInit {

    chat = input<Chat | null>(null);
  constructor() { 
    addIcons({
      checkmarkDoneOutline
    })
  }

  ngOnInit() {}

  conociendo(alerta:any){
    console.log(alerta)
  }
}
