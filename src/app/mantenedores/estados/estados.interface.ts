import { IRowTableAttributes } from "src/app/component/table/table.interface";

// export interface IEstados {
//   codigo: string;
//   descripcion: string;
//   estado: string | boolean;
// }
// this.dataTable = response.itemCatalogoTypes.map((r) => ({
//   // id: r.id,
//   codigo: r.codigo,
//   descripcion: r.valor, // El valor es la descripción
//   estado: r.estado,
// }));
export interface IEstados {
  id?: number;
  codigo?: string;
  catalogoId?: string;
  valor?: string;
  descripcion?: string;
  estado?: string | boolean;
  aplicativoId?: string;
  estacion?: string;
  menuId?: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}

export interface IEstadoTable extends IEstados, IRowTableAttributes {}

export type IEstado = IEstados[];
export type ITiporutasTable = IEstadoTable[];

export interface IEstadoResponse {
  totalRegistros: number;
  EstadosType: IEstados;
}
