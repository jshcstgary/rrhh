import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { IFormItems, ISearchButtonForm } from "./form.interface";
import { FormService } from "./form.service";
import { InputComponentType } from "../input/input.interface";

@Component({
  selector: "form-component",
  templateUrl: "./form.component.html",
})
export class FormComponent implements OnInit, OnChanges {
  @Input({ required: true }) public formItems: IFormItems;
  @Input({ required: false }) public formName: string = "";
  @Input() public contexto: any;
  @Input() public containsSearchButton: boolean = false;
  @Input() public searchButtonProps: ISearchButtonForm;
  @Input() public onChangeFormFunction: string;

  private formValue: any = {};

  constructor(private formService: FormService) {}

  public ngOnInit(): void {
    this.setInitFormValue();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    this.setInitFormValue();
  }
  /**
   * Funcion para almacenar los valores dentro del formulario
   *
   * @param value valor del input
   * @param key identificador del input
   */
  private onChangeForm(value: any, key: string) {
    const newFormValue = { ...this.formValue, [key]: value };
    this.formValue = newFormValue;
    this.formService.onChangeForm(this.formName, this.formValue);
    if (this.contexto && this.onChangeFormFunction) {
      this.contexto[this.onChangeFormFunction](newFormValue);
    }
  }
  /**
   * Función para generar los valores iniciales del formulario
   */
  private setInitFormValue() {
    let initFormValue = {};
    this.formItems?.forEach((element) => {
      const defaultValue =
        element.defaultValue ?? this.validateTypeDefaultValue(element.type);
      initFormValue = { ...initFormValue, [element.id]: defaultValue };
    });
    this.formValue = initFormValue;
    this.formService.onChangeForm(this.formName, initFormValue);
  }
  /**
   * Función para generar valores por defectos en caso de obtenerlos indefinido
   * @param type
   * @returns
   */
  private validateTypeDefaultValue(type: InputComponentType): any {
    let defaultValue: any;
    switch (type) {
      case "string":
      case "number":
      case "select":
      case "money":
      case "color":
        defaultValue = "";
        break;
      case "toggle":
      case "checkbox":
        defaultValue = false;
        break;
      default:
        break;
    }
    return defaultValue;
  }
  public onSearchButton() {
    if (this.containsSearchButton && this.searchButtonProps.functionName) {
      this.contexto[this.searchButtonProps.functionName](this.formValue);
    }
  }
}
