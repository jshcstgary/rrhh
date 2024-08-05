import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IConsultaGrafico {
  name: string;
  creadas: number | string;
  enviadas: number | string;
  reasignadas: number | string;
  devueltas: number | string;
  anuladas: number | string;
}

export interface IConsultaGraficoTable extends IConsultaGrafico, IRowTableAttributes {}

export type IConsultaGraficos = IConsultaGrafico[];
export type IConsultaGraficoesTable = IConsultaGraficoTable[];

export interface IConsultaGraficoResponse {
  totalRegistros: number;
  consultaGraficoType: IConsultaGraficos;
}
