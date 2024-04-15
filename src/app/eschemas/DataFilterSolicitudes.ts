export class DataFilterSolicitudes {
  constructor(
    public idEmpresa?: string,
    public idUnidadNegocio?: string,
    public idTipoSolicitud?: string,
    public estado?: string,
    public fechaDesde?: any,
    public fechaHasta?: any
  ) {}
}
