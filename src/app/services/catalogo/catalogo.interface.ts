import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IItemCatalogo {
  aplicativoId?: string;
  estacion?: string;
  fechaActualizacion?: Date;
  fechaCreacion?: Date;
  horaCreacion?: Date;
  horaActualizacion?: Date;
  menuId?: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
  descripcionCategoria?: string;
  id?: number;
  codigo?: string;
  valor?: string;
  descripcion: string;
  catalogoId: CatalogoType;
  estado?: string | number | boolean;
}

export interface IItemCatalogoTable
  extends IItemCatalogo,
    IRowTableAttributes {}

export type IItemsCatalogo = IItemCatalogo[];
export type IItemsCatalogoTable = IItemCatalogoTable[];

export interface IResponseItemCatalogo {
  totalRegistros: number;
  itemCatalogoTypes: IItemsCatalogo;
}

export type CatalogoType =
  | "SISTEMA_FUMIGACION"
  | "TIPO_COMPONENTE"
  | "CODIGO_COLORES"
  | "TIPO_DEFECTOS"
  | "BUQUES"
  | "MARCAS"
  | "PLASTICO"
  | "PRODUCTO_FRUTA"
  | "CODIGO_DE_PLAGA"
  | "OPTIMO_DE_MATERIALES"
  | "UNIDAD_COMPARACION"
  | "MANTENIMIENTO_ESTACIONALIDAD"
  | "TIPO_VIVIENDA"
  | "VEHICULO"
  | "UNIDAD_EMPAQUE"
  | "TIPO_CALENDARIO"
  | "TIPO_CAMION"
  | "TIPO_PROCESO_PESAJE"
