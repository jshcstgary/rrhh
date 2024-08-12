import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITiposolicitud {
  //id?: number;
  codigoTipoSolicitud?: string;
  tipoSolicitud: string;
  estado: string | boolean;
  fechaActualizacion: Date;
  fechaCreacion: Date;
  usuarioCreacion: string;
  usuarioActualizacion: string;
}
export interface ITiposolicitudTable
  extends ITiposolicitud,
    IRowTableAttributes {}

export type ITiposolicitudes = ITiposolicitud[] | any;
export type ITiposolicitudesTable = ITiposolicitudTable[];

export interface ITiposolicitudResponse {
  tipoSolicitudTypes: ITiposolicitudes;
}
