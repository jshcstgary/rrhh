import { IColumnsTable } from "src/app/component/table/table.interface";
import { ITiporutaTable } from "./tipo-ruta.interface";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { DatePipe } from "@angular/common";

export const TiporutaData: ITiporutaData = {
	columns: [
		// {
		// 	title: "Código",
		// 	dataIndex: "id",
		// 	align: "center",
		// 	sortActive: true,
		// 	colType: "number",
		// },
		{
			title: "Tipo ruta",
			dataIndex: "tipoRuta",
			sortActive: true,
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
		tipoRuta: "",
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
			id: "tipoRuta",
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
			id: "estado",
			type: "toggle",
		},
	],
	colsToFilterByText: ["id", "tipoRuta"],
};

interface ITiporutaData {
	columns: IColumnsTable;
	defaultEmptyRowTable: ITiporutaTable;
	tableInputsEditRow: IInputsComponent;
	colsToFilterByText: string[];
}
