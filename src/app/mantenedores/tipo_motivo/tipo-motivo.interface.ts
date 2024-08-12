import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITipomotivo{
  id?: number | string;
  tipoMotivo: string;
  tipoSolicitudId?: number | string;
  estado: string | boolean;
  fechaActualizacion: Date;
  fechaCreacion: Date;
  usuarioCreacion: string;
  usuarioActualizacion: string;

}

export interface ITipoSolcitud{
  id?: number | string;
  tipoSolicitud:string;
}

export interface ITipomotivoTable
  extends ITipomotivo, IRowTableAttributes {}

export type ITipomotivos = ITipomotivo[];
export type ITipomotivosTable = ITipomotivoTable[];

export interface ITipomotivoResponse {
  totalRegistros: number;
  tipomotivoType: ITipomotivos;
}
