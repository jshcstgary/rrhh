import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITipoprocesoTable } from "./tipo-proceso.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { DatePipe } from "@angular/common";

export const TipoprocesoData: ITipoprocesoData = {
	columns: [
		// {
		// 	title: "Código",
		// 	dataIndex: "id",
		// 	align: "center",
		// 	sortActive: true,
		// 	colType: "number",
		// },
		{
			title: "Tipo proceso",
			dataIndex: "tipoProceso",
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
		tipoProceso: "",
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
			id: "tipoProceso",
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
		"tipoProceso",
		"tipoSolicitudFormatted",],
};

interface ITipoprocesoData {
	columns: IColumnsTable;
	defaultEmptyRowTable: ITipoprocesoTable;
	tableInputsEditRow: IInputsComponent;
	colsToFilterByText: string[];
}
