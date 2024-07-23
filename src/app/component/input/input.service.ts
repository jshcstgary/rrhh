import { Injectable } from "@angular/core";
import { ISelectOptions } from "./input.interface";

@Injectable({
  providedIn: "root",
})
export class InputService {
  /**
   * Convierte un array de objetos en un array de opciones de selección.
   * @param data El array de objetos a convertir.
   * @param labelName El nombre de la propiedad en cada objeto para usar como etiqueta.
   * @param valueName El nombre de la propiedad en cada objeto para usar como valor.
   * @returns Un array de opciones de selección con etiquetas y valores extraídos de los objetos de entrada.
   */
  public formatDataToOptions<T>(
    data: T[],
    labelName: keyof T,
    valueName: keyof T
  ): ISelectOptions {
    return data.map((x) => ({
      label: x.hasOwnProperty(labelName) ? String(x[labelName]) : "",
      value: x.hasOwnProperty(valueName) ? String(x[valueName]) : "",
    }));
  }
  /**
   * Convierte un array de objetos en un array de opciones de selección.
   * @param data El array de objetos a convertir.
   * @param labelName El nombre de la propiedad en cada objeto para usar como etiqueta junto a su value.
   * @param valueName El nombre de la propiedad en cada objeto para usar como valor.
   * @returns Un array de opciones de selección con etiquetas y valores extraídos de los objetos de entrada.
   */
  public formatDataToOptionsValueInLabel<T>(
    data: T[],
    labelName: keyof T,
    valueName: keyof T
  ): ISelectOptions {
	  return data.map((x) => ({
			  label: x.hasOwnProperty(labelName)
				  ? String(`${String(x[valueName])} - ${String(x[labelName])}`)
				  : "",
			  value: x.hasOwnProperty(valueName) ? String(x[valueName]) : "",
		  }));
  }
  /**
   * Convierte un array de objetos en un array de opciones de selección.
   * @param data El array de objetos a convertir.
   * @param labelName El nombre de la propiedad en cada objeto para usar como etiqueta.
   * @param valueNames Un array de nombres de propiedades en cada objeto para usar como partes del valor, separadas por guiones.
   * @returns Un array de opciones de selección con etiquetas y valores extraídos de los objetos de entrada.
   */
  public formatDataToOptionsSomeValues<T>(
    data: T[],
    labelName: keyof T,
    valueNames: (keyof T)[]
  ): ISelectOptions {
    return data.map((x) => ({
      label: x.hasOwnProperty(labelName) ? String(x[labelName]) : "",
      value: valueNames
        .map((name) => (x.hasOwnProperty(name) ? String(x[name]) : ""))
        .join("-"),
    }));
  }
  public isAlphanumeric(text: string): boolean {
    return /^[0-9a-zA-Z]+$/.test(text);
  }
  // validador para todas las descripciones
  public isAllowedDescription(text: string): boolean {
    return /^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s:;.,()\-_]+$/.test(text);
  }
  public isNotFirstZero(text: string): boolean {
    return /^(?!0\d)\d+$/.test(text);
  }
  public isSpaceBetween(text: string): boolean {
    return /^[0-9a-zA-Z.,@ñÑ:;()-_]*$/.test(text);
  }
  public isNumeric(text: string): boolean {
    return /^\d+$/.test(text);
  }
  public isMoney(text: string): boolean {
    return /^[\d.,]+$/.test(text);
  }
  public isSpecialCharacter(text: string): boolean {
    return /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(text);
  }
  public isMathematicalOperator(text: string): boolean {
    return /^[+\-*/%=]$/.test(text);
  }
  public isPunctuationCharacter(text: string): boolean {
    return /^[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]$/.test(text);
  }
  public isFormatCharacter(text: string): boolean {
    return /^[\s\u00A0]*$/.test(text);
  }
  public defaultKey(text: string): boolean {
    return /^(Backspace|Arrow(Up|Down|Left|Right)|Shift|Tab)$/.test(text);
  }
  public hasSqlInjection(text: string): boolean {
    return /['";`<>%&|#[\]!¡¿?{}^]/.test(text);
  }
  public formatStringToDecimal(numero: string, decimales: number = 3): string {
    let numberToTransform: string = numero === "" ? "0.00" : numero;
    /* Elimino el punto */
    numberToTransform = numberToTransform.replace(/\./g, "");
    return (parseFloat(numberToTransform) / Math.pow(10, decimales)).toFixed(
      decimales
    );
  }
}
