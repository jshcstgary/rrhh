import { IColumnsTable } from "src/app/component/table/table.interface";
import { IRutaTable } from "./ruta.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const TiporutaData: IRutaData = {
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
      dataIndex: "ruta",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Tipo ruta",
      dataIndex: "tipoRutaId",
      width: "200px",
      dataIndexesToJoin: ["tipoRutaFormatted"],
      sortActive: true,
      colType: "string",
    },
    PlantillaAData.defaultActions,
  ],
  defaultEmptyRowTable: {
    id: "0",
    ruta: "",
    tipoRutaId: null,
  },
  tableInputsEditRow: [
    {
      id: "id",
      type: "visualization",
    },
    {
      id: "ruta",
      type: "string",
      maxLength: 30,
      required: true,
      inputMessageError: "Ingrese la descripción",
    },
    {
      id: "tipoRutaId",
      type: "select",
      required: true,
      disabled:true,
      placeholder: "Seleccione",
      inputMessageError: "Seleccione",
      options: [],
    },
  ],
  colsToFilterByText: ["id",
                      "ruta",
                      "tipoRutaFormatted",],
};

interface IRutaData{
  columns: IColumnsTable;
  defaultEmptyRowTable: IRutaTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
