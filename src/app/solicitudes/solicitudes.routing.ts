import { Routes } from "@angular/router";

import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { CompletarSolicitudComponent } from "./completar-solicitud/completar-solicitud.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";

export const SolicitudesRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "consulta-solicitudes",
        component: ConsultaSolicitudesComponent,
        data: {
          title: "Solicitudes",
          urls: [{ title: "Solicitudes" }, { title: "Consulta Solicitudes" }],
        },
      },
      {
        path: "registrar-solicitud/:id",
        component: RegistrarSolicitudComponent,
        data: {
          title: "Registrar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Registrar Solicitud" }],
        },
      },
      {
        path: "completar-solicitud/:id",
        component: CompletarSolicitudComponent,
        data: {
          title: "Completar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Completar Solicitud" }],
        },
      },
    ],
  },
];
