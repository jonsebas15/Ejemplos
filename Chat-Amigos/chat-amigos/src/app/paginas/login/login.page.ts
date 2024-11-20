import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonIcon, IonCard, IonInputPasswordToggle, IonList, IonButton, IonText, IonSpinner, IonFooter, IonAlert, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonModal, IonAlert, IonFooter, IonSpinner, IonText, IonButton, IonList, IonCard, IonIcon, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInputPasswordToggle, RouterLink]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  fpForm!: FormGroup;
  isLogin = signal<boolean>(false)
  isForgot = signal<boolean>(false)
  isFpModal = signal<boolean>(false)
  errorMessage = signal<string | null>(null);
  private auth = inject(AuthService);
  //private router = inject(Router)

  constructor() { 
    addIcons({mailOutline,lockClosedOutline});
  }

  ngOnInit() {
    this.form = new FormGroup({
      email:new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]})
    })
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.login(this.form.value);
  }
  async login(formValue:{email:string; password:string}){
    try {
      this.setIsLogin(true);
      await this.auth.login(formValue.email, formValue.password)
      this.setIsLogin(false)

      // navigate to tabs screen 
      //this.router.navigateByUrl('/principal',{ replaceUrl:true })
      this.auth.navigateByUrl('/principal')
      
      this.form.reset();
    } catch (e: any) {
      this.setIsLogin(false)
      console.log(e.code)

      let msg:string ='could not sign you up, please try again';
      if(e.code == 'auth/email-already-in-use'){
        msg = 'Este correo ya está registrado'
      }
      console.log(msg)
      this.setErrorMessage(msg);
    }
  }
  setIsLogin(value:boolean){
    this.isLogin.set(value)
  }
  setErrorMessage(value:string | null){
    this.errorMessage.set(value)
  }
  setFp(value:boolean){
    if(value == true){
      this.fpForm = new FormGroup({
        email:new FormControl(null,{validators:[Validators.email]})
      })
    }
    this.isFpModal.set(value)
  }
  setIsForgot(value:boolean){
    this.isForgot.set(value)
  }
  onFpSubmit(){
    if(this.fpForm.invalid){
      this.fpForm.markAllAsTouched();
      return;
    }
    console.log(this.fpForm.value);
    this.resetPassword(this.fpForm.value);
  }
  async resetPassword(email:string){
    try {
      this.setIsForgot(true)
      await this.auth.resetPassword(email);
      this.setIsForgot(false);

      this.setErrorMessage('reset password ñonl sent yo your emaiil id succesfully')
    } catch (error) {
      this.setIsForgot(false)
      console.log(error);
    }
  }
}
