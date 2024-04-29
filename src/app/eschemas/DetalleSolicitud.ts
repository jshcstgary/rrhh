export class DetalleSolicitud {
  constructor(
    /*
    // Original
    public idDetalleSolicitud?: number,
    public idSolicitud?: string | null,
    public codigo?: string | null,
    public valor?: string | null,
    public estado?: string | null,
    public fechaRegistro?: Date | null,
    public compania?: string | null,
    public unidadNegocio?: string | null,
    public codigoPosicion?: string | null,
    public descripcionPosicion?: string | null,
    public areaDepartamento?: string | null,
    public localidadZona?: string | null,
    public nivelDireccion?: string | null,
    public centroCosto?: string | null,
    public nombreEmpleado?: string | null,
    public subledger?: string | null,
    public reportaA?: string | null,
    public nivelReporteA?: string | null,
    public supervisaA?: string | null,
    public tipoContrato?: string | null,
    public departamento?: string | null,
    public cargo?: string | null,
    public jefeSolicitante?: string | null,
    public responsableRRHH?: string | null,
    public localidad?: string | null,
    public fechaIngreso?: Date | null,
    public unidad?: string | null,
    public puesto?: string | null,
    public jefeInmediatoSuperior?: string | null,
    public jefeReferencia?: string | null,
    public cargoReferencia?: string | null,
    public fechaSalida?: Date | null,
    public puestoJefeInmediato?: string | null,
    public subledgerEmpleado?: string | null,
    public grupoDePago?: string | null,
    public sucursal?: string | null,
    public movilizacion?: string | null,
    public alimentacion?: string | null,
    public jefeAnteriorJefeReferencia?: string | null,
    public causaSalida?: string | null,
    public nombreJefeSolicitante?: string | null,
    public misionCargo?: string | null,
    public justificacion?: string | null

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public sueldo: number | null = 2000


    */

    /*public idDetalleSolicitud?: number,
    public idSolicitud?: string | null,

    public codigo: string | null = "Prueba",
    public valor: string | null = "Prueba",
    public estado: string | null = "A",
    public fechaRegistro: string | null = "2024-03-27T20:57:04.34",
    public compania: string | null = "Prueba",
    public unidadNegocio: string | null = "Prueba",
    public codigoPosicion: string | null = "Prueba",
    public descripcionPosicion: string | null = "Prueba",
    public areaDepartamento: string | null = "Prueba",
    public localidadZona: string | null = "Prueba",
    public nivelDireccion: string | null = "OP",
    public centroCosto: string | null = "Prueba",
    public nombreEmpleado: string | null = "Morocho Vargas Gal Estuario",
    public subledger: string | null = "Prueba",
    public reportaA: string | null = "Prueba",
    public nivelReporteA: string | null = "Prueba",
    public supervisaA: string | null = "Prueba",
    public tipoContrato: string | null = "Prueba",
    public departamento: string | null = "Prueba",
    public cargo: string | null = "Prueba",
    public jefeSolicitante: string | null = "Prueba",
    public responsableRRHH: string | null = "Prueba",
    public localidad: string | null = "Prueba",
    public fechaIngreso: string | null = "2024-03-27T20:57:04.34",
    public unidad: string | null = "Prueba",
    public puesto: string | null = "Prueba",
    public jefeInmediatoSuperior: string | null = "Prueba",
    public jefeReferencia: string | null = "Prueba",
    public cargoReferencia: string | null = "Prueba",
    public fechaSalida: string | null = "2024-03-27T20:57:04.34",
    public puestoJefeInmediato: string | null = "Prueba",
    public subledgerEmpleado: string | null = "Prueba",
    public grupoDePago: string | null = "Prueba",
    public sucursal: string | null = "Prueba",
    public movilizacion: string | null = "Prueba",
    public alimentacion: string | null = "Prueba",
    public jefeAnteriorJefeReferencia: string | null = "Prueba",
    public causaSalida: string | null = "Prueba",
    public nombreJefeSolicitante: string | null = "Prueba",
    public misionCargo: string | null = "Prueba",
    public justificacion: string | null = "Prueba",

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public sueldo: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public mensual: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public trimestral: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public semestral: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud
    public anual: number | null = 2000,

    // Este campo no sé de donde viene, no viene en el request de solicitud ni en el de detalle solicitud

    public aprobadoresDinamicos:
      | string
      | null = "Descripción de aprobadores dinámicos",
    public gerenteRRHHCorporativo:
      | string
      | null = "Descripción de Ggrente de RRHH Corporativo",
    public comiteRemuneraciones:
      | string
      | null = "Descripción de Comité de Remuneraciones"*/

    public idDetalleSolicitud: number = 0,
    public idSolicitud: string = "",
    public codigo: string = "",
    public valor: string = "",
    public estado: string = "",
    // public fechaRegistro: string = "",
    public fechaRegistro: Date | string = new Date(),
    public compania: string = "",
    public unidadNegocio: string = "",
    public codigoPosicion: string = "",
    public descripcionPosicion: string = "",
    public areaDepartamento: string = "",
    public localidadZona: string = "",
    public nivelDireccion: string = "",
    public centroCosto: string = "",
    public nombreEmpleado: string = "",
    public subledger: string = "",
    public reportaA: string = "",
    public nivelReporteA: string = "",
    public supervisaA: string = "",
    public tipoContrato: string = "",
    public departamento: string = "",
    public cargo: string = "",
    public jefeSolicitante: string = "",
    public responsableRRHH: string = "",
    public localidad: string = "",
    // public fechaIngreso: string = "",
    public fechaIngreso: Date | string = new Date(),
    public unidad: string = "",
    public puesto: string = "",
    public jefeInmediatoSuperior: string = "",
    public jefeReferencia: string = "",
    public cargoReferencia: string = "",
    // public fechaSalida: string = "",
    public fechaSalida: Date | string = new Date(),
    public puestoJefeInmediato: string = "",
    public subledgerEmpleado: string = "",
    public grupoDePago: string = "",
    public sucursal: string = "",
    public movilizacion: string = "",
    public alimentacion: string = "",
    public jefeAnteriorJefeReferencia: string = "",
    public causaSalida: string = "",
    public nombreJefeSolicitante: string = "",
    public misionCargo: string = "",
    public justificacion: string = "",
    public sueldo: string = "",
    public sueldoVariableMensual: string = "",
    public sueldoVariableTrimestral: string = "",
    public sueldoVariableSemestral: string = "",
    public sueldoVariableAnual: string = "",

    public aprobadoresDinamicos:
      | string
      | null = "Descripción de aprobadores dinámicos",
    public gerenteRRHHCorporativo:
      | string
      | null = "Descripción de Ggrente de RRHH Corporativo",
    public comiteRemuneraciones:
      | string
      | null = "Descripción de Comité de Remuneraciones"
  ) {}
}
