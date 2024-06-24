import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { LoginComponent } from './auth/pages/login/login.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      /*{ path: '', redirectTo: '/dashboard/dashboard1', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboards/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },*/
      { path: '', redirectTo: '/starter', pathMatch: 'full' },
      {
        path: 'starter',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
      {
        path: 'solicitudes',
        loadChildren: () =>
          import('./solicitudes/solicitudes.module').then(
            m => m.SolicitudesModule
          ),
      },
      {
        path: 'tareas',
        loadChildren: () =>
          import('./tareas/tareas.module').then(
            m => m.TareasModule
          ),
      },
      {
        path: 'mantenedores',
        loadChildren: () =>
          import('./mantenedores/mantenedores.module').then(
            m => m.MantenedoresModule
          ),
      },
    ],
  },
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./auth/auth.module').then(
            (m) => m.AuthModule
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/authentication/404',
  },
];
