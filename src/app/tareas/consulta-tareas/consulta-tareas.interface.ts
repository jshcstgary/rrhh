import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaTarea {
  id: string;
  numero_solicitud: string;
  tarea: string;
  solicitud: string;
  fecha_creacion: string;
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
