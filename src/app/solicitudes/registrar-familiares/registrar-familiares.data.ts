import { IColumnsTable } from "src/app/component/table/table.interface";

export const columnsDatosFamiliares: IConsultaTareasData = {
  columns: [
    {
      title: "Nombre",
      dataIndex: "nombreCompleto",
      sortActive: true,
    },
    {
      title: "Fecha de Ingreso",
      dataIndex: "fechaIngresogrupo",
      sortActive: true,
    },
    {
      title: "Cargo",
      dataIndex: "nombreCargo",
      sortActive: true,
    },
    {
      title: "Unidad",
      dataIndex: "unidadNegocio",
      sortActive: true,
    },
    {
      title: "Departamento",
      dataIndex: "departamento",
      sortActive: true,
    },
    {
      title: "Localidad",
      dataIndex: "localidad",
      sortActive: true,
    },
    {
      title: "Parentesco",
      dataIndex: "parentezco",
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
      dataIndex: "nombreCargo",
      sortActive: true,
    },
    {
      title: "Comentarios",
      dataIndex: "comments",
      sortActive: true,
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
    nombreCargo: "3er nivel",
    comments: "Muy trabajador",
  },
  {
    route: "2do Nivel de aprobador",
    level: "3 - Gerencia de unidad o corporativo",
    user: "Carlos",
    description: "107648494 o Coca Cola",
    nombreCargo: "4to Nivel",
    comments: "Algo flojo para el cargo",
  },
  {
    route: "3er Nivel aprobador",
    level: "Vicepresidencia",
    user: "Juan",
    description: "2 - Gerencia de Mantenimiento",
    nombreCargo: "65498216595165",
    comments: "Excelente persona",
  },
  {
    route: "RRHH Corporativo",
    level: "Gerente de RRHH corporativo",
    user: "Kevin Duque",
    description: "3 Gerencia alta",
    nombreCargo: "6544164565498",
    comments: "Buen lider",
  },
];

export interface IConsultaTareasData {
  columns: IColumnsTable;
  colsToFilterByTextName: string[];
}
