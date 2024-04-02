import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaSolicitudesData: IConsultaSolicitudesData = {
  columns: [
    {
      title: "Tipo de rura",
      dataIndex: "labor",
      align: "center",
      sortActive: true,
    },
    {
      title: "Ruta",
      dataIndex: "lote",
      sortActive: true,
    },
    {
      title: "Nivel de aprobación",
      dataIndex: "procesado",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Acción",
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
