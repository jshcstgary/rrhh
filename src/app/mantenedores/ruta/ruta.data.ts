import { IColumnsTable } from "src/app/component/table/table.interface";
import { IRutaTable } from "./ruta.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";

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
      dataIndex: "idTipoRuta",
      width: "300px",
      dataIndexesToJoin: ["tipoRutaFormatted"],
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
    ruta: "",
    idTipoRuta: null,
    estado: true,
    fechaActualizacion: new Date(),
    fechaCreacion: new Date(),
    usuarioCreacion: "",
    usuarioActualizacion: ""
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
      id: "estado",
      type: "toggle",
    },
    {
      id: "idTipoRuta",
      type: "select",
      required: true,
      disabled: true,
      placeholder: "Seleccione",
      inputMessageError: "Seleccione",
      options: [],
    },
  ],
  colsToFilterByText: ["id", "ruta", "tipoRutaFormatted"],
};

interface IRutaData {
  columns: IColumnsTable;
  defaultEmptyRowTable: IRutaTable;
  tableInputsEditRow: IInputsComponent;
  colsToFilterByText: string[];
}
