export interface IInvFacProductor {
  codigoProductor: number;
  cedula: string;
  nombreApellido: string;
}

export interface IInvFacCanton {
  drsy: string;
  drrt: string;
  drky: string;
  descripcion: string;
}

export interface IInvConsultarLocacion {
  costCenter: string;
  location: string;
}

export interface IInvFacProvincia extends IInvFacCanton {}
export interface IInvFacSector extends IInvFacCanton {}

export type IInvFacProductores = IInvFacProductor[];
export type IInvFacCantones = IInvFacCanton[];
export type IInvFacProvincias = IInvFacProvincia[];
export type IInvFacSectores = IInvFacSector[];
export type IInvConsultarLocaciones = IInvConsultarLocacion[];

export type InvFactTableType =
  | "productores"
  | "sector"
  | "cantones"
  | "ConsultarLocaciones"
  | "provincia";
