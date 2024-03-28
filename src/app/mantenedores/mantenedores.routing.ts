import { Routes } from '@angular/router';

import { TipoSolicitudComponent } from './tipo_solicitud/tipo-solicitud.component';
import { TipoMotivoComponent } from './tipo_motivo/tipo-motivo.component';
import { TipoAccionComponent } from './tipo_accion/tipo-accion.component';
import { TipoProcesoComponent } from './tipo_proceso/tipo-proceso.component';
import { TipoRutaComponent } from './tipo_ruta/tipo-ruta.component';
import { RutaComponent } from './ruta/ruta.component';
import { AccionComponent } from './accion/accion.component';


export const MantenedoresRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tipo-solicitud',
        component: TipoSolicitudComponent,
        data: {
          title: 'Tipo de Solicitudes',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Tipo de Solicitudes' },
          ],
        },
      },
      {
        path: 'tipo-motivo',
        component: TipoMotivoComponent,
        data: {
          title: 'Tipo motivo',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Tipo Motivo' },
          ],
        },
      },
      {
        path: 'tipo-accion',
        component: TipoAccionComponent,
        data: {
          title: 'Tipo accion',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Tipo Accion' },
          ],
        },
      },
      {
        path: 'tipo-proceso',
        component: TipoProcesoComponent,
        data: {
          title: 'Tipo proceso',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Tipo Proceso' },
          ],
        },
      },
      {
        path: 'tipo-ruta',
        component: TipoRutaComponent,
        data: {
          title: 'Tipo ruta',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Tipo Ruta' },
          ],
        },
      },
      {
        path: 'ruta',
        component: RutaComponent,
        data: {
          title: 'Ruta',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Ruta' },
          ],
        },
      },
      {
        path: 'accion',
        component: AccionComponent,
        data: {
          title: 'Accion',
          urls: [
            { title: 'Mantenimiento' },
            { title: 'Accion' },
          ],
        },
      },
    ],
  },
];
