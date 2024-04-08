import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaNivelesAprobacion {
  /*id: string;
  labor: string;
  lote: string;
  procesado: number;
  total_procesado: number;
  id_lote: number;
  id_labor: number;*/

  idNivelAprobacion: number;
  idNivelAprobacionRuta: string;
  nivelAprobacionRuta: string;
  idTipoSolicitud: number;
  tipoSolicitud: string;
  idAccion: 1;
  accion: string;
  idNivelDireccion: string;
  nivelDireccion: string;
  idRuta: number;
  ruta: string;
  idTipoMotivo: number;
  tipoMotivo: string;
  idTipoRuta: number;
  tipoRuta: string;
  fechaActualizacion: Date;
  fechaCreacion: Date;
  usuarioCreacion: string;
  usuarioActualizacion: string;
  estado: string;
}
export interface IConsultaNivelesAprobacionTable
  extends IConsultaNivelesAprobacion,
    IRowTableAttributes {}

export type IConsultaNivlesAprobaciones = IConsultaNivelesAprobacion[];
export type IConsultaNivelesAprobacionesTable = IConsultaNivelesAprobacionTable[];

export interface IConsultaNivelesAprobacionResponse {
  totalRegistros: number;
  nivelAprobacionType: IConsultaNivlesAprobaciones;
}
