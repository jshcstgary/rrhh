import { IColumnsTable } from "src/app/component/table/table.interface";

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
      comments: "",
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
      user: "",
      description: "",
      position: "",
      comments: "No aplica",
    },
    {
      route: "RRHH Corporativo",
      level: "Gerente de RRHH corporativo",
      user: "Kevin Duque",
      description: "3 Gerencia alta",
      position: "6544164565498",
      comments: "",
    },
  ]
  
  export interface IConsultaTareasData {
    columns: IColumnsTable;
    // colsToFilterByTextIdSolicitud: string[];
    colsToFilterByTextName: string[];
  }