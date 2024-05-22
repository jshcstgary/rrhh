import {
  IColumnTable,
  IColumnsTable,
} from "src/app/component/table/table.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { IItemCatalogoTable } from "src/app/services/catalogo/catalogo.interface";
import { PlantillaAData } from "src/app/plantilla/plantillaA/plantillaA.data";

export const CatalogoData: ICatalogoData = {
  columns: [
    {
      title: "Código",
      dataIndex: "codigo",
      align: "center",
      sortActive: true,
      colType: "string",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      sortActive: true,
      colType: "string",
    },
  ],
  defaultEmptyRowTable: {
    codigo: null,
    descripcion: null,
    catalogoId: null,
  },
  tableInputsEditRow: [
    {
      id: "codigo",
      type: "number",
      maxLength: 2,
      allowedKeys: ["alphanumeric"],
      required: true,
      inputMessageError: "Ingrese el codigo",
    },
    {
      id: "descripcion",
      type: "string",
      maxLength: 40,
      allowedKeys: ["isAllowedDescription"],
      required: true,
      inputMessageError: "Ingrese la descripción",
    },
    {
      id: "estado",
      type: "toggle",
    },
  ],
  colsToFilterByText: ["codigo", "descripcion"],
  stateInputEditTable: {
    title: "Estado",
    dataIndex: "estado",
    sortActive: false,
    colType: "number",
    type: "bool",
  },
};

interface ICatalogoData {
  columns: IColumnsTable;
  defaultEmptyRowTable: IItemCatalogoTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
  stateInputEditTable: IColumnTable;
}
