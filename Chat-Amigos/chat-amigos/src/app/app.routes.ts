import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path:'principal',
    loadChildren:()=>import('./paginas/principal/principal.routes').then(m => m.routes)
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
