import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITipoaccionTable } from "./tipo-accion.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { DatePipe } from "@angular/common";

export const TipoaccionData: ITipoaccionData = {
	columns: [
		// {
		// 	title: "Código",
		// 	dataIndex: "id",
		// 	align: "center",
		// 	sortActive: true,
		// 	colType: "number",
		// },
		{
			title: "Tipo acción",
			dataIndex: "tipoAccion",
			sortActive: true,
			colType: "string",
		},
		{
			title: "Tipo de solicitud",
			dataIndex: "tipoSolicitudId",
			width: "300px",
			dataIndexesToJoin: ["tipoSolicitudFormatted"],
			colType: "string",
		},
		{
			title: "Fecha",
			dataIndex: "fechaActualizacion",
			colType: "string",
		},
		{
			title: "Estado",
			dataIndex: "estado",
			type: "bool",
		},
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
		id: "0",
		tipoAccion: "",
		tipoSolicitudId: null,
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
			id: "tipoAccion",
			type: "string",
			maxLength: 30,
			required: true,
			inputMessageError: "Ingrese la descripción",
		},
		{
			id: "fechaActualizacion",
			type: "date",
			disabled: true,
			defaultValue: new DatePipe('en-CO').transform(new Date(), "dd/MM/yyyy"),
		},
		{
			id: "tipoSolicitudId",
			type: "select",
			required: true,
			disabled: true,
			placeholder: "Seleccione",
			inputMessageError: "Seleccione",
			options: [],
		},
		{
			id: "estado",
			type: "toggle",
		},
	],
	colsToFilterByText: ["id",
		"tipoAccion",
		"tipoSolicitudFormatted",],
};

interface ITipoaccionData {
	columns: IColumnsTable;
	defaultEmptyRowTable: ITipoaccionTable;
	tableInputsEditRow: IInputsComponent;
	colsToFilterByText: string[];
}
