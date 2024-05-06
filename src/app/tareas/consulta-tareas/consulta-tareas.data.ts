import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaTareasData: IConsultaTareasData = {
  columns: [
    {
      title: "Número de solicitud",
      dataIndex: "idSolicitud",
      align: "center",
      sortActive: true,
    },
    {
      title: "Tarea",
      dataIndex: "name",
      sortActive: true,
    },
    {
      title: "Solicitud",
      dataIndex: "tipoSolicitud",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Fecha de creación",
      dataIndex: "startTime",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Acciones",
      type: "actions",
      width: "100px",
      actions: [
        { materialIcon: "info", id: "editOnTable", tooltip: "Acciones" },
        // {
        //   materialIcon: "content_copy",
        //   id: "cloneOnTable",
        //   tooltip: "Duplicar",
        // },
      ],
    },
  ],
  colsToFilterByTextIdSolicitud: ["idSolicitud", "name"],
  colsToFilterByTextName: ["name"],
};
interface IConsultaTareasData {
  columns: IColumnsTable;
  colsToFilterByTextIdSolicitud: string[];
  colsToFilterByTextName: string[];
}
