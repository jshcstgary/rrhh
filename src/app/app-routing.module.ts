import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { authGuardActivate } from './guards/auth.guard';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/starter',
        pathMatch: 'full'
      },
      {
        path: 'starter',
        canActivate: [authGuardActivate],
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
      {
        path: 'solicitudes',
        canActivate: [authGuardActivate],
        loadChildren: () => import('./solicitudes/solicitudes.module').then(m => m.SolicitudesModule),
      },
      {
        path: 'tareas',
        canActivate: [authGuardActivate],
        loadChildren: () => import('./tareas/tareas.module').then(m => m.TareasModule),
      },
      {
        path: 'mantenedores',
        canActivate: [authGuardActivate],
        loadChildren: () => import('./mantenedores/mantenedores.module').then(m => m.MantenedoresModule),
      },
    ],
  },
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/authentication/404',
  },
];
