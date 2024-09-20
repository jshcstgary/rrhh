import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaSolicitud {
  idSolicitud?: number | string;
  tipoSolicitud: string;
  nombreEmpleado: string;
  estado: string | boolean;
}

export interface IConsultaSolicitudTable extends IConsultaSolicitud, IRowTableAttributes {}

export type IConsultaSolicitudes = IConsultaSolicitud[];
export type IConsultaSolicitudesTable = IConsultaSolicitudTable[];

export interface IConsultaSolicitudResponse {
  totalRegistros: number;
  consultaSolicitudType: IConsultaSolicitudes;
}
