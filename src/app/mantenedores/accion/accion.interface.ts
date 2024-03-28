import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IAccion {
  id?: number | string;
  accion: string;
  tipoSolicitudId?: number | string;
}
export interface ITipoSolcitud{
  id?: number | string;
  tipoSolicitud:string;
}
export interface IAccionTable
  extends IAccion,
    IRowTableAttributes {}

export type IAcciones = IAccion[];
export type IAccionesTable = IAccionTable[];

export interface IAccionResponse {
  totalRegistro: number;
  AccionTypes: IAcciones;
}
