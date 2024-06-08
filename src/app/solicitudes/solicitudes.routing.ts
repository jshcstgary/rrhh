import { Routes } from "@angular/router";

import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { RevisarSolicitudComponent } from "./revisar-solicitud/revisar-solicitud.component";
import { RegistrarCandidatoComponent } from "./registrar-candidato/registrar-candidato.component";
import { CompletaSolicitudComponent } from "./completa-solicitud/completa-solicitud.component";
import { ReingresoPersonalComponent } from "./reingreso-personal/reingreso-personal.component";
import { RegistrarFamiliaresComponent } from "./registrar-familiares/registrar-familiares.component";
import { RegistroComentariosComponent } from "./registro-comentarios (h17)/registro-comentarios.component";

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
          title: "Revisión de Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Revisión de Solicitud" }],
        },
      },
      {
        path: "reingreso-personal/:id/:idSolicitud",
        component: ReingresoPersonalComponent,
        data: {
          title: "Reingreso de personal",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Reingreso de personal"
            }
          ],
        },
      },
      {
        path: "reingreso-personal/registro-comentarios",
        component: RegistroComentariosComponent,
        data: {
          title: "Registro de Comentarios",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Registro de Comentarios"
            }
          ],
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
