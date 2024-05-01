export class AprobadorFijo {
  constructor(
    public iD_APROBADOR: any = 0,
    public niveL_DIRECCION: string = "",
    public codigO_POSICION: string = "",
    public subleger: string = "",
    public nombre: string = "",
    public codigO_POSICION_REPORTA_A: string = "",
    public reportA_A: string = "",
    public estado: string | boolean = "",
    public fechA_CREACION: string = "",
    public fechA_MODIFICACION: string = "",
    public usuariO_CREACION: string = "",
    public usuariO_MODIFICACION: string = "",
    public descripcioN_POSICION: string = "",
    public supervisA_A: string = "",
    public niveL_REPORTE: string = ""
  ) {}
}
