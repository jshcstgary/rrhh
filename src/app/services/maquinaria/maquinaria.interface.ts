import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface IMaquinaria {
  id?: number;
  codigo?: number;
  codigoHacienda: string;
  descripcion: string;
  hacienda?: string;
  marca: string;
  modelo: string;
  placa?: string;
  tipo: string;
  numeroChasis: string;
  numeroDeMotor: string;
  numeroSerie: string;
  responsable?: string;
  tipoMaquinaria?: string;
  nombreTipoMaquinaria?: string;
  aplicativoId?: string;
  estacion?: string;
  fechaActualizacion?: Date;
  fechaCreacion?: Date;
  horaCreacion?: Date;
  horaActualizacion?: Date;
  menuId?: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}

export interface IMaquinariaTable extends IMaquinaria, IRowTableAttributes {}

export type IMaquinarias = IMaquinaria[];
export type IMaquinariasTable = IMaquinariaTable[];

export interface IMaquinasResponse {
  totalRegistros: number;
  maquinariaTypes: IMaquinarias;
}

export type MaquinariaType = "E" | "M" | "V";
