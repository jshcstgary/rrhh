import { IColumnsTable } from "src/app/component/table/table.interface";

export const AprobadoresFijosData: IConsultaAprobadoresFijosData = {
  columns: [
    {
      title: "Identificador",
      dataIndex: "iD_APROBADOR",
      align: "center",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Nivel dirección",
      dataIndex: "niveL_DIRECCION",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Reporta A",
      dataIndex: "reportA_A",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Descripción posición",
      dataIndex: "descripcioN_POSICION",
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
        // {
        //   materialIcon: "content_copy",
        //   id: "cloneOnTable",
        //   tooltip: "Duplicar",
        // },
      ],
    },
  ],
  colsToFilterByText: ["iD_APROBADOR", "niveL_DIRECCION"],
};
interface IConsultaAprobadoresFijosData {
  columns: IColumnsTable;
  colsToFilterByText: string[];
}