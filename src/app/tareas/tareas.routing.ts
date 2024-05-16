import { Routes } from "@angular/router";
import { ConsultaTareasComponent } from "./consulta-tareas/consulta-tareas.component";

export const TareasRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "consulta-tareas",
        component: ConsultaTareasComponent,
        data: {
          title: "Mis tareas",
          urls: [{ title: "Tareas" }, { title: "Consulta Tarea" }],
        },
      },
    ],
  },
];
