import { RouteInfo } from "./horizontal-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
   /*{
   path: "",
    title: "Home",
    icon: "icon-speedometer",
    class: "has-arrow",
    ddclass: "",
    extralink: false,
    submenu: [
     {
        path: "/dashboard/dashboard1",
        title: "Minimal",
        icon: "mdi mdi-adjust",
        class: "",
        ddclass: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/dashboard/dashboard2",
        title: "Demographical",
        icon: "mdi mdi-adjust",
        class: "",
        ddclass: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/dashboard/dashboard3",
        title: "Modern",
        icon: "mdi mdi-adjust",
        class: "",
        ddclass: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/dashboard/dashboard4",
        title: "Analytical",
        icon: "mdi mdi-adjust",
        class: "",
        ddclass: "",
        extralink: false,
        submenu: [],
      },
    ],
  },*/
  {
    path: '',
    title: 'Mantenimiento',
    icon: 'me-2 mdi mdi-dns',
    class: 'has-arrow',
    ddclass: "",
    extralink: false,
    submenu: [
      {
      path: "/mantenedores/tipo-solicitud",
      title: "Tipo de Solicitudes",
      icon: "mdi mdi-adjust",
      class: "",
      ddclass: "",
      extralink: false,
      submenu: [],
      },
      {
        path: '/mantenedores/tipo-motivo',
        title: 'Tipo motivo',
        icon: 'mdi mdi-adjust',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/tipo-accion',
        title: 'Tipo accion',
        icon: 'mdi mdi-adjust',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/tipo-proceso',
        title: 'Tipo proceso',
        icon: 'mdi mdi-adjust',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/tipo-ruta',
        title: 'Tipo ruta',
        icon: 'mdi mdi-adjust',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/ruta',
        title: 'Ruta',
        icon: 'mdi mdi-adjust',
        class: "",
        ddclass: "",
        extralink: false,
        submenu: []
      }
      ,
      {
        path: '/mantenedores/accion',
        title: 'Accion',
        icon: 'mdi mdi-adjust',
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
      icon: "mdi mdi-adjust",
      class: "",
      ddclass: "",
      extralink: false,
      submenu: [],
      },

  ]
  },

  {
    path: '',
    title: 'Solicitudes',
    icon: 'me-2 mdi mdi-clipboard-text',
    class: 'has-arrow',
    ddclass: "",
    extralink: false,
    submenu: [
      {
      path: "/solicitudes/consulta-solicitudes",
      title: "Solicitudes",
      icon: "mdi mdi-adjust",
      class: "",
      ddclass: "",
      extralink: false,
      submenu: [],
      },

  ]
  },

];
