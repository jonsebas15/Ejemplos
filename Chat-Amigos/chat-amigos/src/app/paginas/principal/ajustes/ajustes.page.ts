import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar]
})
export class AjustesPage implements OnInit {
  private auth = inject(AuthService)
  constructor() { }

  ngOnInit() {
  }
  logout(){
    this.auth.logout();
  }
}
