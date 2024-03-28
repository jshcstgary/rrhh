import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard/dashboard1', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboards/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
     /* {
        path: 'cards',
        loadChildren: () =>
          import('./cards/cards.module').then((m) => m.CardsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./charts/charts.module').then((m) => m.ChartModule),
      },
      { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
      {
        path: 'ecom',
        loadChildren: () =>
          import('./ecommerce/ecom.module').then((m) => m.EcomModule),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./table/tables.module').then((m) => m.TablesModule),
      },

      {
        path: 'timeline',
        loadChildren: () =>
          import('./timeline/timeline.module').then((m) => m.TimelineModule),
      },
      {
        path: 'extra-component',
        loadChildren: () =>
          import('./extra-component/extra-component.module').then(
            (m) => m.ExtraComponentModule
          ),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./icons/icons.module').then((m) => m.IconsModule),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./form/forms.module').then((m) => m.FormModule),
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./starter/starter.module').then((m) => m.StarterModule),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./widgets/widgets.module').then((m) => m.WidgetsModule),
      },
      {
        path: 'component',
        loadChildren: () =>
          import('./component/component.module').then(
            (m) => m.ComponentsModule
          ),
      },
      {
        path: 'sample-pages',
        loadChildren: () =>
          import('./sample-pages/sample-pages.module').then(
            (m) => m.SamplePagesModule
          ),
      },*/
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
