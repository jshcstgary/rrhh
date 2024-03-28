import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITiporuta {
  id?: number | string;
  tipoRuta: string;
}
export interface ITiporutaTable
  extends ITiporuta,
    IRowTableAttributes {}

export type ITiporutas = ITiporuta[];
export type ITiporutasTable = ITiporutaTable[];

export interface ITiporutaResponse {
  totalRegistros: number;
  tipoRutaType: ITiporutas;
}
