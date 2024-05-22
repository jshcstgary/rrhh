import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ICatalogo {
  id?: number | string;
  codigo: string;
  valor: string;
  descripcion: string;
  catalogoId: string;
  estado: string;
  aplicativoId: string;
  estacion: string;
  fechaActualizacion: string;
  fechaCreacion: string;
  horaCreacion: string;
  horaActualizacion: string;
  menuId: string;
  usuarioCreacion: string;
  usuarioActualizacion: string

}


export interface ICatalogoTable
  extends ICatalogo, IRowTableAttributes {}


export type ICatalogos = ICatalogo[];
export type IRutasTable = ICatalogoTable[];



export interface ICatalogoResponse {
  totalRegistros: number;
  itemCatalogoTypes: ICatalogos;
}
