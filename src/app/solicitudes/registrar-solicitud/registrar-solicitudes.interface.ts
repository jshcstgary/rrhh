export interface ITareasResponse {
  totalRegistros: number;
  tareaType: TareaType[];
}

export interface TareaType {
  id: string;
  procInstId: string;
  name: string;
  taskDefKey: string;
  procDefKey: string;
  procDefId: string;
  rootProcInstId: string;
  executionId: string;
  caseDefKey: string;
  caseDefId: string;
  caseInstId: string;
  caseExecutionId: string;
  actInstId: string;
  parentTaskId: string;
  description: string;
  owner: string;
  assignee: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  deleteReason: string;
  priority: number;
  dueDate: Date;
  flowUpDate: Date;
  tenantId: string;
  removalTime: Date;
}

export interface IAprobacionesPosicion {
  totalRegistros: number;
  nivelAprobacionPosicionType: any[];
}
