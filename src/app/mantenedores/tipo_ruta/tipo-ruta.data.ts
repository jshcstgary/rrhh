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
        { materialIcon: "edit", id: "editOnTable", tooltip: "Editar" },
        { materialIcon: "content_copy", id: "cloneOnTable", tooltip: "Duplicar",
        },
      ],
    },
  ],
  defaultEmptyRowTable: {
    id: "0",
    tipoRuta: "",
    estado: true,
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
    {
      id: "estado",
      type: "toggle",
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
