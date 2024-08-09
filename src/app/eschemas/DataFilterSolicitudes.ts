export class DataFilterSolicitudes {
  constructor(
    // public idEmpresa?: string,
    // public idUnidadNegocio?: string,
    public empresa?: string,
    public unidadNegocio?: string,
    public idTipoSolicitud?: number,
    public estado?: string,
    public fechaDesde?: any,
    public fechaHasta?: any,
    public idSolicitud?: string
  ) { }

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  isUndefinedOrNull(value: any): boolean {
    return value === undefined || value === null;
  }

  verifyFilterFields() {
    const allUndefined =
      this.isUndefined(this.empresa) &&
      this.isUndefined(this.unidadNegocio) &&
      this.isUndefined(this.idTipoSolicitud) &&
      this.isUndefined(this.estado) &&
      this.isUndefined(this.fechaDesde) &&
      this.isUndefined(this.fechaHasta);

    const allNull =
      this.empresa === null &&
      this.unidadNegocio === null &&
      this.idTipoSolicitud === null &&
      this.estado === null &&
      this.fechaDesde === null &&
      this.fechaHasta === null;

    const allUndefinedOrNull =
      this.isUndefinedOrNull(this.empresa) &&
      this.isUndefinedOrNull(this.unidadNegocio) &&
      this.isUndefinedOrNull(this.idTipoSolicitud) &&
      this.isUndefinedOrNull(this.estado) &&
      this.isUndefinedOrNull(this.fechaDesde) &&
      this.isUndefinedOrNull(this.fechaHasta);

    const atLeastOneUndefinedOrNull =
      this.isUndefinedOrNull(this.empresa) ||
      this.isUndefinedOrNull(this.unidadNegocio) ||
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
      return "case4";
      // return "Mostrar un error";
    } else {
      return "case5";
      // return "Continuar con el filtrado";
    }
  }
}
