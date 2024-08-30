import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaAprobadoresFijo {
  // ID_APROBACION: number;
  // niveL_DIRECCION: string;
  // reportA_A: string;
  // descripcionPosicion: string;
  // estado: string;

  iD_APROBADOR: number;
  niveL_DIRECCION: string;
  codigO_POSICION: string;
  subleger: string;
  nombre: string;
  codigO_POSICION_REPORTA_A: string;
  reportA_A: string;
  estado: string;
  fechA_CREACION: Date;
  fechA_MODIFICACION: Date;
  usuariO_CREACION: string;
  usuariO_MODIFICACION: string;
  descripcioN_POSICION: string;
  supervisA_A: string;
  niveL_REPORTE: string;
}
export interface IConsultaAprobadoresFijoTable
  extends IConsultaAprobadoresFijo,
    IRowTableAttributes {}

export type IConsultaAprobadoresFijos = IConsultaAprobadoresFijo[];
export type IConsultaAprobadoresFijosTable = IConsultaAprobadoresFijoTable[];

export interface IConsultaAprobadoresFijosResponse {
  totalRegistros: number;
  aprobadoresFijos: IConsultaAprobadoresFijos;
}
