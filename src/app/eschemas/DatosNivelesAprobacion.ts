export class DatosNivelesAprobacion {
  constructor(
    public fechaActualizacion: Date = new Date(),
    public fechaCreacion: Date = new Date(),
    public usuarioCreacion: string = "",
    public usuarioActualizacion: string = "",
    public estado: any = "",
    public idNivelAprobacion: number = 0,
    public idNivelAprobacionRuta: string = "PR",
    public nivelAprobacionRuta: string = "",
    public idTipoSolicitud: number = 0,
    public tipoSolicitud: string = "",
    public idAccion: number = 0,
    public accion: string = "",
    public idNivelDireccion: string = "OP",
    public nivelDireccion: string = "",
    public idRuta: number = 0,
    public ruta: string = "",
    public idTipoMotivo: number = 0,
    public tipoMotivo: string = "",
    public idTipoRuta: number = 0,
    public tipoRuta: string = ""
  ) {}
}
