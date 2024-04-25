import { IColumnsTable } from "src/app/component/table/table.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";
import { IEstadoTable } from "./estados.interface";

export const EstadoData: IEstadoData = {
  columns: [
    {
      title: "Código",
      dataIndex: "codigo",
      align: "center",
      sortActive: true,
      colType: "number",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
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
        {
          materialIcon: "content_copy",
          id: "cloneOnTable",
          tooltip: "Duplicar",
        },
      ],
    },
  ],
  defaultEmptyRowTable: {
    codigo: "0",
    descripcion: "",
    estado: true,
  },
  tableInputsEditRow: [
    {
      id: "codigo",
      type: "visualization",
    },
    {
      id: "descripcion",
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
  colsToFilterByText: ["codigo", "descripcion"],
};

interface IEstadoData {
  columns: IColumnsTable;
  defaultEmptyRowTable: IEstadoTable;

  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
