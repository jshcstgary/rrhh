export class RevisarData {
  // Input data elements to submit as part of
  // 'RevisarData' task step in BPMN process.
  // See task def id in environment.ts file

  constructor(
    // Review action - approve or no
    public comentariosAtencion: string = "",

    // Observations / notes
    public atencionRevision: String
  ) {}
}
