import { Component, Input, OnInit } from "@angular/core";
import {
  ISelectOption,
  ISelectOptions,
  InputComponentType,
  allowedKeysType,
  labelPositionType,
} from "./input.interface";
import { InputService } from "./input.service";
@Component({
  selector: "input-component",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
})
export class InputComponent implements OnInit {
  @Input() public id: string;
  @Input() public label: string = null;
  @Input() public labelPosition: labelPositionType = "vertical";
  @Input() public type: InputComponentType = "string";
  @Input() public placeholder: string = "";
  @Input() public buttonIcon: string = null;
  @Input() public buttonFunction: string = null;
  @Input() public onEnterFunction: string = null;
  @Input() public onChangeFunction: string = null;
  @Input() public contexto: any;
  @Input() public defaultValue: any;
  @Input() public required: boolean = false;
  @Input() public maxLength: number;
  @Input() public inputMessageError: string = "";
  @Input() public disabled: boolean = false;
  @Input() public options: ISelectOptions = [];
  @Input() public allowedKeys: allowedKeysType = [];
  @Input() public decimals: number = 2;

  @Input() public theValue: string = ""; 

  public containsButton: boolean = false;
  public containsLabel: boolean = false;
  public value: any = null;
  public InputHasAnError: boolean = false;
  public selectValue: any;
  public color: string = "#d7dfe3";
  constructor(private inputService: InputService) {}

