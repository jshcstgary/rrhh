import { Routes } from "@angular/router";

import { CompletaSolicitudComponent } from "./completa-solicitud/completa-solicitud.component";
import { CompletarAccionPersonalComponent as h21 } from "./completar-accion-personal/completar-accion-personal.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { RegistrarAccionPersonalComponent } from "./registrar-accion-personal/registrar-accion-personal.component";
import { RegistrarCandidatoComponent } from "./registrar-candidato/registrar-candidato.component";
import { RegistrarComentarioReingresoComponent as h19 } from "./registrar-comentario-reingreso/registrar-comentario-reingreso.component";
import { RegistrarComentarioSalidaJefeComponent } from "./registrar-comentario-salida-jefe/registrar-comentario-salida-jefe.component";
import { RegistrarComentarioSalidaRRHHComponent as h18 } from "./registrar-comentario-salida-rrhh/registrar-comentario-salida-rrhh.component";
import { RegistrarFamiliaresComponent } from "./registrar-familiares/registrar-familiares.component";
import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { ReingresoPersonalComponent } from "./reingreso-personal/reingreso-personal.component";
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
        path: "registrar-familiares/:id/:idSolicitud",
        component: RegistrarFamiliaresComponent,
        data: {
          title: "Completar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Contratación de Familiares" }],
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
        path: "reingreso-personal/registro-comentarios-jefe/:id/:idSolicitud",
        component: RegistrarComentarioSalidaJefeComponent,
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
        path: "reingreso-personal/registro-comentarios-rrhh/:id/:idSolicitud",
        component: h18,
        data: {
          title: "Registro de Comentarios h18",
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
        path: "reingreso-personal/registrar-comentarios-solicitante/:id/:idSolicitud",
        component: h19,
        data: {
          title: "Registro de Comentarios h19",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Registro de Comentarios H19"
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
        path: 'accion-personal/registrar-solicitud/:id/:idSolicitud',
        component: RegistrarAccionPersonalComponent,
        data: {
          title: "Accion de Personal",
          urls: [
            {
              title: 'Accion',
            },
            {
              title: 'Accion de Personal'
            }
          ]
        }
      },
      {
        path: 'accion-personal/completar-solicitud/:id/:idSolicitud',
        component: h21,
        data: {
          title: "Completar solicitud",
          urls: [
            {
              title: 'Accion',
            },
            {
              title: 'Accion de Personal'
            }
          ]
        }
      },
      {
        path: "completa-solicitud/:id/:idSolicitud",
        component: CompletaSolicitudComponent,
        data: {
          title: "Completar Solicitud",
          urls: [{ title: "Solicitudes" }, { title: "Completar Solicitud" }],
        },
      },
    ],
  },
];
