export class DetalleAprobaciones{
  constructor(

      public id_Solicitud : string ="0",
      public id_NivelAprobacion: number = 0,
      public id_TipoSolicitud: string = "",
      public id_Accion: number = 0,
      public id_TipoMotivo: number = 0,
      public id_TipoRuta: number = 0,
      public id_Ruta: number = 0,
      public tipoSolicitud: string ="",
      public motivo: string="",
      public tipoRuta: string="",
      public ruta: string="",
      public accion: string="",
      public nivelDirecion: string="",
      public nivelAprobacionRuta: string="",
      public usuarioAprobador: string="",
      public codigoPosicionAprobador: string="",
      public descripcionPosicionAprobador: string="",
      public sudlegerAprobador: string="",
      public codigoPosicionReportaA: string="",
      public nivelDireccionAprobador: string="",
      public estadoAprobacion: string="",
      public estado: string ="",
      public correo: string ="",
      public usuarioCreacion: string="",
      public usuarioModificacion: string="",
      public comentario: string="",
      public fechaCreacion: Date | string = new Date(),
      public fechaModificacion: Date | string = new Date()


    //fin campos detalle de aprobaciones

  ) {}
}
