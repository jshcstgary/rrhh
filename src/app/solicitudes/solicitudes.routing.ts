import { Routes } from "@angular/router";

import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { CompletarSolicitudComponent } from "./completar-solicitud/completar-solicitud.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { RevisarSolicitudComponent } from "./revisar-solicitud/revisar-solicitud.component";
import { RegistrarCandidatoComponent } from "./registrar-candidato/registrar-candidato.component";
import { CompletaSolicitudComponent } from "./completa-solicitud/completa-solicitud.component";
import { RegistrarFamiliaresComponent } from "./registrar-familiares/registrar-familiares.component";

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
          title: "Revisón de Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Revisón de Solicitud" }],
        },
      },
      {
        path: "registrar-candidato/:id/:idSolicitud",
        component: RegistrarCandidatoComponent,
        data: {
          title: "Seleccion de Candidato",
          urls: [{ title: "Solicitudes" }, { title: "Seleccion de Candidato" }],
        },
      },

      {
        path: "completa-solicitud/:id/:idSolicitud",
        component: CompletaSolicitudComponent,
        data: {
          title: "Completar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Completar Solicitud" }],
        },
      },

      {
        path: "registrar-familiares/:id/:idSolicitud",
        component: RegistrarFamiliaresComponent,
        data: {
          title: "Completar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Contratación de Familiares" }],
        },
      },
    ],
  },
];
