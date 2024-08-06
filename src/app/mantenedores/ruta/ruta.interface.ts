import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IRuta {
  id?: number | string;
  ruta: string;
  idTipoRuta?: number | string;
  estado: string | boolean;
}

export interface ITipoRuta {
  id?: number | string;
  tipoRuta: string;
  estado: string;
}

export interface IRutaTable extends IRuta, IRowTableAttributes { }

export type ITipoRutas = ITipoRuta[];
export type IRutas = IRuta[];
export type IRutasTable = IRutaTable[];

export interface ITipoRutaResponse {
  totalRegistros: number;
  tipoRutaType: ITipoRutas;
}

export interface IRutaResponse {
  totalRegistros: number;
  tipoaccionType: IRutas;
}
