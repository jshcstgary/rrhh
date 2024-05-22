export class Task {

  constructor(
    public id: string,
    public name: string,
    public key: string,
    public priority :  number,
    public taskDefinitionKey: string,
    public created  :  Date
  )  {}
}
