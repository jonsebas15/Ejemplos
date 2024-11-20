import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

export const authGuard: CanMatchFn = async (route, segments) => {
  try {
    const auth = inject(AuthService);

    const user = await auth.checkAuth();
    if(user){
      return true
    }
    //navigate to login 
    auth.navigateByUrl('/login')
    return false;
  } catch (error) {
    console.log(error)
    throw error
  }
 
};
