import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges
} from "@angular/core";
import { UtilService } from "src/app/services/util/util.service";
import { IInputsComponent } from "../input/input.interface";
import { TableComponentData } from "./table.data";
import {
	IColumnTable,
	IColumnsTable,
	ISelectOptionsTable,
	colTypeTable,
	sortColOrderType,
} from "./table.interface";
import { TableService } from "./table.service";
@Component({
	selector: "table-component",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit, OnChanges {
	@Input({
		required: false
	})
	public overflowX: string = "visible";

	@Input({
		required: false
	})
	public fixedLastColumn: boolean = false;

	@Input({
		required: false
	})
	public fixedFirstColumn: boolean = false;

	@Input({ required: false }) public allowCloneButton: boolean = false;
	@Input({ required: false }) public tableName: string;
	@Input({ required: false }) public onChangeEditRowFunction: string;
	@Input() public contexto: any;
	@Input() public columns: IColumnsTable = [];
	@Input() public dataTable: any[] = [];
	@Input() public selectOptionsTable: ISelectOptionsTable = null;
	@Input() public onSaveRowTable: string;
	@Input() public onRowChange: string;
	@Input() public onCancelEditRowTable: string;
	@Input() public onShortCol: string = "onSortColTable";
	@Input() public tableWidth: string = "100%";
	@Input() public inputsEditRow: IInputsComponent;
	@Input() public totalRows: number = 0;
	@Input() public onChangePagination: string;
	@Input() public onCheck: string;
	@Input() public clickOnActionRow: string;
	@Input({ required: false }) public isTarea: boolean = false;
	@Input() public rowsPerPageValue: number = TableComponentData.defaultRowPerPage;
	@Input() public page: number = 1;
	public showActionColumn: boolean = true;
	public isTableEmpty: boolean = false;
	public data: any[] = [];
	private rowDataModified: any = {};
	/* Select Options */
	public isIndeterminateHeaderInput: boolean = false;
	public isChekedHeaderInput: boolean = false;
	public rowsChecked: string[] = [];
	/* Sort */
	private sortColActive: IColumnTable;
	private sortIndexColActive: number;
	/* Pagination */
	public rowsPerPageOptions: number[] = TableComponentData.rowsPerPage;

	public isSticky: boolean = false;

	// private observer: IntersectionObserver | null = null;
	// private isObserverInitialized = false

	// @ViewChild("observed-element") observedElement!: ElementRef | null;

	constructor(public tableService: TableService, public utilService: UtilService) { }

	public ngOnInit(): void {
		this.ValidateInitDataTable();
		this.tableService.onCheckTable(this.tableName, []);
		this.showActionColumn = this.columns[this.columns.length - 1].actions.some(action => action.showed);
	}
	public ngOnChanges(changes: SimpleChanges): void {
		this.ValidateInitDataTable();
	}

	// ngAfterViewInit(): void {
	// 	const observer = new IntersectionObserver(
	// 		(entries) => {
	// 			entries.forEach(entry => {
	// 				if (entry.isIntersecting) {
	// 					console.log('El elemento ha llegado al top de la pantalla.');
	// 					// Aquí puedes ejecutar el código que necesitas
	// 				}
	// 			});
	// 		},
	// 		{
	// 			root: null, // Observa con respecto al viewport
	// 			threshold: 0, // 0 significa que se activará tan pronto como el elemento esté visible
	// 			rootMargin: '-100px 0px 0px 0px' // Ajusta este margen superior si necesitas que el evento se dispare antes de que el elemento alcance el top
	// 		}
	// 	);

	// 	observer.observe(this.observedElement.nativeElement);
	// }

	// ngAfterViewChecked(): void {
	// 	// Verifica si el thead está presente y si el observador no ha sido inicializado
	// 	console.log(this.observedElement);
	// 	console.log(this.dataTable);
	// 	console.log(!this.isObserverInitialized);
	// 	if (this.observedElement && this.dataTable.length > 0 && !this.isObserverInitialized) {
	// 		console.log("DATA");
	// 		this.isObserverInitialized = true; // Evita inicializarlo múltiples veces
	// 		this.initObserver();
	// 	}
	// }

	// initObserver() {
	// 	this.observer = new IntersectionObserver(
	// 		(entries) => {
	// 			entries.forEach(entry => {
	// 				if (entry.isIntersecting) {
	// 					console.log("El elemento ha llegado al top de la pantalla.");
	// 					// Aquí puedes ejecutar el código que necesitas
	// 				}
	// 			});
	// 		},
	// 		{
	// 			root: null, // Observa con respecto al viewport
	// 			threshold: 0, // 0 significa que se activará tan pronto como el elemento esté visible
	// 			rootMargin: "-200px 0px 0px 0px" // Ajusta este margen superior si necesitas que el evento se dispare antes de que el elemento alcance el top
	// 		}
	// 	);

	// 	this.observer.observe(this.observedElement!.nativeElement);
	// }

	// @HostListener("window:scroll", [])
	// onWindowScroll() {
	// 	const stickyOffset = 324; // 128px del tope de la pantalla
	// 	const scrollPosition = window.scrollY || document.documentElement.scrollTop;

	// 	// Verificar cuando el desplazamiento sea mayor a 128px
	// 	if (scrollPosition >= stickyOffset) {
	// 		this.isSticky = true;
	// 	} else {
	// 		this.isSticky = false;
	// 	}
	// }

	/**
	 * Función para ejecutar los procesos respectivos cuando se carga la informacion al inico o se actualiza la tabla
	 */
	private ValidateInitDataTable() {
		this.isTableEmpty = this.dataTable.length === 0;

		if (!this.isTableEmpty) {
			let data: any[] = this.dataTable;

			/* Valido si debe ordenarse la data o no */
			if (this.validateisSomeSortActive()) {
				this.formatSortByOne(this.sortIndexColActive);

				this.filterBySortColType(this.sortColActive.dataIndex, this.sortColActive.sortTypeOrder, this.sortColActive.colType);
			}

			/* Valido si tiene atributos de configuracion para la columna de checkbox */
			if (this.selectOptionsTable !== null) {
				this.cleanInputChecked();
				this.validateHeaderInputState();
			}

			this.validateIsEditableRowActive();
			this.data = data;
		}
	}
	/**
	 * Funciòn para filtrar la tabla
	 *
	 * @param i posiciòn de la columna
	 * @param colName nombre de la columna por la cual ordenar la data
	 */
	public onChangeShort(i: number, colName: string) {
		this.contexto[this.onShortCol](i, colName);
		if (this.validateisSomeSortActive()) {
			this.formatSortByOne(i);
		}
	}
	/**
	 * Funciòn para validar el tipo de columna y el tipo de dato
	 *
	 * @param dataToFilter
	 * @param colName
	 * @param sortColOrder
	 * @param sortColType
	 * @returns
	 */
	private filterBySortColType(
		colName: string,
		sortColOrder: sortColOrderType,
		sortColType: colTypeTable = "string"
	): any[] {
		const dataToFilter = this.dataTable;
		let dataFiltered: any[];
		switch (sortColType) {
			case "string":
				if (sortColOrder === "asc") {
					dataFiltered = this.onShortAscString(dataToFilter, colName);
				} else if (sortColOrder === "desc") {
					dataFiltered = this.onShortDescString(dataToFilter, colName);
				}
				break;
			case "number":
				if (sortColOrder === "asc") {
					dataFiltered = this.onShortAscNumber(dataToFilter, colName);
				} else if (sortColOrder === "desc") {
					dataFiltered = this.onShortDescNumber(dataToFilter, colName);
				}
				break;

			default:
				break;
		}
		return dataFiltered;
	}
	/**
	 * Funciòn para ordenar la data por columna de tipo numerico de forma ascendete
	 *
	 * @param array data de la tabla
	 * @param propiedad nombre de la columna
	 * @returns
	 */
	private onShortDescNumber(array: any[], propiedad: string) {
		return array.slice().sort((a, b) => a[propiedad] - b[propiedad]);
	}
	/**
	 * Funciòn para ordenar la data por columna de tipo numerico de forma descendente
	 *
	 * @param array data de la tabla
	 * @param propiedad nombre de la columna
	 * @returns
	 */
	private onShortAscNumber(array: any[], propiedad: string) {
		return array.slice().sort((a, b) => b[propiedad] - a[propiedad]);
	}
	/**
	 * Funciòn para ordenar la data por columna de tipo string de forma ascendete
	 *
	 * @param array data de la tabla
	 * @param propiedad nombre de la columna
	 * @returns
	 */
	private onShortDescString(array: any[], propiedad: string) {
		return array
			.slice()
			.sort((a, b) => a[propiedad].localeCompare(b[propiedad]));
	}
	/**
	 * Funciòn para ordenar la data por columna de tipo string de forma descendente
	 *
	 * @param array data de la tabla
	 * @param propiedad nombre de la columna
	 * @returns
	 */
	private onShortAscString(array: any[], propiedad: string) {
		return array
			.slice()
			.sort((a, b) => b[propiedad].localeCompare(a[propiedad]));
	}
	/**
	 * Función para validar si hay algun sort en otra columna, distinta a la actual, activa
	 *
	 * @returns retorna si esta activo o no
	 */
	private validateisSomeSortActive(): boolean {
		const someSortIsActive = this.columns.find(
			(x) => x.sortTypeOrder !== undefined
		);
		const validationSortIsActive = someSortIsActive !== undefined;
		if (validationSortIsActive) {
			this.sortColActive = someSortIsActive;
			this.sortIndexColActive = this.columns.findIndex(
				(x) => x.sortTypeOrder !== undefined
			);
		}
		return validationSortIsActive;
	}
	/**
	 * Función para desabilitar el filtro de sort de las colñumnas distintas a la que se pase por el parametro
	 *
	 * @param indexToSort la posicion de la columna que no se modificará
	 */
	private formatSortByOne(indexToSort: number) {
		this.columns.forEach((element, index) => {
			if (index !== indexToSort) {
				this.columns[index].sortTypeOrder = undefined;
			}
		});
	}
	/**
	 * Función para validar si la celda esta checkeada o no
	 *
	 * @param key identificador de la fila
	 * @returns valor si esta checkeado o no
	 */
	public getCheckCell(key: string): boolean {
		return this.rowsChecked.includes(key);
	}
	/**
	 * Función para guardar los valores que estan checkeados
	 *
	 * @param event evento del input
	 * @param key valor
	 */
	public onCheckCell(event: Event, key: string) {
		const checkValue = (event.target as HTMLInputElement).checked;

		if (checkValue && !this.rowsChecked.includes(key)) {
			this.rowsChecked.push(key);
		} else if (!checkValue) {
			this.rowsChecked = this.rowsChecked.filter((value) => value !== key);
		}

		this.tableService.onCheckTable(this.tableName, this.rowsChecked);

		if (this.onCheck !== undefined) {
			this.contexto[this.onCheck](this.rowsChecked);
		}

		this.validateHeaderInputState();
	}
	/**
	 * Función para eliminar duplicados y registros repetidos
	 */
	private cleanInputChecked() {
		/* elimino claves que no esten en la tabla */
		this.selectOptionsTable.dataSelected?.forEach((key) => {
			const existInTable = this.data.some((rowTable) => {
				return rowTable.key === key;
			});
			if (existInTable) {
				this.rowsChecked.push(key);
			}
		});
		/* Elimino dublicados */
		this.rowsChecked = [...new Set(this.rowsChecked)];
	}
	/**
	 * Valida si el input de checkbox del header esta indeterminado
	 *
	 * @returns si es o no indeterminado
	 */
	private validateIsIndeterminateHeaderInput(): boolean {
		const allInputCheckedAreInTable = this.rowsChecked.every((key) =>
			this.data.some((rowTable) => rowTable.key === key)
		);
		return (
			allInputCheckedAreInTable &&
			this.rowsChecked.length < this.data.length &&
			this.rowsChecked.length > 0
		);
	}
	/**
	 * Valida si el input de checkbox del header esta checkeado
	 *
	 * @returns si es o no checkeado
	 */
	private validateIsCheckedHeaderInput(): boolean {
		const allInputCheckedAreInTable = this.rowsChecked.every((key) =>
			this.data.some((rowTable) => rowTable.key === key)
		);
		return (
			allInputCheckedAreInTable && this.rowsChecked.length === this.data.length
		);
	}
	/**
	 * Función para validar el estado del checkobx de la cabecera
	 */
	private validateHeaderInputState() {
		this.isChekedHeaderInput = this.validateIsCheckedHeaderInput();
		this.isIndeterminateHeaderInput = this.validateIsIndeterminateHeaderInput();
	}
	/**
	 * Función para checkear todos o des-checkear los elementos de la tabla
	 */
	public onCheckHeaderCheckbox() {
		if (this.isChekedHeaderInput) {
			this.rowsChecked = [];
		} else {
			this.rowsChecked = this.data.map((x) => x.key);
		}
		this.tableService.onCheckTable(this.tableName, this.rowsChecked);
		if (this.onCheck !== undefined) {
			this.contexto[this.onCheck](this.rowsChecked);
		}
		this.validateHeaderInputState();
	}
	/**
	 * Función para almacenar los valores de modificacion de la tabla de manera temporal
	 *
	 * @param value valor del input
	 * @param key identificador del input
	 */
	public onChangeRowDataToModified(value: any, key: string) {
		this.rowDataModified = { ...this.rowDataModified, [key]: value };
		if (this.onChangeEditRowFunction) {
			this.contexto[this.onChangeEditRowFunction](this.rowDataModified);
		}
	}
	/**
	 * Función para guardar el valor modificado de la fila
	 */

	public onSaveRowDataToModified(finishedClonningRow: boolean = false) {
		this.inputsEditRow
			.filter((x) => x.required)
			.map((x) => x.id)
			.forEach((x) => {
				const element = document.getElementById(x);
				if (element) {
					element.focus();
					element.blur();
				}
			});
		this.contexto[this.onSaveRowTable](
			this.rowDataModified,
			finishedClonningRow
		);
	}

	/**
	 * Función para validar si hay algun registro que debe modificarse
	 *
	 * @returns
	 */
	private validateIsEditableRowActive(): boolean {
		const dataRowToEdit = this.dataTable.find((x) => x.isEditingRow === true);
		this.rowDataModified = dataRowToEdit;
		return dataRowToEdit;
	}
	/**
	 * Función para obtener la configuracion de atributos de cada input
	 *
	 * @param dataIndex identificador de cada columna
	 * @returns atributos para el input
	 */
	public getAttributesToInputCell(dataIndex: string): number {
		return this.inputsEditRow.findIndex((x) => x.id === dataIndex);
	}
	/**
	 * Función para ejecutar la Función al cambiar el numero de registros por pagina
	 *
	 * @param e Evento del input del select
	 */
	public onChangeRowsPerPage(e: Event) {
		const selectValue = parseInt((e.target as HTMLSelectElement).value);
		this.rowsPerPageValue = selectValue;
		this.contexto[this.onChangePagination](1, selectValue);
		this.page = 1;
	}
	/**
	 * Función para ejecutar la Función al cambiar la página
	 *
	 * @param page numero de la página
	 */
	public onChangePage(page: number) {
		this.contexto[this.onChangePagination](page, this.rowsPerPageValue);
	}
	/**
	 * Función para cancelar el modo de edición
	 */
	public onCancelRow() {
		this.tableService.changeStateIsAnyEditRowActive(false);
		this.contexto[this.onCancelEditRowTable]();
	}
	/**
	 * Función para ejecutar la acción de la fila
	 *
	 * @param id id de la acción
	 * @param key identificador de la fila
	 */
	public clickOnAction(id: string, key: string, tooltip: string, id_edit: any) {
		this.contexto[this.clickOnActionRow](id, key, tooltip, id_edit);
	}
	/**
	 * Muestra los datos en una tabla según la configuración de columna proporcionada.
	 * @param row El objeto que contiene los datos de la fila.
	 * @param head La configuración de columna que indica cómo mostrar los datos.
	 * @returns Una cadena que representa los datos formateados según la configuración de columna.
	 */
	public showDataInTable(row: any, head: IColumnTable): string {
		//
		if (this.isTarea) {
			let tareaRow = { ...row, idSolicitud: row["idSolicitud"].split(",")[0] };
			//
			return head.dataIndexesToJoin
				? head.dataIndexesToJoin
					.map((prop) => {
						return tareaRow[prop];
					})
					.join(" - ")
				: tareaRow[head.dataIndex];
		}
		return head.dataIndexesToJoin
			? head.dataIndexesToJoin.map((prop) => row[prop]).join(" - ")
			: row[head.dataIndex];
	}

	public onRowChangeEmitter(value: any, id: any) {
		Boolean(this.onRowChange) && this.contexto[this.onRowChange](value, id);
	}
}