  public ngOnInit(): void {
    this.validateContainsButton();
    this.validateContainsLabel();
    if (
      this.defaultValue === undefined ||
      this.defaultValue === null ||
      ["toggle", "select"].includes(this.type)
    ) {
      this.setDefaultValue();
    }
    if (this.placeholder === undefined || this.placeholder === null) {
      this.setDefaultPlaceHolder();
    }
  }
  /**
   * Función para validar si el input contiene un boton
   */
  private validateContainsButton() {
    if (this.buttonIcon !== null && this.buttonFunction !== null) {
      this.containsButton = true;
    }
  }
  /**
   * Función para validar si el input contiene un label
   */
  private validateContainsLabel() {
    this.containsLabel =
      this.label !== null &&
      this.label !== undefined &&
      this.label.trim() !== "";
  }
  /**
   * Función para guardar el valor del input
   *
   * @param valueInput
   */
  public onChangeInput(valueInput: any) {
    let value: string | boolean;
    switch (this.type) {
      case "number":
        {
          const inputTarget = (valueInput as Event).target as HTMLInputElement;
          const valueNumber = inputTarget.value;
          /* Elimino el cero al inicio */
          if (valueNumber.startsWith("0")) {
            inputTarget.value = valueNumber.substring(1);
          }
          value = valueNumber;
          /* Valido si es requerido o no para aplicarle los estilos */
          this.InputHasAnError = this.required && value === "";
        }
        break;
      case "string":
        {
          const inputEvent: Event = valueInput;
          const inputTarget = inputEvent.target as HTMLInputElement;
          value = inputTarget.value;
          /* Valido si es requerido o no para aplicarle los estilos */
          this.InputHasAnError = this.required && value === "";
        }
        break;
      case "money":
        {
          const inputTarget = (valueInput as Event).target as HTMLInputElement;
          const valueNumber = inputTarget.value;
          /* Doy formato numerico */
          const numeroFormateado = this.inputService.formatStringToDecimal(
            valueNumber,
            this.decimals
          );
          inputTarget.value = numeroFormateado;
          value = numeroFormateado;
          /* Valido si es requerido o no para aplicarle los estilos */
          this.InputHasAnError = this.required && value === "";
        }
        break;
      case "color":
        {
          value = valueInput;
          this.color = valueInput;
          this.defaultValue = this.color;
        }
        break;
      case "time":
        {
          const inputTime: Event = valueInput;
          const inputCheckTarget = inputTime.target as HTMLInputElement;
          value = inputCheckTarget.value;
        }
        break;
      case "select":
        {
          const elementSelected: ISelectOption = valueInput;
          value = elementSelected?.value;
          this.InputHasAnError =
            this.required && [null, undefined].includes(this.selectValue);
        }
        break;
      case "toggle":
      case "checkbox":
        {
          const inputCheckEvent: Event = valueInput;
          const inputCheckTarget = inputCheckEvent.target as HTMLInputElement;
          value = inputCheckTarget.checked;
        }
        break;
      default:
        break;
    }
    this.value = value;
    if (this.onChangeFunction !== null) {
      this.contexto[this.onChangeFunction](value, this.id);
    }
  }
  /**
   * Función para retornar el valor de nuestro input al dar click en el botón
   */
  public onClickButton() {
    this.contexto[this.buttonFunction](this.value, this.id);
  }
  /**
   * Función para cuando presione enter retornara el valor
   */
  public onEnterKey() {
    if (this.onEnterFunction !== null) {
      this.contexto[this.onEnterFunction](this.value, this.id);
    }
  }
  /**
   * Función para validar en caso no se defina el valor por defecto
   */
  private setDefaultValue() {
    if (this.type === "toggle") {
      this.defaultValue =
        this.defaultValue?.toString() === "1" || this.defaultValue === true;
    } else if (this.type === "select") {
      this.selectValue = this.options?.find(
        (x) => x.value === this.defaultValue?.toString()
      );
    } else {
      this.defaultValue = "";
    }
  }
  /**
   * Función para validar en caso no se defina el placeholder por defecto
   */
  private setDefaultPlaceHolder() {
    if (this.type === "money") {
      this.placeholder = "0.00";
    } else {
      this.placeholder = "";
    }
  }
  /**
   * Función para validar en caso el input sea requerido y no haya ingresado informacion
   *
   * @param valueInput
   */
  public onBlurInput(valueInput: any) {
    switch (this.type) {
      case "string":
        {
          const inputEvent: Event = valueInput;
          const inputTarget = inputEvent.target as HTMLInputElement;
          const value = inputTarget.value;
          /* Valido si es requerido o no para aplicarle los estilos */
          this.InputHasAnError = this.required && value === "";
        }
        break;
      case "number":
        {
          const inputNumberEvent: Event = valueInput;
          const inputNumberTarget = inputNumberEvent.target as HTMLInputElement;
          const valueNumber = inputNumberTarget.value;
          /* Valido si es requerido o no para aplicarle los estilos */
          this.InputHasAnError = this.required && valueNumber === "";
        }
        break;
      case "money":
        {
          const inputMoneyEvent: Event = valueInput;
          const inputMoneyTarget = inputMoneyEvent.target as HTMLInputElement;
          const valueMoney = inputMoneyTarget.value;
          /* Valido si es requerido o no para aplicarle los estilos */
          this.InputHasAnError = this.required && valueMoney === "";
        }
        break;

      case "time":
        {
          const inputEvent: Event = valueInput;
          const inputTarget = inputEvent.target as HTMLInputElement;
          const value = inputTarget.value;
          this.InputHasAnError = this.required && value === "";
        }
        break;
      case "select":
        {
          this.InputHasAnError =
            this.required && [null, undefined].includes(this.selectValue);
        }
        break;

      default:
        break;
    }
  }
  public keypress(event: KeyboardEvent) {
    let preventPress = false;
    const inputKey = event.key;
    const inputValue = (event.target as HTMLInputElement).value;
    /* Validaciones por tipo de input*/
    const leadingZero = inputValue.length === 0 && event.key === "0";
    if (!preventPress && ["number", "year"].includes(this.type)) {
      preventPress = !this.inputService.isNumeric(inputKey) || leadingZero;
    }
    if (!preventPress && this.type === "money") {
      preventPress = !this.inputService.isMoney(inputKey) || leadingZero;
    }
    /* Validaciones adicionales */
    if (!preventPress && this.allowedKeys?.length > 0) {
      const isAlphanumeric = this.inputService.isAlphanumeric(inputKey);
      const isSpaceBetween = this.inputService.isSpaceBetween(inputKey);
      const isNotFirstZero = this.inputService.isNotFirstZero(inputKey);
      const isSpecialCharacter = this.inputService.isSpecialCharacter(inputKey);
      const isAllowedDescription =
        this.inputService.isAllowedDescription(inputKey);
      preventPress =
        (this.allowedKeys.includes("alphanumeric") && !isAlphanumeric) ||
        (this.allowedKeys.includes("space") && !isSpaceBetween) ||
        (this.allowedKeys.includes("notzero") && !isNotFirstZero) ||
        (this.allowedKeys.includes("isAllowedDescription") &&
          !isAllowedDescription) ||
        (this.allowedKeys.includes("special character") && !isSpecialCharacter);
    }
    if (preventPress) {
      event.preventDefault();
    }
  }
}
