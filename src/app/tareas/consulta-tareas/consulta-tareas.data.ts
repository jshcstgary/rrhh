import { IColumnsTable } from "src/app/component/table/table.interface";

export const ConsultaTareasData: IConsultaTareasData = {
	columns: [
		{
			title: "Número de solicitud",
			dataIndex: "idSolicitud",
			align: "center",
			sortActive: true,
		},
		{
			title: "Tarea",
			dataIndex: "name",
			sortActive: true,
		},
		{
			title: "Solicitud",
			dataIndex: "tipoSolicitud",
			sortActive: true,
			colType: "string",
		},
		{
			title: "Fecha de modificación",
			dataIndex: "startTime",
			sortActive: true,
			colType: "string",
		},
		{
			title: "Acciones",
			type: "actions",
			width: "100px",
			actions: [
				{
					materialIcon: "info",
					id: "editOnTable",
					tooltip: "Acciones",
					showed: true
				}
			],
		},
	],
	colsToFilterByTextIdSolicitud: ["idSolicitud", "name"],
	// colsToFilterByTextIdSolicitud: ["idSolicitud"],
	colsToFilterByTextName: ["name"],
};
interface IConsultaTareasData {
	columns: IColumnsTable;
	colsToFilterByTextIdSolicitud: string[];
	colsToFilterByTextName: string[];
}
