export class RevisarData {

  // Input data elements to submit as part of
  // 'RevisarData' task step in BPMN process.
  // See task def id in environment.ts file

  constructor(
    // Review action - approve or no
    public reviewAction       : string = '',

    // Observations / notes
    public reviewObservations       : String
  ) {  }

}
