import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaSolicitudesData: IConsultaSolicitudesData = {
  columns: [
    {
      title: "No. Solicitud",
      dataIndex: "labor",
      align: "center",
      sortActive: true,
    },
    {
      title: "Tipo de solicitud",
      dataIndex: "lote",
      sortActive: true,
    },
    {
      title: "Nombre de empleado",
      dataIndex: "procesado",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Estado",
      dataIndex: "total_procesado",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Acciones",
      type: "actions",
      actions: [
        /* { icon: "fas fa-pencil-alt", id: "redirectToEdit" }, */
        // { icon: "far fa-copy", id: "" },
        // { icon: "fas fa-exclamation-circle", id: "" },
        /* { icon: "fas fa-trash-alt", id: "deleteRow" }, */
      ],
    },
  ],
};
interface IConsultaSolicitudesData {
  columns: IColumnsTable;
}
