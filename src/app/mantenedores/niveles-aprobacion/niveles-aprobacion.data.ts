import { IColumnsTable } from "src/app/component/table/table.interface";

export const NivelesAprobacionData: IConsultaNivelesAprobacionData = {
	columns: [
		{
			title: "Tipo de solicitud",
			dataIndex: "tipoRuta",
			sortActive: true,
			colType: "string"
		},
		{
			title: "Tipo de ruta",
			dataIndex: "tipoSolicitud",
			sortActive: true,
			colType: "string"
		},
		{
			title: "Tipo motivo",
			dataIndex: "nivelAprobacion1",
			sortActive: true,
			colType: "string"
		},
		{
			title: "Acción",
			dataIndex: "nivelAprobacion1",
			sortActive: true,
			colType: "string"
		},
		{
			title: "Nivel de dirección",
			dataIndex: "nivelAprobacion1",
			sortActive: true,
			colType: "string"
		}
		// {
		// 	title: "2do Nivel Aprobación",
		// 	dataIndex: "nivelAprobacion2",
		// 	sortActive: true,
		// 	colType: "string"
		// },
		// {
		// 	title: "3er Nivel Aprobación",
		// 	dataIndex: "nivelAprobacion3",
		// 	sortActive: true,
		// 	colType: "string"
		// },
		// {
		// 	title: "4to Nivel Aprobación",
		// 	dataIndex: "nivelAprobacion4",
		// 	sortActive: true,
		// 	colType: "string"
		// },
		// {
		// 	title: "Gerente RR.HH.",
		// 	dataIndex: "nivelAprobacionGerenteRRHH",
		// 	sortActive: true,
		// 	colType: "string"
		// },
		// {
		// 	title: "Comité de Remunerción",
		// 	dataIndex: "nivelAprobacionComiteRemuneracion",
		// 	sortActive: true,
		// 	colType: "string"
		// }
	]
};

// export const NivelesAprobacionData: IConsultaNivelesAprobacionData = {
// 	columns: [
// 		{
// 			title: "Tipo de ruta",
// 			dataIndex: "tipoRuta",
// 			align: "center",
// 			sortActive: true,
// 			colType: "string",
// 		},
// 		{
// 			title: "Ruta",
// 			dataIndex: "ruta",
// 			sortActive: true,
// 			colType: "string",
// 		},
// 		{
// 			title: "Nivel de aprobación",
// 			dataIndex: "nivelAprobacionRuta",
// 			sortActive: true,
// 			colType: "string",
// 		},
// 		{
// 			title: "Acción",
// 			dataIndex: "accion",
// 			sortActive: true,
// 			colType: "string",
// 		},
// 		{
// 			title: "Estado",
// 			dataIndex: "estado",
// 			type: "bool",
// 		},
// 		{
// 			title: "Acciones",
// 			type: "actions",
// 			width: "100px",
// 			actions: [
// 				{
// 					materialIcon: "edit",
// 					id: "editOnTable",
// 					tooltip: "Editar",
// 					showed: true
// 				},
// 				{
// 					materialIcon: "content_copy",
// 					id: "cloneOnTable",
// 					tooltip: "Duplicar",
// 					showed: true
// 				},
// 			],
// 		},
// 	],
// };

interface IConsultaNivelesAprobacionData {
	columns: IColumnsTable;
}
