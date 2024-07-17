import { Routes } from "@angular/router";
import { ConsultaTareasComponent } from "./consulta-tareas/consulta-tareas.component";
import { tareasGuard } from "../guards/tareas.guard";

export const TareasRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "consulta-tareas",
        canActivate: [tareasGuard],
        component: ConsultaTareasComponent,
        data: {
          title: "Mis tareas",
          urls: [
            {
              title: "Tareas"
            },
            {
              title: "Consulta Tarea"
            }
          ],
        },
      },
    ],
  },
];
