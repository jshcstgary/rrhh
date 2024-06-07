import { IColumnsTable } from "src/app/component/table/table.interface";


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
        { materialIcon: "info", id: "editOnTable", tooltip: "Acciones" },
        { materialIcon: "delete", id: "delete", tooltip: "Eliminar" },
        // {
        //   materialIcon: "content_copy",
        //   id: "cloneOnTable",
        //   tooltip: "Duplicar",
        // },
      ],
    },
  ],
  // colsToFilterByTextIdSolicitud: ["idSolicitud", "name"],
  colsToFilterByTextName: ["name"],
};

export interface IConsultaTareasData {
  columns: IColumnsTable;
  // colsToFilterByTextIdSolicitud: string[];
  colsToFilterByTextName: string[];
}