import { Routes } from "@angular/router";

import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { CompletarSolicitudComponent } from "./completar-solicitud/completar-solicitud.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { RevisarSolicitudComponent } from "./revisar-solicitud/revisar-solicitud.component";

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
        path: "registrar-solicitud/:id/:idSolicitud",
        component: RegistrarSolicitudComponent,
        data: {
          title: "Registrar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Registrar Solicitud" }],
        },
      },
      {
        path: "completar-solicitud/:id/:idSolicitud",
        component: CompletarSolicitudComponent,
        data: {
          title: "Completar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Completar Solicitud" }],
        },
      },
      {
        path: "detalle-solicitud/:id",
        component: DetalleSolicitudComponent,
        data: {
          title: "Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Solicitud" }],
        },
      },
      {
        path: "revisar-solicitud/:id/:idSolicitud",
        component: RevisarSolicitudComponent,
        data: {
          title: "Revisar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Revisar Solicitud" }],
        },
      },
    ],
  },
];
