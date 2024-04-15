export class DataFilterNivelesAprobacion {
  constructor(
    public tipoMotivo?: number,
    public tipoSolicitud?: number,
    public nivelDireccion?: number
  ) {}

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  isUndefinedOrNull(value: any): boolean {
    return value === undefined || value === null;
  }

  verifyFilterFields() {
    const allUndefined =
      this.isUndefined(this.tipoMotivo) &&
      this.isUndefined(this.tipoSolicitud) &&
      this.isUndefined(this.nivelDireccion);
    const allNull =
      this.tipoMotivo === null &&
      this.tipoSolicitud === null &&
      this.nivelDireccion === null;

    const atLeastOneUndefinedOrNull =
      this.isUndefinedOrNull(this.tipoMotivo) ||
      this.isUndefinedOrNull(this.tipoSolicitud) ||
      this.isUndefinedOrNull(this.nivelDireccion);

    if (allUndefined) {
      // return "Toda mi data sin filtrar";
      return "case1";
    } else if (allNull) {
      // return "Toda mi data sin filtrar";
      return "case2";
    } else if (atLeastOneUndefinedOrNull) {
      return "case3";
      // return "Mostrar un error";
    } else {
      return "case4";
      // return "Continuar con el filtrado";
    }
  }
}
