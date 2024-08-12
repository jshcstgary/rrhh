export class DataFilterNivelesAprobacion {
  constructor(
    public tipoMotivo?: number,
    public tipoSolicitud?: number,
    public nivelDireccion?: number,
    public tipoRuta?: number,
    public tipoAccion?: number
  ) {}

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  isUndefinedOrNull(value: any): boolean {
    return value === undefined || value === null;
  }

  verifyFilterFields() {
    const allUndefined = this.isUndefined(this.tipoMotivo) && this.isUndefined(this.tipoSolicitud) && this.isUndefined(this.nivelDireccion);

    const allNull = this.tipoMotivo === null && this.tipoSolicitud === null && this.nivelDireccion === null;

    const atLeastOneUndefinedOrNull = this.isUndefinedOrNull(this.tipoMotivo) || this.isUndefinedOrNull(this.tipoSolicitud) || this.isUndefinedOrNull(this.nivelDireccion);

    const atLeastOneUndefinedOrNulltipoSolicitud = this.isUndefinedOrNull(this.tipoSolicitud);

    const atLeastOneUndefinedOrNulltipoMotivo = this.isUndefinedOrNull(this.tipoMotivo);

    const atLeastOneUndefinedOrNullnivelDireccion = this.isUndefinedOrNull(this.nivelDireccion);

    if (allUndefined) {
      // return "Toda mi data sin filtrar";
      return "case1";
    } else if (allNull) {
      // return "Toda mi data sin filtrar";
      return "case2";
    } else if (atLeastOneUndefinedOrNull) {
      if (atLeastOneUndefinedOrNulltipoSolicitud) {
        return "case3";
      }

      if (atLeastOneUndefinedOrNulltipoMotivo) {
        this.tipoMotivo = 10000;
      }

      if (atLeastOneUndefinedOrNullnivelDireccion) {
        this.nivelDireccion = 10000;
      }

      return "case4";
      // return "Mostrar un error";
    } else {
      return "case4";
      // return "Continuar con el filtrado";
    }
  }
}
