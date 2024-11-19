import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uid = signal<string | null>(null);
  private fireAuth = inject(Auth)
  private api = inject(ApiService)
  constructor() { }
  setData(uid:string | null){
    if(!this.uid())
      this.uid.set(uid)
  }
  getId(){
    const auth = getAuth();
    const uid = auth.currentUser?.uid || null;
    this.setData(uid);
    return uid;
  }

  async register(data :{name: string, email: string, password:string}):Promise<{id:string}> {
    try{
      const register = await createUserWithEmailAndPassword(
        this.fireAuth,
        data.email,
        data.password
      ) ;
      const id = register.user.uid;

      const userData ={
        name:data.name,
        email: data.email,
        uid:id,
        photo:'https://i.pravatar.cc'+this.randomIntFromInterval(200,400),
      }
      //set data in database
      await this.api.setData(`users/${id}`, userData);
      this.setData(id);

      return {id}
    } catch(e){
      console.log(e)
      throw e;
    }
  }

  randomIntFromInterval(min:number, max:number):number{
    return Math.floor(Math.random()*(max-min +1)+min);
  }

  async login(email: string, password:string) {
    try{
      const response = await signInWithEmailAndPassword(this.fireAuth, email, password) ;
      if(response?.user){
        //guardar dato
        this.setData(response?.user?.uid);
      }
    } catch(e){
      console.log(e)
      throw e;
    }
  }


  async resetPassword(email:string){
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}