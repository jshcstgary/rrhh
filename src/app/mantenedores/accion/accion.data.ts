import { IColumnsTable } from "src/app/component/table/table.interface";
import { IAccionTable } from "./accion.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const AccionData: IAccionData = {
  columns: [
    {
      title: "Código",
      dataIndex: "id",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Descripción",
      dataIndex: "accion",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Tipo de solicitud",
      dataIndex: "tipoSolicitudId",
      width: "200px",
      dataIndexesToJoin: ["tipoSolicitudFormatted"],
      sortActive: true,
      colType: "string",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      type: "bool",
    },
    //PlantillaAData.defaultActions,
    {
      title: "Acciones",
      type: "actions",
      width: "100px",
      actions: [
        {
          materialIcon: "edit",
          id: "editOnTable",
          tooltip: "Editar",
          showed: true
        },
        {
          materialIcon: "content_copy",
          id: "cloneOnTable",
          tooltip: "Duplicar",
          showed: true
        },
      ],
    },
  ],
  defaultEmptyRowTable: {
    id: "0",
    accion: "",
    tipoSolicitudId: null,
    estado: true,
  },
  tableInputsEditRow: [
    {
      id: "id",
      type: "visualization",
    },
    {
      id: "accion",
      type: "string",
      // maxLength: 30,
      required: true,
      inputMessageError: "Ingrese la descripción",
    },
    {
      id: "tipoSolicitudId",
      type: "select",
      required: true,
      disabled: true,
      placeholder: "Seleccione",
      inputMessageError: "Seleccione",
      options: [],
    },
    {
      id: "estado",
      type: "toggle",
    },
  ],
  colsToFilterByText: ["id", "accion", "tipoSolicitudFormatted"],
};

interface IAccionData {
  columns: IColumnsTable;
  defaultEmptyRowTable: IAccionTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
