import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaTarea {
  idSolicitud: string;
  name: string;
  tipoSolicitud: string;
  startTime: string;
}
export interface IConsultaTareaTable
  extends IConsultaTarea,
    IRowTableAttributes {}

export type IConsultaTareas = IConsultaTarea[];
export type IConsultaTareasTable = IConsultaTareaTable[];

export interface IConsultaNivelesAprobacionResponse {
  totalRegistros: number;
  nivelAprobacionType: IConsultaTareas;
}
