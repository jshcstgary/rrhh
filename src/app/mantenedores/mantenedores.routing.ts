import { Routes } from "@angular/router";

import { TipoSolicitudComponent } from "./tipo_solicitud/tipo-solicitud.component";
import { TipoMotivoComponent } from "./tipo_motivo/tipo-motivo.component";
import { TipoAccionComponent } from "./tipo_accion/tipo-accion.component";
import { TipoProcesoComponent } from "./tipo_proceso/tipo-proceso.component";
import { TipoRutaComponent } from "./tipo_ruta/tipo-ruta.component";
import { RutaComponent } from "./ruta/ruta.component";
import { AccionComponent } from "./accion/accion.component";
import { NivelesAprobacionComponent } from "./niveles-aprobacion/niveles-aprobacion.component";
import { CrearNivelesAprobacionComponent } from "./crear-niveles-aprobacion/crear-niveles-aprobacion.component";
import { EstadosComponent } from "./estados/estados.component";

export const MantenedoresRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "niveles-aprobacion",
        component: NivelesAprobacionComponent,
        data: {
          title: "Niveles de Aprobación",
          urls: [
            { title: "Mantenimiento" },
            { title: "Niveles de Aprobación" },
          ],
        },
      },
      {
        path: "crear-niveles-aprobacion",
        component: CrearNivelesAprobacionComponent,
        data: {
          title: "Crear Niveles de Aprobación",
          urls: [
            { title: "Mantenimiento" },
            { title: "Crear Niveles de Aprobación" },
          ],
        },
      },
      {
        path: "tipo-solicitud",
        component: TipoSolicitudComponent,
        data: {
          title: "Tipo de Solicitudes",
          urls: [{ title: "Mantenimiento" }, { title: "Tipo de Solicitudes" }],
        },
      },
      {
        path: "tipo-motivo",
        component: TipoMotivoComponent,
        data: {
          title: "Tipo motivo",
          urls: [{ title: "Mantenimiento" }, { title: "Tipo Motivo" }],
        },
      },
      {
        path: "tipo-accion",
        component: TipoAccionComponent,
        data: {
          title: "Tipo acción",
          urls: [{ title: "Mantenimiento" }, { title: "Tipo Acción" }],
        },
      },
      {
        path: "tipo-proceso",
        component: TipoProcesoComponent,
        data: {
          title: "Tipo proceso",
          urls: [{ title: "Mantenimiento" }, { title: "Tipo Proceso" }],
        },
      },
      {
        path: "tipo-ruta",
        component: TipoRutaComponent,
        data: {
          title: "Tipo ruta",
          urls: [{ title: "Mantenimiento" }, { title: "Tipo Ruta" }],
        },
      },
      // {
      //   path: "niveles",
      //   component: NivelesComponent,
      //   data: {
      //     title: "Niveles",
      //     urls: [{ title: "Mantenimiento" }, { title: "Niveles" }],
      //   },
      // },
      {
        path: "ruta",
        component: RutaComponent,
        data: {
          title: "Ruta",
          urls: [{ title: "Mantenimiento" }, { title: "Ruta" }],
        },
      },
      {
        path: "accion",
        component: AccionComponent,
        data: {
          title: "Acción",
          urls: [{ title: "Mantenimiento" }, { title: "Acción" }],
        },
      },
      {
        path: "estados-solicitud",
        component: EstadosComponent,
        data: {
          title: "Estados Solicitud",
          urls: [{ title: "Mantenimiento" }, { title: "Estados Solicitud" }],
        },
      },
    ],
  },
];
