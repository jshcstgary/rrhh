import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IEstados {
  codigo: string;
  descripcion: string;
  estado: string | boolean;
}
export interface IEstadoTable extends IEstados, IRowTableAttributes {}

export type IEstado = IEstados[];
export type ITiporutasTable = IEstadoTable[];

export interface IEstadoResponse {
  totalRegistros: number;
  EstadosType: IEstados;
}
