import { Routes } from '@angular/router';

import { ConsultaSolicitudesComponent } from './consulta_solicitudes/consulta-solicitudes.component';

export const SolicitudesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'consulta-solicitudes',
        component: ConsultaSolicitudesComponent,
        data: {
          title: 'Solicitudes',
          urls: [
            { title: 'Solicitudes' },
            { title: 'Consulta Solicitudes' },
          ],
        },
      },


    ],
  },
];
