export class Solicitud {
  constructor(
    public fechaActualizacion?: Date | null,
    public fechaCreacion?: Date | null,
    // public usuarioCreacion?: string | null,
    public usuarioCreacion: string | null = "", // Dato quemado (cambiar)
    // public usuarioActualizacion?: string | null,
    public usuarioActualizacion: string | null = "", // Dato quemado (cambiar)
    // public estado?: string | null,
    public estado: string | null = "", // Dato quemado (cambiar)
    public idSolicitud?: string | null,
    public idInstancia?: string | null,
    // public idEmpresa?: string | null,
    public idEmpresa: string | null = "", // Dato quemado (cambiar)
    // public empresa?: string | null,
    public empresa: string | null = "", // Dato quemado (cambiar)
    // public idUnidadNegocio?: string | null,
    public idUnidadNegocio: string | null = "", // Dato quemado (cambiar)
    // public unidadNegocio?: string | null,
    public unidadNegocio: string | null = "", // Dato quemado (cambiar)
    // public estadoSolicitud?: string | null,
    public estadoSolicitud: string | null = "", // Dato quemado (cambiar)
    public idTipoSolicitud?: number | null,
    public tipoSolicitud?: string | null,
    public idTipoMotivo?: number | null,
    public tipoMotivo?: string | null,
    public idTipoAccion?: number | null,
    public tipoAccion?: string | null
  ) {}
}
