import { IInputsComponent } from "src/app/component/input/input.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { IRutaTable } from "./ruta.interface";
import { DatePipe } from "@angular/common";

export const TiporutaData: IRutaData = {
	columns: [
		// {
		// 	title: "Código",
		// 	dataIndex: "id",
		// 	align: "center",
		// 	sortActive: true,
		// 	colType: "number",
		// },
		{
			title: "Nivel Ruta",
			dataIndex: "ruta",
			sortActive: true,
			colType: "string",
		},
		{
			title: "Tipo ruta",
			dataIndex: "idTipoRuta",
			width: "300px",
			dataIndexesToJoin: ["tipoRutaFormatted"],
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
			type: "select",
			required: true,
			disabled: false,
			placeholder: "Seleccione",
			inputMessageError: "Seleccione",
			options: [],
		},
		{
			id: "estado",
			type: "toggle",
		},
		{
			id: "fechaActualizacion",
			type: "date",
			disabled: true,
			defaultValue: new DatePipe('en-CO').transform(new Date(), "dd/MM/yyyy"),
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
