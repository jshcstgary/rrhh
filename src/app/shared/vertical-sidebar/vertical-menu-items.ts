import { RouteInfo } from './vertical-sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  
  {
    path: '/starter',
    title: 'Starter Page',
    icon: 'icon-speedometer',
    class: '',
    extralink: false,
    label: '',
    labelClass: '',
    submenu: []
  },
  {
    path: '',
    title: 'Labores Agricolas',
    icon: 'me-2 mdi mdi-account-multiple',
    class: 'has-arrow',
    extralink: false,
    label: '',
    labelClass: '',
    submenu: [
      {
      path: '/labores-agricolas/labores-realizadas',
      title: 'Labores Realizadas',
      icon: 'mdi mdi-adjust',
      class: '',
      extralink: false,
      label: '',
      labelClass: '',
      submenu: []
    }
  ]
  },
  {
    path: '',
    title: 'Component',
    icon: 'ti-palette',
    class: 'has-arrow',
    extralink: false,
    label: '',
    labelClass: '',
    submenu: [
      {
        path: '/component/accordion',
        title: 'Accordion',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/alert',
        title: 'Alert',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/badges',
        title: 'Badges',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/buttons',
        title: 'Button',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/carousel',
        title: 'Carousel',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/card',
        title: 'Card',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/dropdown',
        title: 'Dropdown',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/datepicker',
        title: 'Datepicker',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/modal',
        title: 'Modal',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/pagination',
        title: 'Pagination',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/poptool',
        title: 'Popover & Tooltip',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/progressbar',
        title: 'Progressbar',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/rating',
        title: 'Ratings',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/nav',
        title: 'Nav',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: '/component/timepicker',
        title: 'Timepicker',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: []
      },
      {
        path: "/component/toast",
        title: "Toast",
        icon: "mdi mdi-adjust",
        class: "",
        extralink: false,
        label: "",
        labelClass: "",
        submenu: [],
      },
      {
        path: "/component/notifier",
        title: "Notifier",
        icon: "mdi mdi-adjust",
        class: "",
        extralink: false,
        label: "",
        labelClass: "",
        submenu: [],
      },
    ]
  }
];
