import { Component, OnInit, signal } from '@angular/core';

import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesOutline, peopleOutline, chatboxOutline, settingsOutline, chatbubbles, settings, chatbox, people } from 'ionicons/icons'
@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTabButton, IonTabBar, IonTabs]
})
export class PrincipalPage implements OnInit {
  seleccionar = signal<string>('');

  constructor() { 
    addIcons({chatbubblesOutline,peopleOutline,chatboxOutline,settingsOutline, chatbubbles, settings, chatbox, people});
  }

  ngOnInit() {
  }
  seleccionado(event: any){
    console.log(event);
    this.seleccionar.set(event?.tab)
  }
}
