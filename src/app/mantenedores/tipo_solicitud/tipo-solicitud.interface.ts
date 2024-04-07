import { IRowTableAttributes } from "src/app/component/table/table.interface";

export interface ITiposolicitud {
  id?: number | string;
  tipoSolicitud?: string;
  estado: string | boolean;
}
export interface ITiposolicitudTable
  extends ITiposolicitud,
    IRowTableAttributes {}

export type ITiposolicitudes = ITiposolicitud[];
export type ITiposolicitudesTable = ITiposolicitudTable[];

export interface ITiposolicitudResponse {
  tipoSolicitudTypes: ITiposolicitudes;
}
