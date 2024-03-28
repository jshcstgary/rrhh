//import atributos tabla
import { IRowTableAttributes } from "src/app/component/table/table.interface";

//import atributos base de los servicios
import { IServiceBase } from "src/app/services/util/util.interface";

/* Biometrico */
export interface IJAWBiometrico {
  codigoHacienda: string;
  nRelojMarcación: number;
  saObservaciones: string;
  validaPresupuesto: string | boolean;
  validaMarcación: string | boolean;
}

export interface IJAWBiometricoTable
  extends IJAWBiometrico,
    IRowTableAttributes {}

export interface IJAWResponseBiometrico {
  totalRegistros: number;
  biometricosType: IJAWBiometricos;
}

export type IJAWBiometricos = IJAWBiometrico[];
export type IJAWBiometricosTable = IJAWBiometricoTable[];

/*Trabajador*/

//Interface Entidad
export interface ITrabajador extends IServiceBase {
  id: number;
  cedula: string;
  apellido: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  nacionalidad: string;
  fechaIngresoInicial: Date;
  sexo: string;
  estadoCivil: string;
  numeroCargas: number;
  nombrePadre?: string;
  nombreMadre?: string;
  hijos: number;
  conyuge?: string;
  titulo?: string;
  fechaNacimiento: Date;
  lugarNacimiento?: string;
  tipoLicencia?: string;
  numeroLicencia?: string;
  estado?: string;
}

//Interface table
//export interface ITrabajadorTable extends ITrabajador, IRowTableAttributes {}

//Listas
export type ITrabajadores = ITrabajador[];

//Tablas
//export type IITrabajadoresTable= ITrabajadorTable[];

//Response Servicio
export interface ITrabajadorResponse {
  totalRegistros: number;
  trabajadorType: ITrabajadores;
}


/*Matriz Habilidades*/


//Interface Entidad
export interface IMatrizHabilidades {
  aplicativoId?: string;
  estacion?: string;
  fechaActualizacion?: Date;
  fechaCreacion?: Date;
  horaCreacion?: Date;
  horaActualizacion?: Date;
  menuId?: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
  estado?: string;
  codigoTrabajador: number;
  codigoProducto: number;
  codigoTipoLabor: number;
  laborGenerico: number;
  secuencia: number;
  claseLabor: string;
  descripcionProducto?: string;
  descripcionTipoLabor?: string;
  descripcionLaborGenerico?: string;
}

//Interface table
export interface IMatrizHabilidadesTable
  extends IMatrizHabilidades,
    IRowTableAttributes {}

//Listas
export type IMatrizesHabilidades = IMatrizHabilidades[];

//Tablas
export type IMatrizesHabilidadesTable = IMatrizHabilidadesTable[];

//Response Servicio
export interface IMatrizesHabilidadesResponse {
  totalRegistros: number;
    matrizHabilidadesType: IMatrizesHabilidades;
  }
