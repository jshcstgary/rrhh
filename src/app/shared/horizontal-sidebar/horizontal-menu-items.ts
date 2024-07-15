import { RouteInfo } from "./horizontal-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "Solicitudes",
    icon: "me-2 mdi mdi-clipboard-text",
    class: "has-arrow icon-size",
    ddclass: "",
    extralink: false,
	objeto: "wf_solicitudes",
    submenu: [
      {
        path: "/solicitudes/consulta-solicitudes",
        title: "Solicitudes",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_consulta_solicitudes",
        submenu: [],
      },
    ],
  },
  {
    path: "",
    title: "Tareas",
    icon: "me-2 mdi mdi-file-check",
    class: "has-arrow",
    ddclass: "",
    extralink: false,
	objeto: "wf_",
    submenu: [
      {
        path: "/tareas/consulta-tareas",
        title: "Mis tareas",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_",
        submenu: [],
      },
    ],
  },
  {
    path: "",
    title: "Mantenimiento",
    icon: "me-2 mdi mdi-dns",
    class: "has-arrow",
    ddclass: "",
    extralink: false,
	objeto: "wf_mantenimiento",
    submenu: [
      {
        path: "/mantenedores/niveles-aprobacion",
        title: "Niveles de Aprobación",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_niveles_aprobacion",
        submenu: [],
      },
      {
        path: "/mantenedores/tipo-solicitud",
        title: "Tipo de Solicitudes",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_tipo_solicitudes",
        submenu: [],
      },
      {
        path: "/mantenedores/tipo-motivo",
        title: "Tipo motivo",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_tipo_motivo",
        submenu: [],
      },
      {
        path: "/mantenedores/tipo-accion",
        title: "Tipo acción",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_tipo_accion",
        submenu: [],
      },
      {
        path: "/mantenedores/tipo-proceso",
        title: "Tipo proceso",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_tipo_proceso",
        submenu: [],
      },
      {
        path: "/mantenedores/tipo-ruta",
        title: "Tipo ruta",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_tipo_ruta",
        submenu: [],
      },
      {
        path: "/mantenedores/ruta",
        title: "Ruta",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_ruta",
        submenu: [],
      },
      {
        path: "/mantenedores/accion",
        title: "Acción",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_accion",
        submenu: [],
      },
      {
        path: "/mantenedores/aprobadores-fijos",
        title: "Aprobadores Fijos",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
		objeto: "wf_aprobadores_fijos",
        submenu: [],
      },
    ],
  },
];
