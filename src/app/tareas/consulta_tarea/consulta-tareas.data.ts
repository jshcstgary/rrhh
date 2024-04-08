import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaTareasData: IConsultaTareasData = {
  columns: [
    {
      title: "Número de solicitud",
      dataIndex: "numero_solicitud",
      align: "center",
      sortActive: true,
    },
    {
      title: "Tarea",
      dataIndex: "tarea",
      sortActive: true,
    },
    {
      title: "Solicitud",
      dataIndex: "solicitud",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Fecha de creación",
      dataIndex: "fecha_creacion",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Acciones",
      type: "actions",
      align: "center",
      actions: [
        {
          icon: "fas fa-pencil-alt",
          // materialIcon?: string;
          // tooltip?: string;
          id: "editOnTable",
        },

        // { icon: "far fa-copy", id: "" },
        // { icon: "fas fa-exclamation-circle", id: "" },
        /* { icon: "fas fa-trash-alt", id: "deleteRow" }, */
      ],
    },
  ],
};
interface IConsultaTareasData {
  columns: IColumnsTable;
}
