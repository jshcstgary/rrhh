import { Routes } from "@angular/router";

import { routeAccessGuard } from "../guards/route-access.guard";
import { AccionComponent } from "./accion/accion.component";
import { AprobadoresFijosComponent } from "./aprobadores-fijos/aprobadores-fijos.component";
import { CrearAprobadorFijoComponent } from "./crear-aprobador-fijo/crear-aprobador-fijo.component";
import { CrearNivelesAprobacionComponent } from "./crear-niveles-aprobacion/crear-niveles-aprobacion.component";
import { EditarAprobadorFijoComponent } from "./editar-aprobador-fijo/editar-aprobador-fijo.component";
import { EstadosComponent } from "./estados/estados.component";
import { NivelesAprobacionComponent } from "./niveles-aprobacion/niveles-aprobacion.component";
import { ReasignarTareasUsuariosComponent } from "./reasignar-tareas-usuarios/reasignar-tareas-usuarios.component";
import { RutaComponent } from "./ruta/ruta.component";
import { TipoAccionComponent } from "./tipo_accion/tipo-accion.component";
import { TipoMotivoComponent } from "./tipo_motivo/tipo-motivo.component";
import { TipoProcesoComponent } from "./tipo_proceso/tipo-proceso.component";
import { TipoRutaComponent } from "./tipo_ruta/tipo-ruta.component";
import { TipoSolicitudComponent } from "./tipo_solicitud/tipo-solicitud.component";

import { PageCodes } from "../enums/codes.enum";

export const MantenedoresRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "niveles-aprobacion",
        canActivate: [routeAccessGuard],
        component: NivelesAprobacionComponent,
        data: {
          code: PageCodes.NivelesAprobacion,
          title: "Niveles de Aprobación",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Niveles de Aprobación"
            },
          ],
        },
      },
      {
        path: "crear-niveles-aprobacion",
        canActivate: [routeAccessGuard],
        component: CrearNivelesAprobacionComponent,
        data: {
          code: PageCodes.CrearNivelesAprobacion,
          title: "Crear Niveles de Aprobación",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Crear Niveles de Aprobación"
            },
          ],
        },
      },
      {
        path: "tipo-solicitud",
        canActivate: [routeAccessGuard],
        component: TipoSolicitudComponent,
        data: {
          code: PageCodes.TipoSolicitud,
          title: "Tipo de Solicitudes",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Tipo de Solicitudes"
            }
          ],
        },
      },
      {
        path: "tipo-motivo",
        canActivate: [routeAccessGuard],
        component: TipoMotivoComponent,
        data: {
          code: PageCodes.TipoMotivo,
          title: "Tipo motivo",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Tipo Motivo"
            }
          ],
        },
      },
      {
        path: "tipo-accion",
        canActivate: [routeAccessGuard],
        component: TipoAccionComponent,
        data: {
          code: PageCodes.TipoAccion,
          title: "Tipo acción",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Tipo Acción"
            }
          ],
        },
      },
      {
        path: "tipo-proceso",
        canActivate: [routeAccessGuard],
        component: TipoProcesoComponent,
        data: {
          code: PageCodes.TipoProceso,
          title: "Tipo proceso",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Tipo Proceso"
            }
          ],
        },
      },
      {
        path: "tipo-ruta",
        canActivate: [routeAccessGuard],
        component: TipoRutaComponent,
        data: {
          code: PageCodes.TipoRuta,
          title: "Tipo ruta",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Tipo Ruta"
            }
          ],
        },
      },
      {
        path: "ruta",
        canActivate: [routeAccessGuard],
        component: RutaComponent,
        data: {
          code: PageCodes.Ruta,
          title: "Ruta",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Ruta"
            }
          ],
        },
      },
      {
        path: "accion",
        canActivate: [routeAccessGuard],
        component: AccionComponent,
        data: {
          code: PageCodes.Accion,
          title: "Acción",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Acción"
            }
          ],
        },
      },
      {
        path: "estados-solicitud",
        canActivate: [routeAccessGuard],
        component: EstadosComponent,
        data: {
          title: "Estados Solicitud",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Estados Solicitud"
            }
          ],
        },
      },
      {
        path: "aprobadores-fijos",
        canActivate: [routeAccessGuard],
        component: AprobadoresFijosComponent,
        data: {
          code: PageCodes.AprobadorFijo,
          title: "Aprobadores Fijos",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Aprobadores Fijos"
            }
          ],
        },
      },
      {
        path: "crear-aprobador-fijo",
        canActivate: [routeAccessGuard],
        component: CrearAprobadorFijoComponent,
        data: {
			code: PageCodes.CrearAprobadorFijo,
          title: "Crear Aprobador Fijo",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Crear Aprobador Fijo"
            }
          ],
        },
      },
      {
        path: "editar-aprobador-fijo/:id",
        canActivate: [routeAccessGuard],
        component: EditarAprobadorFijoComponent,
        data: {
		  code: PageCodes.EditarAprobadorFijo,
          title: "Editar Aprobador Fijo",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Editar Aprobador Fijo"
            },
          ],
        },
      },
      {
        path: "reasignar-tareas-usuarios",
        canActivate: [routeAccessGuard],
        component: ReasignarTareasUsuariosComponent,
        data: {
          code: PageCodes.AprobadorFijo,
          title: "Reasignar Usuarios",
          urls: [
            {
              title: "Mantenimiento"
            },
            {
              title: "Reasignar Usuarios"
            }
          ],
        },
      },
    ],
  },
];
