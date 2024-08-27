export class RegistrarData {
	constructor(
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
		public fechaIngreso: Date | string = "",
		public comentariosAnulacion: string = "",
		public sueldo: string = "",
		public sueldoMensual: string = "",
		public sueldoTrimestral: string = "",
		public sueldoSemestral: string = "",
		public sueldoAnual: string = "",/* Agrego estos campos que no están en la data */
		public taskNivelAprobador: string = "",
		public puestoJefeInmediato: string = '',
		public jefeInmediatoSuperior: string = '',
		public responsableRRHH: string = ''
	) { }
}
