import { Component, input, OnInit } from '@angular/core';
import { IonRow, IonCol, IonGrid, IonIcon, IonLabel} from "@ionic/angular/standalone";

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonGrid, IonCol, IonRow, ],
})
export class EmptyScreenComponent  implements OnInit {

    model = input<any>();
  constructor() { }

  ngOnInit() {}

}
