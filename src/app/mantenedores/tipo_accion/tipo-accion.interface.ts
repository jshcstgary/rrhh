import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITipoaccion {
  id?: number | string;
  tipoAccion: string;
  tipoSolicitudId?: number | string;

}

export interface ITipoSolcitud{
  id?: number | string;
  tipoSolicitud:string;
}

export interface ITipoaccionTable
  extends ITipoaccion, IRowTableAttributes {}

export type ITipoacciones = ITipoaccion[];
export type ITipoaccionesTable = ITipoaccionTable[];

export interface ITipoaccionResponse {
  totalRegistros: number;
  tipoaccionType: ITipoacciones;
}
