import { Routes } from "@angular/router";
import { PrincipalPage } from './principal.page'

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/principal/chats',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PrincipalPage,
    children: [
      {
        path: 'principal',
        loadComponent: () => import('./principal.page').then(m => m.PrincipalPage)
      },
      {
        path: 'chats',
        loadComponent: () => import('./chats/chats.page').then(m => m.ChatsPage)
      },
      {
        path: 'grupos',
        loadComponent: () => import('./grupos/grupos.page').then(m => m.GruposPage)
      },
      {
        path: 'publicaciones',
        loadComponent: () => import('./publicaciones/publicaciones.page').then(m => m.PublicacionesPage)
      },
      {
        path: 'ajustes',
        loadComponent: () => import('./ajustes/ajustes.page').then(m => m.AjustesPage)
      },
    ]
  },
]