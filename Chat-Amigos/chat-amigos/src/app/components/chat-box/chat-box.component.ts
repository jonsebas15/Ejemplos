import { Component, input, OnInit} from '@angular/core';
import { IonItem, IonText, IonNote, IonIcon} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { checkmarkDoneCircleSharp, checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  standalone:true,
  imports: [IonItem, IonText, IonNote, IonIcon],
})
export class ChatBoxComponent  implements OnInit {

    chat = input<any>(null);
  constructor() { 
    addIcons({
      checkmarkDoneOutline
    })
  }

  ngOnInit() {}

}
