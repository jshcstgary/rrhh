import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITipoprocesoTable } from "./tipo-proceso.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const TipoprocesoData: ITipoprocesoData = {
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
      dataIndex: "tipoProceso",
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
    PlantillaAData.defaultActions,
  ],
  defaultEmptyRowTable: {
    id: "0",
    tipoProceso: "",
    tipoSolicitudId: null,
  },
  tableInputsEditRow: [
    {
      id: "id",
      type: "visualization",
    },
    {
      id: "tipoProceso",
      type: "string",
      maxLength: 30,
      required: true,
      inputMessageError: "Ingrese la descripción",
    },
    {
      id: "tipoSolicitudId",
      type: "select",
      required: true,
      disabled:true,
      placeholder: "Seleccione",
      inputMessageError: "Seleccione",
      options: [],
    },
  ],
  colsToFilterByText: ["id",
                      "tipoProceso",
                      "tipoSolicitudFormatted",],
};

interface ITipoprocesoData{
  columns: IColumnsTable;
  defaultEmptyRowTable: ITipoprocesoTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
