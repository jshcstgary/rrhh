import { IInputsComponent } from "src/app/component/input/input.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { IConsultaGraficoTable } from "./consulta-grafico.interface";

export const ConsultaGraficosData: IConsultaGraficosData = {
  columns: [
    {
      title: "TIPO DE SOLICITUD",
      dataIndex: "name",
      align: "center",
      sortActive: true,
      colType: "string",
    },
    {
      title: "CREADAS",
      dataIndex: "creadas",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "ENVIADAS",
      dataIndex: "enviadas",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "REASIGNADAS",
      dataIndex: "reasignadas",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "DEVUELTAS",
      dataIndex: "devueltas",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "ANULADAS",
      dataIndex: "anuladas",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "ACCIONES",
      type: "actions",
      width: "100px",
      actions: [
        {
          materialIcon: "info",
          id: "editOnTable",
          tooltip: "Info",
          showed: true
        }
      ],
    },
  ],
  defaultEmptyRowTable: {
    name: "",
    creadas: "",
    enviadas: "",
    reasignadas: "",
    devueltas: "",
    anuladas: ""
  },
  tableInputsEditRow: [
    {
      id: "idSolicitud",
      type: "visualization",
    },
    {
      id: "tipoSolicitud",
      type: "string",
      maxLength: 30,
      required: true,
      inputMessageError: "Ingrese el tipo de solicitud",
    },
    {
      id: "nombreEmpleado",
      type: "string",
      maxLength: 100,
      required: true,
      inputMessageError: "Ingrese el nombre del empleado",
    },
    {
      id: "estado",
      type: "toggle",
    },
  ],
  colsToFilterByText: ["idSolicitud", "tipoSolicitud", "nombreEmpleado"],
};

interface IConsultaGraficosData {
  columns: IColumnsTable;
  defaultEmptyRowTable: IConsultaGraficoTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}