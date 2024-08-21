import { IInputsComponent } from "src/app/component/input/input.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITiposolicitudTable } from "./tipo-solicitud.interface";

export const TiposolicitudData: ITiposolicitudData = {
	columns: [
		// {
		//   title: "Código",
		//   dataIndex: "id",
		//   align: "center",
		//   sortActive: true,
		//   colType: "number",
		// },
		{
			title: "Código solicitud",
			dataIndex: "codigoTipoSolicitud",
			align: "center",
			sortActive: true,
			colType: "string",
		},
		{
			title: "Descripción",
			dataIndex: "tipoSolicitud",
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
				}
			],
		},
	],
	defaultEmptyRowTable: {
		// id: "0",
		codigoTipoSolicitud: "",
		tipoSolicitud: "",
		estado: true,
		fechaActualizacion: new Date(),
		fechaCreacion: new Date(),
		usuarioCreacion: "",
		usuarioActualizacion: ""
	},
	tableInputsEditRow: [
		// {
		//   id: "id",
		//   type: "visualization",
		// },
		{
			id: "codigoTipoSolicitud",
			restrictionType: "code",
			type: "string",
			maxLength: 30,
			required: true,
			inputMessageError: "Ingrese el código",
		},
		{
			id: "tipoSolicitud",
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
	colsToFilterByText: ["codigoTipoSolicitud", "tipoSolicitud"],
};

interface ITiposolicitudData {
	columns: IColumnsTable;
	defaultEmptyRowTable: ITiposolicitudTable;
	tableInputsEditRow: IInputsComponent;
	colsToFilterByText: string[];
}
