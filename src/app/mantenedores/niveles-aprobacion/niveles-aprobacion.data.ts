import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaSolicitudesData: IConsultaSolicitudesData = {
  columns: [
    {
      title: "Tipo de rura",
      dataIndex: "tipoRuta",
      align: "center",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Ruta",
      dataIndex: "ruta",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Nivel de aprobación",
      dataIndex: "nivelAprobacionRuta",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Acción",
      dataIndex: "accion",
      sortActive: true,
      colType: "string",
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
