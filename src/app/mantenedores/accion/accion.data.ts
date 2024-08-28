import { IColumnsTable } from "src/app/component/table/table.interface";
import { IAccionTable } from "./accion.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { format } from "date-fns";
import { DatePipe } from "@angular/common";

export const AccionData: IAccionData = {
	columns: [
		// {
		// 	title: "Código",
		// 	dataIndex: "id",
		// 	align: "center",
		// 	sortActive: true,
		// 	colType: "number",
		// },
		{
			title: "Acción",
			dataIndex: "accion",
			sortActive: true,
			colType: "string",
		},
		{
			title: "Tipo de solicitud",
			dataIndex: "tipoSolicitudId",
			width: "300px",
			dataIndexesToJoin: ["tipoSolicitudFormatted"],
			// sortActive: true,
			colType: "string",
		},
		{
			title: "Fecha",
			dataIndex: "fechaActualizacion",
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
		id: "0",
		accion: "",
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
			id: "accion",
			type: "string",
			// maxLength: 30,
			required: true,
			inputMessageError: "Ingrese la descripción",
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
			id: "fechaActualizacion",
			type: "date",
			disabled: true,
			defaultValue: new DatePipe('en-CO').transform(new Date(), "dd/MM/yyyy"),
		},
		{
			id: "estado",
			type: "toggle",
		},
	],
	colsToFilterByText: ["id", "accion", "tipoSolicitudFormatted"],
};

interface IAccionData {
	columns: IColumnsTable;
	defaultEmptyRowTable: IAccionTable;
	tableInputsEditRow: IInputsComponent;
	colsToFilterByText: string[];
}
