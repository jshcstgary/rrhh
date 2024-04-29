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
      width: "100px",
      actions: [
        { materialIcon: "edit", id: "editOnTable", tooltip: "Editar" },
        {
          materialIcon: "content_copy",
          id: "cloneOnTable",
          tooltip: "Duplicar",
        },
      ],
    },
  ],
};
interface IConsultaTareasData {
  columns: IColumnsTable;
}
