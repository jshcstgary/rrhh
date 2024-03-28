import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITiposolicitudTable } from "./tipo-solicitud.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const TiposolicitudData: ITiposolicitudData = {
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
      dataIndex: "tipoSolicitud",
      sortActive: true,
      colType: "string",
    },
    PlantillaAData.defaultActions,
  ],
  defaultEmptyRowTable: {
    id: "0",
    tipoSolicitud: "",
  },
  tableInputsEditRow: [
    {
      id: "id",
      type: "visualization",
    },
    {
      id: "tipoSolicitud",
      type: "string",
      maxLength: 30,
      required: true,
      inputMessageError: "Ingrese la descripción",
    },
  ],
  colsToFilterByText: ["id", "tipoSolicitud"],
};

interface ITiposolicitudData{
  columns: IColumnsTable;
  defaultEmptyRowTable: ITiposolicitudTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
