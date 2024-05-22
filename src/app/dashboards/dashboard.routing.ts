import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { Dashboard4Component } from './dashboard4/dashboard4.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: Dashboard1Component,
        data: {
          title: 'Minimal Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Minimal Dashboard' }
          ]
        }
      },
      {
        path: 'dashboard2',
        component: Dashboard2Component,
        data: {
          title: 'Demographical Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Demographical Dashboard' }
          ]
        }
      },
      {
        path: 'dashboard3',
        component: Dashboard3Component,
        data: {
          title: 'Modern Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Modern Dashboard' }
          ]
        }
      },
      {
        path: 'dashboard4',
        component: Dashboard4Component,
        data: {
          title: 'Analytical Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Analytical Dashboard' }
          ]
        }
      }
    ]
  }
];
