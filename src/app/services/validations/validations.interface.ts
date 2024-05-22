export interface IValidation<T> {
  propiedad: keyof T;
  validations: validationsType;
}

type validationType = "isString" | "isNumber" | "isNotEmpty";

type validationsType = validationType[];

export type IValidations<T> = IValidation<T>[];
