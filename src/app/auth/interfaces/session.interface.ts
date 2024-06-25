// import { IPermisos } from "../../../modules/util/interfaces/permiso.interface";

export interface Session {
  Usuario: string;
  Perfil: string;
  Perfiles: IUsuarioEmpresa[];
  Token: string;
  IdEmpresa: string;
  Localidad: string;
  // Programas: IPermisos;
  Perfile: IProfilesByUser[];
}

export interface perfiles {
  id: string;
  name: string;
}

export interface IUsuarioEmpresa {
  codigoEmpresa: string;
  empresa: string;
  usuario: string;
}
export interface IProfilesByUser {
  codigoUsuario?: string;
  codigoEmpresa?: string;
  codigoPerfil?: string;
  perfil?: string;
}
