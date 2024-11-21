import { Component, input, OnInit, output } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonImg, IonLabel } from "@ionic/angular/standalone";
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [IonLabel, IonImg, IonAvatar, IonItem, IonList, IonContent, IonIcon, IonButtons, IonButton, IonTitle, IonToolbar, IonHeader, ]
})
export class UsersComponent  implements OnInit {
 users = input<User[] | null>([]);
 close = output<boolean>();
 user = output<User>();
  constructor() { }

  ngOnInit() {}
  
  closeModal(){
    this.close.emit(true)
  }
  startChat(user:User){
    this.user.emit(user)
  }

}
