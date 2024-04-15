export class DataFilterSolicitudes {
  constructor(
    public idEmpresa?: string,
    public idUnidadNegocio?: string,
    public idTipoSolicitud?: string,
    public estado?: string,
    public fechaDesde?: any,
    public fechaHasta?: any
  ) {}

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  isUndefinedOrNull(value: any): boolean {
    return value === undefined || value === null;
  }

  verifyFilterFields() {
    const allUndefined =
      this.isUndefined(this.idEmpresa) &&
      this.isUndefined(this.idUnidadNegocio) &&
      this.isUndefined(this.idTipoSolicitud) &&
      this.isUndefined(this.estado) &&
      this.isUndefined(this.fechaDesde) &&
      this.isUndefined(this.fechaHasta);
    const allNull =
      this.idEmpresa === null &&
      this.idUnidadNegocio === null &&
      this.idTipoSolicitud === null &&
      this.estado === null &&
      this.fechaDesde === null &&
      this.fechaHasta === null;

    const allUndefinedOrNull =
      this.isUndefinedOrNull(this.idEmpresa) &&
      this.isUndefinedOrNull(this.idUnidadNegocio) &&
      this.isUndefinedOrNull(this.idTipoSolicitud) &&
      this.isUndefinedOrNull(this.estado) &&
      this.isUndefinedOrNull(this.fechaDesde) &&
      this.isUndefinedOrNull(this.fechaHasta);

    const atLeastOneUndefinedOrNull =
      this.isUndefinedOrNull(this.idEmpresa) ||
      this.isUndefinedOrNull(this.idUnidadNegocio) ||
      this.isUndefinedOrNull(this.idTipoSolicitud) ||
      this.isUndefinedOrNull(this.estado) ||
      this.isUndefinedOrNull(this.fechaDesde) ||
      this.isUndefinedOrNull(this.fechaHasta);

    if (allUndefined) {
      // return "Toda mi data sin filtrar";
      return "case1";
    } else if (allNull) {
      // return "Toda mi data sin filtrar";
      return "case2";
    } else if (allUndefinedOrNull) {
      // return "Toda mi data sin filtrar";
      return "case3";
    } else if (atLeastOneUndefinedOrNull) {
      console.log("CASE (atLeastOneUndefinedOrNull)");
      return "case4";
      // return "Mostrar un error";
    } else {
      return "case5";
      // return "Continuar con el filtrado";
    }
  }
}
