import { Routes } from '@angular/router';

import { ConsultaTareaComponent } from './consulta_tarea/consulta-tarea.component';

export const TareasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'consulta-tarea',
        component: ConsultaTareaComponent,
        data: {
          title: 'Tareas',
          urls: [
            { title: 'Tareas' },
            { title: 'Consulta Tarea' },
          ],
        },
      },


    ],
  },
];
