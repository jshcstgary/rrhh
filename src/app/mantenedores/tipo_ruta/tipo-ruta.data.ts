import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITiporutaTable } from "./tipo-ruta.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const TiporutaData: ITiporutaData = {
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
      dataIndex: "tipoRuta",
      sortActive: true,
      colType: "string",
    },
    PlantillaAData.defaultActions,
  ],
  defaultEmptyRowTable: {
    id: "0",
    tipoRuta: "",
  },
  tableInputsEditRow: [
    {
      id: "id",
      type: "visualization",
    },
    {
      id: "tipoRuta",
      type: "string",
      maxLength: 30,
      required: true,
      inputMessageError: "Ingrese la descripción",
    },
  ],
  colsToFilterByText: ["id", "tipoRuta"],
};

interface ITiporutaData{
  columns: IColumnsTable;
  defaultEmptyRowTable: ITiporutaTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
