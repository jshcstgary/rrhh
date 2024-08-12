import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITipoproceso {
  id?: number | string;
  tipoProceso: string;
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

export interface ITipoprocesoTable
  extends ITipoproceso, IRowTableAttributes {}

export type ITipoprocesos = ITipoproceso[];
export type ITipoprocesosTable = ITipoprocesoTable[];

export interface ITipoprocesoResponse {
  totalRegistros: number;
  tipoProcesoType: ITipoprocesos;
}
