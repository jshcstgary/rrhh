export interface INiveles {
  totalRegistros: number;
  evType: EvType[];
}

export interface EvType {
  compania: string;
  nivelDir: string;
  unidadNegocio: string;
}
