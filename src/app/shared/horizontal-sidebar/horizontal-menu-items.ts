import { RouteInfo } from "./horizontal-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Mantenimiento',
    icon: 'me-2 mdi mdi-dns',
    class: 'has-arrow',
    ddclass: "",
    extralink: false,
    submenu: [
      {
        path: "/mantenedores/niveles-aprobacion",
        title: "Niveles de Aprobación",
        icon: "",
        class: "",
        ddclass: "",
        extralink: false,
        submenu: [],
        },
      {
      path: "/mantenedores/tipo-solicitud",
      title: "Tipo de Solicitudes",
      icon: "",
      class: "",
      ddclass: "",
      extralink: false,
      submenu: [],
      },
      {
        path: '/mantenedores/tipo-motivo',
        title: 'Tipo motivo',
        icon: '',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/tipo-accion',
        title: 'Tipo accion',
        icon: '',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/tipo-proceso',
        title: 'Tipo proceso',
        icon: '',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/tipo-ruta',
        title: 'Tipo ruta',
        icon: '',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/ruta',
        title: 'Ruta',
        icon: '', //mdi mdi-adjust
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/accion',
        title: 'Accion',
        icon: '',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
  ]
  },
  {
    path: '',
    title: 'Tareas',
    icon: 'me-2 mdi mdi-file-check',
    class: 'has-arrow',
    ddclass: "",
    extralink: false,
    submenu: [
      {
      path: "/tareas/consulta-tarea",
      title: "Tareas",
      icon: "",
      class: "",
      ddclass: "",
      extralink: false,
      submenu: [],
      },

  ]
  },

  {
    path: "",
    title: 'Solicitudes',
    icon: 'me-2 mdi mdi-clipboard-text',
    class: 'has-arrow',
    ddclass: "",
    extralink: false,
    submenu: [
    {
      path: "/solicitudes/consulta-solicitudes",
      title: "Solicitudes",
      icon: "",
      class: "",
      ddclass: "",
      extralink: false,
      submenu: [],
      },

  ]
  },

];
