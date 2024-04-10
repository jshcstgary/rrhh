export class Solicitud {
  public id = Date.now().toString().slice(-6);
  request: {
    idSolicitud: string;
    idInstancia: string;
    idEmpresa: string;
    empresa: string;
    idUnidadNegocio: string;
    unidadNegocio: string;
    estadoSolicitud: string;
    idTipoSolicitud: number;
    tipoSolicitud: string;
    idTipoMotivo: number;
    idTipoAccion: number;
    tipoAccion: string;
    fechaActualizacion: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    usuarioActualizacion: string;
    estado: string;
  };

  infoGeneral: {
    idSolicitud: string;
    idInstancia: string;
    idEmpresa: string;
    empresa: string;
    idUnidadNegocio: string;
    unidadNegocio: string;
    estadoSolicitud: string;
    idTipoSolicitud: number;
    tipoSolicitud: string;
    idTipoMotivo: number;
    idTipoAccion: number;
    tipoAccion: string;
    fechaActualizacion: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    usuarioActualizacion: string;
    estado: string;

    tipoMotivo: string;
    codigoPosicion: string;
    nombreEmpleado: string;
    subledger: string;
    descripcionPosicion: string;
    // compania: "Reybanpac",

    areaDepartamento: string;
    tipoCargo: string;
    localidadZona: string;
    nivelDireccion: string;
    centroCosto: string;
  };

  funcionesResponsabilidades: {
    reportaA: string;
    supervisaA: string;
    tipoContrato: string;
    nivelReporte: string;
    sueldo: string;
  };
  tipoVariables: {
    mensual: string;
    trimestral: string;
    semestral: string;
    anual: string;
  };
  aprobadores: { nivel: number; descripcion: string; comentarios: string }[];
  atencionProbadores: {
    aprobadoresDinamicos: string;
    gerenteRRHHCorporativo: string;
    comiteRemuneraciones: string;
  };

  constructor() {
    this.request = {
      idSolicitud: this.id,
      idInstancia: "01",
      idEmpresa: "01",
      empresa: "Reybanpac",
      idUnidadNegocio: "01",
      unidadNegocio: "Lacteos",
      estadoSolicitud: "1",
      idTipoSolicitud: 1,
      tipoSolicitud: "Requisición",
      idTipoMotivo: 1,
      idTipoAccion: 1,
      tipoAccion: "",
      fechaActualizacion: "2024-04-05T21:21:45.667",
      fechaCreacion: "2024-04-05T21:21:45.667",
      usuarioCreacion: "lnmora",
      usuarioActualizacion: "lnmora",
      estado: "Aprobado",
    };

    this.infoGeneral = {
      idSolicitud: this.id,
      idInstancia: "01",
      idEmpresa: "01",
      empresa: "Reybanpac",
      idUnidadNegocio: "01",
      unidadNegocio: "Lacteos",
      estadoSolicitud: "1",
      idTipoSolicitud: 1,
      tipoSolicitud: "",
      idTipoMotivo: 1,
      idTipoAccion: 1,
      tipoAccion: "",
      fechaActualizacion: "2024-04-05T21:21:45.667",
      fechaCreacion: "2024-04-05T21:21:45.667",
      usuarioCreacion: "lnmora",
      usuarioActualizacion: "lnmora",
      estado: "Aprobado",

      tipoMotivo: "",
      codigoPosicion: "545596",
      nombreEmpleado: "Morocho Vargas Gal Estuario",
      subledger: "6007579",
      descripcionPosicion: "Analista de recursos humanos",
      // compania: "Reybanpac",

      areaDepartamento: "General",
      tipoCargo: "Mandos medios / Jefaturas",
      localidadZona: "Mirador de ila",
      nivelDireccion: "Asistente - técnico",
      centroCosto: "23 | Santo Domingo",
    };

    this.funcionesResponsabilidades = {
      reportaA: "151 | Gerente de recursos humanos",
      supervisaA: "#N/D",
      tipoContrato: "Eventual con remuneración mixta",
      nivelReporte: "Gerencia media",
      sueldo: "2000",
    };

    this.tipoVariables = {
      mensual: "2000",
      trimestral: "2000",
      semestral: "2000",
      anual: "2000",
    };

    this.aprobadores = [
      {
        nivel: 1,
        descripcion: "20 - Asistencia de Gerencia",
        comentarios: "No aplica",
      },
      {
        nivel: 2,
        descripcion: "20 - Asistencia de Gerencia",
        comentarios: "No aplica",
      },
      {
        nivel: 3,
        descripcion: "20 - Asistencia de Gerencia",
        comentarios: "No aplica",
      },
      {
        nivel: 4,
        descripcion: "20 - Asistencia de Gerencia",
        comentarios: "No aplica",
      },
      {
        nivel: 5,
        descripcion: "20 - Asistencia de Gerencia",
        comentarios: "No aplica",
      },
      {
        nivel: 6,
        descripcion: "20 - Asistencia de Gerencia",
        comentarios: "No aplica",
      },
      // { nivel: 5, descripcion: "RRHH Corporativo", comentarios: "" },
      // { nivel: 6, descripcion: "Remuneraciones", comentarios: "" },
    ];

    this.atencionProbadores = {
      aprobadoresDinamicos: "Descripción de aprobadores dinámicos",
      gerenteRRHHCorporativo: "Descripción de Ggrente de RRHH Corporativo",
      comiteRemuneraciones: "Descripción de Comité de Remuneraciones",
    };
  }
}
