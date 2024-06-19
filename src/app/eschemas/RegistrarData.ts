export class RegistrarData {
  // Input data elements to submit as part of
  // 'Registrar' task step in BPMN process.
  // See task def id in environment.ts file

  /*constructor(
    // code
    public codigo            : string = '',
    // description
    public description       : string = '',
    // amount
    public importe           : number = 0,
    // Observations / notes
    public observations       : String = new String()
  ) {  }*/

  constructor(
    /*public codigo: string = "CODIGO_1",
    public idEmpresa: string = "ID_EMPRESA",
    public compania: string = "Reybanpac",
    public departamento: string = "Inventarios",
    public nombreCargo: string = "Jefatura",
    public nomCCosto: string = "Zona camarones",
    public codigoPosicion: string = "0425",
    public descrPosicion: string = "Analista de recursos humanos",
    public codigoPuesto: string = "CODIGO_PUESTO",
    public descrPuesto: string = "Gerencia media",
    public fechaIngresogrupo: string = "2024-04-15T12:08:34.473",
    public grupoPago: string = "GRUPO_PAGO",
    public reportaA: string = "Gerente RRHH",
    public localidad: string = "Hacienda",
    public nivelDir: string = "Tecnico/Asistencia",
    public descrNivelDir: string = "Tecnico descripcion",
    public nivelRepa: string = "Gerencia Medios",
    public nombreCompleto: string = "MOROCHO VARGAS CAL ESTUARIO",
    public subledger: string = "60067579",
    public sucursal: string = "SUSURSAL 1",
    public unidadNegocio: string = "UNIDAD NEGOCIO 1",
    public tipoContrato: string = "Eventual",
    public descripContrato: string = "Eventual con remuneracion mixta",
    public status: string = "A",

    public sueldo: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public mensual: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public trimestral: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public semestral: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public anual: number | null = 2000,



    */

    public codigo: string = "",
    public idEmpresa: string = "",
    public compania: string = "",
    public departamento: string = "",
    public nombreCargo: string = "",
    public nomCCosto: string = "",
    public misionCargo: string = "", // Para Requisión - Nuevo/Eventual
    public justificacionCargo: string = "", // Para Requisión - Nuevo/Eventual
    public codigoPosicion: string = "",
    public descrPosicion: string = "",
    public codigoPuesto: string = "",
    public descrPuesto: string = "",
    public fechaIngresogrupo: string = "",
    public puestoJefeInmediato: string = '',
    public jefeInmediatoSuperior: string = '',
    public grupoPago: string = "",
    public reportaA: string = "",
    public supervisaA: string = "",
    public localidad: string = "",
    public nivelDir: string = "",
    public descrNivelDir: string = "",
    public nivelRepa: string = "",
    public nombreCompleto: string = "",
    public subledger: string = "",
    public sucursal: string = "",
    public unidadNegocio: string = "",
    public tipoContrato: string = "",
    public tipoProceso: string = "",
    public descripContrato: string = "",
    public status: string = "",
    public correo: string = "",
    public fechaIngreso: Date | string = new Date(),
    public comentariosAnulacion: string = "",
    public sueldo: string = "",
    public sueldoMensual: string = "",
    public sueldoTrimestral: string = "",
    public sueldoSemestral: string = "",
    public sueldoAnual: string = "" ,/* Agrego estos campos que no están en la data */
    public taskNivelAprobador: string = ""
  ) // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
  /*public sueldo: number | null = 0,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public mensual: number | null = 0,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public trimestral: number | null = 0,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public semestral: number | null = 0,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public anual: number | null = 0*/
  {}

  reset() {
    this.codigo = "";
    this.idEmpresa = "";
    this.compania = "";
    this.departamento = "";
    this.nombreCargo = "";
    this.nomCCosto = "";
    this.codigoPosicion = "";
    this.descrPosicion = "";
    this.codigoPuesto = "";
    this.descrPuesto = "";
    this.fechaIngresogrupo = "";
    this.grupoPago = "";
    this.reportaA = "";
    this.localidad = "";
    this.nivelDir = "";
    this.descrNivelDir = "";
    this.nivelRepa = "";
    this.nombreCompleto = "";
    this.subledger = "";
    this.sucursal = "";
    this.unidadNegocio = "";
    this.tipoContrato = "";
    this.descripContrato = "";
    this.status = "";
    this.correo = "";
    this.taskNivelAprobador;
    this.tipoProceso="";
    // this.sueldo = 0;
    // this.mensual = 0;
    // this.trimestral = 0;
    // this.semestral = 0;
    // this.anual = 0;
  }
}
