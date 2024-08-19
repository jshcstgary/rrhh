export interface IInputComponent {
	id: string;
	label?: string;
	labelPosition?: labelPositionType;
	type: InputComponentType;
	placeholder?: string;
	buttonIcon?: string;
	buttonFunction?: string;
	onEnterFunction?: string;
	onChangeFunction?: string;
	contexto?: any;
	defaultValue?: any;
	required?: boolean;
	maxLength?: number;
	inputMessageError?: string;
	disabled?: boolean;
	options?: ISelectOptions;
	allowedKeys?: allowedKeysType;
	restrictionType?: "code" | "text";
}

export interface ISelectOption {
	label: string;
	value: string;
}

export type ISelectOptions = ISelectOption[];

export type InputComponentType =
	| "string"
	| "number"
	| "color"
	| "select"
	| "toggle"
	| "money"
	| "checkbox"
	| "date"
	| "year"
	| "time"
	| "visualization";

export type IInputsComponent = IInputComponent[];

export type labelPositionType = "vertical" | "horizontal";

export type allowedKeyType =
	| "alphanumeric"
	| "special character"
	| "notzero"
	| 'isAllowedDescription'
	| "space";

export type allowedKeysType = allowedKeyType[];
