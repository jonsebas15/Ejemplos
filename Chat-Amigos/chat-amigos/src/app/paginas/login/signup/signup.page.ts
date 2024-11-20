import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonIcon, IonButton, IonSpinner, IonFooter, IonText, IonInput, IonInputPasswordToggle, IonBackButton, IonButtons, IonAlert } from '@ionic/angular/standalone';
import { lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonAlert, IonButtons, IonBackButton, IonText, IonFooter, IonSpinner, IonButton, IonIcon, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,IonInput, IonInputPasswordToggle]
})
export class SignupPage implements OnInit {

  private auth = inject(AuthService)
  //private router = inject(Router)
  errorMessage = signal<string | null>(null);

  form!: FormGroup;
  isSingup = signal<boolean>(false)
  constructor() { 
    addIcons({mailOutline,lockClosedOutline,personOutline});
  }

  ngOnInit() {
    this.form = new FormGroup({
      email:new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
      name: new FormControl(null, {validators: [Validators.required]})
    })
  }
  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value)
    this.signup(this.form.value);
  }
  async signup(formValue:{name:string; email:string; password:string}){
    try {
      this.setIsSignup(true);
      const { id } = await this.auth.register(formValue)
      this.setIsSignup(false)

      // navigate to tabs screen 
      //this.router.navigateByUrl('/principal',{ replaceUrl:true })
      this.auth.navigateByUrl('/principal')
      
      this.form.reset();
    } catch (e: any) {
      this.setIsSignup(false)
      console.log(e.code)

      let msg:string ='could not sign you up, please try again';
      if(e.code == 'auth/email-already-in-use'){
        msg = 'Este correo ya está registrado'
      }
      console.log(msg)
      this.setErrorMessage(msg);
    }
  }
  setIsSignup(value:boolean){
    this.isSingup.set(value)
  }
  setErrorMessage(value:string | null){
    this.errorMessage.set(value)
  }
}
