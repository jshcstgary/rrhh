export interface IEmpleados {
  totalRegistros: number;
  evType: EvType[];
}

export interface EvType {
  codigo: string;
  idEmpresa: string;
  compania: string;
  departamento: string;
  nombreCargo: string;
  nomCCosto: string;
  codigoPosicion: string;
  descrPosicion: string;
  codigoPuesto: string;
  descrPuesto: string;
  fechaIngresogrupo: Date;
  grupoPago: string;
  reportaA: string;
  localidad: string;
  nivelDir: string;
  descrNivelDir: string;
  nivelRepa: string;
  nombreCompleto: string;
  subledger: string;
  sucursal: string;
  unidadNegocio: string;
  tipoContrato: string;
  descripContrato: string;
  sueldo: string;
  sueldoVariableMensual: string;
  sueldoVariableTrimestral: string;
  sueldoVariableSemestral: string;
  sueldoVariableAnual: string;
  codigoPosicionReportaA: string;
  status: string;
}

type EmpleadoData = IEmpleados["evType"][0];

export interface IEmpleadoData extends EmpleadoData {
  comentarios?: string;
  usuario?: string;
  parentezco?: string;
}
