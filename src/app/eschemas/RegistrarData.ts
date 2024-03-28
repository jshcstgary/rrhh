export class RegistrarData {

  // Input data elements to submit as part of
  // 'Registrar' task step in BPMN process.
  // See task def id in environment.ts file

  constructor(
    // code
    public codigo            : string = '',
    // description
    public description       : string = '',
    // amount
    public importe           : number = 0,
    // Observations / notes
    public observations       : String = new String()
  ) {  }

}
