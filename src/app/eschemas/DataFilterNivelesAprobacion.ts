export class DataFilterNivelesAprobacion {
  constructor(
    public tipoMotivo?: number,
    public tipoSolicitud?: number,
    public nivelDireccion?: number
  ) {}

  isUndefined(value: any): boolean {
    return typeof value === "undefined";
  }

  verifyFilterFields() {
    const allUndefined =
      this.isUndefined(this.tipoMotivo) &&
      this.isUndefined(this.tipoSolicitud) &&
      this.isUndefined(this.nivelDireccion);
    if (allUndefined) {
      return true;
    }
    return false;
  }
}
