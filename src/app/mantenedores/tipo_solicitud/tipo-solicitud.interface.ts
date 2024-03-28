import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITiposolicitud {
  id?: number | string;
  tipoSolicitud?: string;
  /*codigo?: number | string;
  descripcion: string;
  estacion?: string;
  aplicativoId?: string;
  fechaActualizacion?: string;
  fechaCreacion?: string;
  horaCreacion?: string;
  horaActualizacion?: string;
  menuId?: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;*/
}
export interface ITiposolicitudTable
  extends ITiposolicitud,
    IRowTableAttributes {}

export type ITiposolicitudes = ITiposolicitud[];
export type ITiposolicitudesTable = ITiposolicitudTable[];

export interface ITiposolicitudResponse {
  tipoSolicitudTypes: ITiposolicitudes;
}
