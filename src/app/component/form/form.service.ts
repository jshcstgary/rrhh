import { Injectable } from "@angular/core";
import { IInputComponent, ISelectOptions } from "../input/input.interface";
import { InputService } from "../input/input.service";
import { IFormItems } from "./form.interface";

@Injectable({
  providedIn: "root",
})
export class FormService {
  public formValue: any = {};

  constructor(private inputService: InputService) {}

  /**
   * Función para guardar los valores de los formularios activos de manera global
   *
   * @param formName nombre del formulario
   * @param formUpdated valor del formulario actualizado
   */
  public onChangeForm(formName: string, formUpdated: any) {
    this.formValue = {
      ...this.formValue,
      [formName]: formUpdated,
    };
  }
  /**
   * Cambia el valor de una propiedad específica de un elemento en un formulario.
   *
   * @param {string} id - Identificador único del elemento en el formulario.
   * @param {IFormItems} form - Arreglo de elementos del formulario (tipo IFormItems).
   * @param {keyof IInputComponent} propName - Nombre de la propiedad a cambiar en el elemento.
   * @param {any} value - Nuevo valor que se asignará a la propiedad especificada.
   * @returns {IFormItems} - Formulario actualizado después de realizar el cambio.
   */
  public changeValuePropFormById<T>(
    id: keyof T,
    form: IFormItems,
    propName: keyof IInputComponent,
    value: any
  ): IFormItems {
    const propIndex = form.findIndex((x) => x.id === id);
	form[propIndex] = { ...form[propIndex], [propName]: value };
    return form;
  }
  /**
   * Cambia el valor de una o varias propiedades específicas de un elemento en un formulario.
   *
   * @param {string} id - Identificador único del elemento en el formulario.
   * @param {IFormItems} form - Arreglo de elementos del formulario (tipo IFormItems).
   * @param {Partial<IInputComponent>} newProps - Objeto que contiene las nuevas propiedades y valores a asignar al elemento.
   * @returns {IFormItems} - Formulario actualizado después de realizar el cambio.
   */
  public changeValuePropsFormById(
    id: string,
    form: IFormItems,
    newProps: Partial<IInputComponent>
  ): IFormItems {
    const propIndex = form.findIndex((x) => x.id === id);
    form[propIndex] = { ...form[propIndex], ...newProps };
    return form;
  }
  /**
   * Función para generar las opciones de un select de formulario y aplicarla al fomulario
   *
   * @param dataToFormat data a la cual se usará para generar las opciones del select
   * @param label nombre de la propiedad la cual se tomará para mostrara en la opcion
   * @param value nombre de la propiedad la cual se tomará para asignar el valor en la opcion
   * @param formSelectName nombre de lapropiedad del select al que se le añadiran las opciones
   * @param form formulario al que se le añadiran las opciones
   * @returns formulario actualizado
   */
  public formatOptionsAndSetOnFormSelect<T>(
    dataToFormat: T[],
    label: keyof T,
    value: keyof T,
    formSelectName: string,
    form: IFormItems,
    formatOptionType: number = 1
  ): IFormItems {
    let options: ISelectOptions;
    switch (formatOptionType) {
      case 1:
        options = this.inputService.formatDataToOptions(
          dataToFormat,
          label,
          value
        );
        break;
      case 2:
        options = this.inputService.formatDataToOptionsValueInLabel(
          dataToFormat,
          label,
          value
        );
        break;

      default:
        break;
    }

    const newForm = this.changeValuePropFormById(
      formSelectName,
      form,
      "options",
      options
    );
    return newForm;
  }
  /**
   * Función para ejecutar el onBlur del formulario para qeu aparezcan los mensajes de error
   *
   * @param form formulario a recorrer
   */
  public executeOnBlurRequiredItems(form: IFormItems) {
    form
      .filter((formItem) => formItem.required)
      .forEach((formItem) => {
        if (formItem.type === "select") {
          var selectElement = document
            .getElementById(formItem.id)
            .firstElementChild.firstElementChild.lastElementChild.getElementsByTagName(
              "input"
            );
          if (selectElement.item(0)) {
            selectElement.item(0).focus();
          }
        } else {
          const formElement = document.getElementById(formItem.id);
          formElement.focus();
          formElement.blur();
        }
      });
  }
}
