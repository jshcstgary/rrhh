export interface IDropdownComponent {
  options: IDropdownOptions;
  textButton: string;
  iconButton: string;
  buttonClasses: string[];
  optionClasses: string[];
  onDropDownClickFunction: string;
}

export interface IDropdownOption {
  id: string;
  name: string;
  icon?: string;
}
export type IDropdownOptions = IDropdownOption[];
