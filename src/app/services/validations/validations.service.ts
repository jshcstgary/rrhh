import { Injectable } from "@angular/core";
import { IValidations } from "./validations.interface";

@Injectable({
  providedIn: "root",
})
export class ValidationsService {
  public isNotEmptyStringVariable(variable: string): boolean {
    return variable !== null && variable !== undefined && /\S/.test(variable);
  }
  public isStringVariable(variable: string): boolean {
    return typeof variable === "string";
  }
  public isNumberVariable(variable: string): boolean {
    return /^-?\d*\.?\d+$/.test(variable);
  }
  public validateObject<T>(
    object: any,
    validations: IValidations<T>
  ): { isValid: boolean; message: string } {
    let errorMessage: string = "";

    const isValid = validations.every((prop) => {
      return prop.validations.every((validation) => {
        let isValid: boolean;

        const objeto = object[prop.propiedad];
        const propName = String(prop.propiedad);
        switch (validation) {
          case "isString":
            isValid = this.isStringVariable(objeto);
            errorMessage = `El campo "${propName}" solo acepta letras`;
            break;
          case "isNumber":
            isValid = this.isNumberVariable(objeto);
            errorMessage = `El campo "propName}" solo acepta números`;
            break;
          case "isNotEmpty":
            isValid = this.isNotEmptyStringVariable(objeto);
            errorMessage = `El campo "${propName}" no puede estar vacío `;
            break;
          default:
            isValid = false;
            errorMessage = "No existe configuración para el dato indicado";
            break;
        }
        return isValid;
      });
    });
    return {
      isValid: isValid,
      message: isValid ? "ok" : errorMessage,
    };
  }
}
