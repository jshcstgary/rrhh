export class DatosInstanciaProceso{

  constructor(
    public businessKey : string,
    public definitionId : string,
    public id : string,
    public tenantId : string =''
  ){}
}
