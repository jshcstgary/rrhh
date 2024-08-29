export interface IUtilReporte {
	formatoInforme: FormatoUtilReporte;
	reporteType: IUtilReporteDetail;
}
export interface IUtilReporteDetail {
	fechaReporte: string;
	codigoReporte: string;
	tituloReporte: string;
	usuario: string;
	compania: string;
	columnas: string[];
	contenidoColumnas: string[][];
}
export type FormatoUtilReporte = "PDF" | "EXCEL" | "CSV";

export enum reportCodeEnum {
	MANTENIMIENTO_TIPO_MOTIVO = "RPTWF-TM",
	MANTENIMIENTO_TIPO_SOLICITUD = "RPTWF-TS",
	MANTENIMIENTO_TIPO_ACCION = "RPTWF-TA",
	MANTENIMIENTO_ACCION = "RPTWF-AC",
	MANTENIMIENTO_TIPO_RUTA = "RPTWF-TR",
	MANTENIMIENTO_RUTA = "RPTWF-RT",
	MANTENIMIENTO_TIPO_PROCESO = "RPTWF-TP",
	MANTENIMIENTO_APROBADORES_FIJOS = "RPTWF-AF",
	MANTENIMIENTO_NIVELES_APROBACION = "RPTWF-NA",
	MANTENIMIENTO_ESTADOS = "RPTWF-AF"


}

export interface IServiceBase {
	aplicativoId?: string;
	estacion?: string;
	fechaActualizacion?: Date;
	fechaCreacion?: Date;
	horaCreacion?: Date;
	horaActualizacion?: Date;
	menuId?: string;
	usuarioCreacion?: string;
	usuarioActualizacion?: string;
}
