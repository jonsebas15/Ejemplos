import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, IonImg, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, arrowBack, chatbubblesOutline } from 'ionicons/icons';
import { ChatRoom } from 'src/app/interface/chat-room';
import { ChatRoomService } from 'src/app/services/chat-room/chat-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
  standalone: true,
  imports: [IonImg, IonLabel, IonAvatar, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar,]
})
export class GruposPage implements OnInit {
  
  ngOnInit() {
  }
  private router = inject(Router)

  constructor() { 
    addIcons({addCircle,arrowBack,chatbubblesOutline});

  }

  getChat(){
    this.router.navigate(['/', 'principal','grupos', 1])
  }


}
