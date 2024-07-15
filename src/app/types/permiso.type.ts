export type Permission = {
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
