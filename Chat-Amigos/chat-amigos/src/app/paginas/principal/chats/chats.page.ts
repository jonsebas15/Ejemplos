import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonButton, IonIcon, IonModal, IonRadio } from '@ionic/angular/standalone';
import { addCircle } from 'ionicons/icons';
import { UsersComponent } from 'src/app/components/users/users.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonModal, IonIcon, IonButton, IonLabel, IonImg, IonAvatar, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, UsersComponent]
})
export class ChatsPage implements OnInit {

  constructor() { 
    addIcons({addCircle});
  }
  ngOnInit() {
  }

  chats = Array(10);
}
