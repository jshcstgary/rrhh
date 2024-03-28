import { Routes } from '@angular/router';

import { ConsultaSolicitudesComponent } from './consulta_solicitudes/consulta-solicitudes.component';
import { RegistrarSolicitudComponent } from './registrar-solicitud/registrar-solicitud.component';

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
      {
        path: 'registrar-solicitud',
        component: RegistrarSolicitudComponent,
        data: {
          title: 'Completar Solicitud',
          urls: [
            { title: 'Solicitudes' },
            { title: 'Completar Solicitud' },
          ],
        },
      },

    ],
  },
];
