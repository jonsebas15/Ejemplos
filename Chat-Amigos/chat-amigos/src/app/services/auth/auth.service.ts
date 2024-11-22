import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { StringFormat } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uid = signal<string | null>(null);
  private fireAuth = inject(Auth)
  private router = inject(Router)
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
        photo:'https://i.pravatar.cc/'+this.randomIntFromInterval(200,400),
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
  checkAuth(){
    return new Promise((resolve, reject)=>{
      onAuthStateChanged(this.fireAuth, (user)=>{
        resolve(user);
      },
      (error)=>{console.log(error); reject(error)})
    })
  }

  navigateByUrl(path: string){
    this.router.navigateByUrl(path,{ replaceUrl: true })
  }
  async getUserData(id: string){
    try {
      const userRef = this.api.getRef(`user/${id}`);
      const snapshot = await this.api.getData(userRef);
      if(snapshot?.exists()){
        return snapshot.val();
      }else{
        throw new Error("usuario no existe")
      } 
    }
      catch (error) {
      console.log(error)
      throw error
    }

  }
  async logout(){
    try {
      
      await this.fireAuth.signOut()

      this.uid.set(null)
      this.navigateByUrl('/login');
      return true
    } catch (error) {
      console.log(error)
      throw error
    }
  }
    
}
