export interface IColumnTable {
  title?: string;
  dataIndex?: string;
  dataIndexesToJoin?: string[];
  align?: alignColType;
  actions?: IActionsTable;
  type?: tableColType;
  sortActive?: boolean;
  sortTypeOrder?: sortColOrderType;
  colType?: colTypeTable;
  width?: string;
  isEditingRow?: boolean
}
export interface ISelectOptionsTable {
  type: selectOptionType;
  dataSelected?: string[];
}
export interface IRowTableAttributes {
  traaissor?: string;
  key?: string;
  isEditingRow?: boolean;
}
interface IActionTable {
  icon?: string;
  materialIcon?: string;
  tooltip?: string;
  id: idActionType;
}

type alignColType = "center";
type tableColType = "actions" | "checkbox" | "color" | "bool";
type selectOptionType = "checkbox";

export type sortColOrderType = "asc" | "desc";
export type colTypeTable = "string" | "number";
export type idActionType =
  | "editOnTable"
  | "cloneOnTable"
  | "delete"
  | "redirect";

export type IActionsTable = IActionTable[];

export type IColumnsTable = IColumnTable[];
