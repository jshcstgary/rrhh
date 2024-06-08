import { IColumnsTable } from "src/app/component/table/table.interface";

export const dataTableDatosFamiliares = [
  {
    name: "Nombre 1",
    dateIn: "01/01/2021",
    position: "Cargo 1",
    unit: "Unidad 1",
    departament: "Departamento 1",
    location: "Localidad 1",
    relationship: "Parentesco 1",
  },
  {
    name: "Nombre 2",
    dateIn: "02/02/2022",
    position: "Cargo 2",
    unit: "Unidad 2",
    departament: "Departamento 2",
    location: "Localidad 2",
    relationship: "Parentesco 2",
  },
  {
    name: "Nombre 3",
    dateIn: "03/03/2023",
    position: "Cargo 3",
    unit: "Unidad 3",
    departament: "Departamento 3",
    location: "Localidad 3",
    relationship: "Parentesco 3",
  },
  {
    name: "Nombre 4",
    dateIn: "04/04/2024",
    position: "Cargo 4",
    unit: "Unidad 4",
    departament: "Departamento 4",
    location: "Localidad 4",
    relationship: "Parentesco 4",
  },
  {
    name: "Nombre 5",
    dateIn: "05/05/2025",
    position: "Cargo 5",
    unit: "Unidad 5",
    departament: "Departamento 5",
    location: "Localidad 5",
    relationship: "Parentesco 5",
  },
];

export const columnsDatosFamiliares: IConsultaTareasData = {
  columns: [
    {
      title: "Nombre",
      dataIndex: "name",
      // align: "center",
      sortActive: true,
    },
    {
      title: "Fecha de Ingreso",
      dataIndex: "dateIn",
      sortActive: true,
    },
    {
      title: "Cargo",
      dataIndex: "position",
      sortActive: true,
    },
    {
      title: "Unidad",
      dataIndex: "unit",
      sortActive: true,
    },
    {
      title: "Departamento",
      dataIndex: "departament",
      sortActive: true,
    },
    {
      title: "Localidad",
      dataIndex: "location",
      sortActive: true,
    },
    {
      title: "Parentesco",
      dataIndex: "relationship",
      sortActive: true,
    },
    {
      title: "Acciones",
      type: "actions",
      width: "100px",
      actions: [
        { materialIcon: "edit", id: "editOnTable", tooltip: "Editar" },
        { materialIcon: "delete", id: "delete", tooltip: "Eliminar" },
      ],
    },
  ],
  // colsToFilterByTextIdSolicitud: ["idSolicitud", "name"],
  colsToFilterByTextName: ["name"],
};

export const columnsAprobadores: IConsultaTareasData = {
  columns: [
    {
      title: "Rutas",
      dataIndex: "route",
      sortActive: true,
    },
    {
      title: "Nivel de aprobacion segun ruta",
      dataIndex: "level",
      sortActive: true,
    },
    {
      title: "Usuarios",
      dataIndex: "user",
      sortActive: true,
    },
    {
      title: "Descripcion de la posicion",
      dataIndex: "description",
      sortActive: true,
    },
    {
      title: "Nivel de direccion de la posicion",
      dataIndex: "position",
      sortActive: true,
    },
    {
      title: "Comentarios",
      dataIndex: "comments",
      sortActive: true,
    },
    {
      title: "Acciones",
      type: "actions",
      width: "100px",
      actions: [
        { materialIcon: "edit", id: "editOnTable", tooltip: "Editar" },
        { materialIcon: "delete", id: "delete", tooltip: "Eliminar" },
      ],
    },
  ],
  colsToFilterByTextName: ["route"],
};

export const dataTableAprobadores = [
  {
    route: "1er Nivel de Aprobacion",
    level: "4 Gerencia Media",
    user: "Luis",
    description: "13218798",
    position: "3er nivel",
    comments: "Muy trabajador",
  },
  {
    route: "2do Nivel de aprobador",
    level: "3 - Gerencia de unidad o corporativo",
    user: "Carlos",
    description: "107648494 o Coca Cola",
    position: "4to Nivel",
    comments: "Algo flojo para el cargo",
  },
  {
    route: "3er Nivel aprobador",
    level: "Vicepresidencia",
    user: "Juan",
    description: "2 - Gerencia de Mantenimiento",
    position: "65498216595165",
    comments: "Excelente persona",
  },
  {
    route: "RRHH Corporativo",
    level: "Gerente de RRHH corporativo",
    user: "Kevin Duque",
    description: "3 Gerencia alta",
    position: "6544164565498",
    comments: "Buen lider",
  },
]

export interface IConsultaTareasData {
  columns: IColumnsTable;
  // colsToFilterByTextIdSolicitud: string[];
  colsToFilterByTextName: string[];
}