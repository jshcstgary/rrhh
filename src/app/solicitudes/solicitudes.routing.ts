import { Routes } from "@angular/router";

import { CompletaSolicitudComponent } from "./completa-solicitud/completa-solicitud.component";
import { ConsultaSolicitudesComponent } from "./consulta_solicitudes/consulta-solicitudes.component";
import { DetalleSolicitudComponent } from "./detalle-solicitud/detalle-solicitud.component";
import { RegistrarCandidatoComponent } from "./registrar-candidato/registrar-candidato.component";
import { RegistrarSolicitudComponent } from "./registrar-solicitud/registrar-solicitud.component";
import { RevisarSolicitudComponent } from "./revisar-solicitud/revisar-solicitud.component";

// HISTORIAS - CGARCIA
import { RegistrarFamiliaresComponent } from "./registrar-familiares/registrar-familiares.component";
import { ReingresoPersonalComponent } from "./reingreso-personal/reingreso-personal.component";
import { RegistrarComentarioSalidaJefeComponent } from "./registrar-comentario-salida-jefe/registrar-comentario-salida-jefe.component";
import { RegistrarComentarioSalidaRRHHComponent } from "./registrar-comentario-salida-rrhh/registrar-comentario-salida-rrhh.component";
import { RegistrarComentarioReingresoComponent } from "./registrar-comentario-reingreso/registrar-comentario-reingreso.component";
import { RegistrarAccionPersonalComponent } from "./registrar-accion-personal/registrar-accion-personal.component";
import { CompletarAccionPersonalComponent } from "./completar-accion-personal/completar-accion-personal.component";

export const SolicitudesRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "consulta-solicitudes",
        component: ConsultaSolicitudesComponent,
        data: {
          code: "wf_consulta_solicitudes",
          title: "Solicitudes",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Consulta Solicitudes"
            }
          ],
        },
      },
      {
        path: "registrar-solicitud/:id/:idSolicitud",
        component: RegistrarSolicitudComponent,
        data: {
          title: "Registrar Solicitud",
          code: "wf_registrar_solicitudes",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Registrar Solicitud"
            }
          ],
        },
      },
      {
        path: "detalle-solicitud/:id",
        component: DetalleSolicitudComponent,
        data: {
          title: "Solicitud",
          code: "wf_registrar_solicitudes",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Solicitud"
            }
          ],
        },
      },
      {
        path: "revisar-solicitud/:id/:idSolicitud",
        component: RevisarSolicitudComponent,
        data: {
          title: "Revisión de Solicitud",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Revisión de Solicitud"
            }
          ],
        },
      },
      {
        path: "registrar-familiares/:id/:idSolicitud",
        component: RegistrarFamiliaresComponent,
        data: {
          title: "Registrar familiar",
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Contratación de Familiares"
            }
          ],
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
        path: "reingreso-personal/registro-comentarios/:id/:idSolicitud",
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
        component: RegistrarComentarioSalidaRRHHComponent,
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
        component: RegistrarComentarioReingresoComponent,
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
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Seleccion de Candidato"
            }
          ],
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
        component: CompletarAccionPersonalComponent,
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
          urls: [
            {
              title: "Solicitudes"
            },
            {
              title: "Completar Solicitud"
            }
          ],
        },
      },
    ],
  },
];
