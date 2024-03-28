import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaSolicitud {
  id: string;
  labor: string;
  lote: string;
  procesado: number;
  total_procesado: number;
  id_lote: number;
  id_labor: number;
}
export interface IConsultaSolicitudTable
  extends IConsultaSolicitud,
    IRowTableAttributes {}

export type IConsultaSolicitudes = IConsultaSolicitud[];
export type IConsultaSolicitudesTable = IConsultaSolicitudTable[];
