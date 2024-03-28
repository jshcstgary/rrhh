import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITipomotivoTable } from "./tipo-motivo.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const TipomotivoData: ITipomotivoData = {
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
      dataIndex: "tipoMotivo",
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
    tipoMotivo: "",
    tipoSolicitudId: null,
  },
  tableInputsEditRow: [
    {
      id: "id",
      type: "visualization",
    },
    {
      id: "tipoMotivo",
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
                      "tipoMotivo",
                      "tipoSolicitudFormatted",],
};

interface ITipomotivoData{
  columns: IColumnsTable;
  defaultEmptyRowTable: ITipomotivoTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
