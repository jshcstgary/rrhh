import { DatosInstanciaProceso } from "./DatosInstanciaProceso";

export class DatosSolicitud {
  constructor(
    public tipo_solicitud: string = "",
    public tipo_motivo: string = "",
    public tipo_accion: string = ""
  ) // instanceCreated: DatosInstanciaProceso
  {}
}
