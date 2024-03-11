import { Routes } from '@angular/router';

import { LaboresRealizadasComponent } from './labores_realizadas/labores-realizadas.component';
import { CrearLaboresRealizadasComponent } from './crear_labores_agricolas/crear-labores-realizadas.component';

export const LaboresAgricolasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'labores-realizadas',
        component: LaboresRealizadasComponent,
        data: {
          title: 'Labores Realizadas',
          urls: [
            { title: 'Labores Agricolas' },
            { title: 'Labores Realizadas' },
          ],
        },
      },
      {
        path: 'crear-labores-realizadas',
        component: CrearLaboresRealizadasComponent,
        data: {
          title: 'Crear Labores Realizadas',
          urls: [
            { title: 'Labores Agricolas' },
            { title: 'Labores Realizadas' },
          ],
        },
      },
    ],
  },
];
