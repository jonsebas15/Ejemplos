import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full',
  },
  {
    path:'principal',
    loadChildren:()=>import('./paginas/principal/principal.routes').then(m => m.routes),
    canMatch:[authGuard]
  },
  {
    path: 'login',
    children:[
      {
        path: '',
        loadComponent: () => import('./paginas/login/login.page').then( m => m.LoginPage),
      },
      {
        path: 'signup',
        loadComponent: () => import('./paginas/login/signup/signup.page').then( m => m.SignupPage)
      }
    ]
  },
  
];
