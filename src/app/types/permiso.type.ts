export type LoginRequest = {
  codigoAplicacion: string;
  codigoEmpresa: string;
  codigoRecurso: string;
  usuario: string;
};

export type Perfil = {
  codigo: string;
  apellidos: string;
  nombres: string;
  email: string;
  vistas: Permiso[];
};

export type Permiso = {
  codigo: string;
  nombre: string;
  visualizar: boolean;
  nuevo: boolean;
  modificar: boolean;
  eliminar: boolean;
  exportar: boolean;
  procesar: boolean;
  consulta: boolean;
  controles: Control[];
}

export type Control = {
  codigo_Control: string;
  habilitar: boolean;
  modificar: boolean;
  visualizar: boolean;
}
