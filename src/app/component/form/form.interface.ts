import { IInputComponent } from "../input/input.interface";

export interface IFormItem extends IInputComponent {
  colWidth?: colWidthType;
}

export interface ISearchButtonForm {
  colWidth?: colWidthType;
  functionName?: string;
  offsetWidth?: colWidthType;
}


export enum PageFormType {
  CREAR = "CREAR",
  MODIFICAR = "MODIFICAR",
  CLONAR = "CLONAR",
  VISUALIZAR = "VISUALIZAR",
}

export type IFormItems = IFormItem[];

type colWidthType =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";
