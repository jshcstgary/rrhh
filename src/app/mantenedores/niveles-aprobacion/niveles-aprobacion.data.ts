import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaSolicitudesData: IConsultaNivelesAprobacionData = {
  columns: [
    {
      title: "Tipo de ruta",
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
      title: "Estado",
      dataIndex: "estado",
      type: "bool",
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
interface IConsultaNivelesAprobacionData {
  columns: IColumnsTable;
}
