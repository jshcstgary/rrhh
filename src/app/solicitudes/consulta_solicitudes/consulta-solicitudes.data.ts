import { IInputsComponent } from "src/app/component/input/input.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { IConsultaSolicitudTable } from "./consulta-solicitudes.interface";

export const ConsultaSolicitudesData: IConsultaSolicitudesData = {
  columns: [
    {
      title: "No. Solicitud",
      dataIndex: "idSolicitud",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Tipo de Solicitud",
      dataIndex: "tipoSolicitud",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Nombre de Empleado",
      dataIndex: "nombreEmpleado",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      colType: "string",
    },
    {
      title: "Acciones",
      type: "actions",
      width: "100px",
      actions: [
        {
          materialIcon: "info",
          id: "editOnTable",
          tooltip: "Info",
          showed: true
        },
        {
          materialIcon: "trending_up",
          id: "cloneOnTable",
          tooltip: "Trazabilidad",
          showed: true
        }
      ],
    },
  ],
  defaultEmptyRowTable: {
    idSolicitud: "0",
    tipoSolicitud: "",
    nombreEmpleado: "",
    estado: true,
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

interface IConsultaSolicitudesData {
  columns: IColumnsTable;
  defaultEmptyRowTable: IConsultaSolicitudTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
