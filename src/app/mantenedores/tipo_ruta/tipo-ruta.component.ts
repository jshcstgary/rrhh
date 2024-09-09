import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { TipoRutaPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { UtilData } from "src/app/services/util/util.data";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { TiporutaData } from "./tipo-ruta.data";
import { ITiporuta, ITiporutaTable } from "./tipo-ruta.interface";
import { TipoRutaService } from "./tipo-ruta.service";
import { removeExtraSpaces } from "src/app/services/util/text.util";
import { DatePipe } from "@angular/common";

@Component({
	templateUrl: "./tipo-ruta.component.html",
})
export class TipoRutaComponent implements OnInit {
	private pageCode: string = PageCodes.TipoRuta;
	public activeRecords: boolean = true;
	public pageControlPermission: typeof TipoRutaPageControlPermission = TipoRutaPageControlPermission;

	public controlsPermissions: PageControlPermiso = {
		[TipoRutaPageControlPermission.FiltroTipoSolicitud]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoRutaPageControlPermission.ButtonAgregar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoRutaPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoRutaPageControlPermission.ButtonEditar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoRutaPageControlPermission.ButtonDuplicar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		}
	};

	public columnsTable: IColumnsTable = TiporutaData.columns;
	public dataTable: any[] = [];
	public dataTableActive: any[] = [];
	public dataTableInactive: any[] = [];
	public tableInputsEditRow: IInputsComponent = TiporutaData.tableInputsEditRow;
	public colsToFilterByText: string[] = TiporutaData.colsToFilterByText;
	public IdRowToClone: string = null;
	public defaultEmptyRowTable: ITiporutaTable =
		TiporutaData.defaultEmptyRowTable;
	public codigoReporte: reportCodeEnum = reportCodeEnum.MANTENIMIENTO_TIPO_RUTA;
	constructor(
		private tiporutaesService: TipoRutaService,
		private tableService: TableService,
		private validationsService: ValidationsService,
		private utilService: UtilService,
		private permissionService: PermisoService
	) {
		this.getPermissions();
	}

	ngOnInit(): void {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
			if (action.id === "editOnTable") {
				action.showed = this.controlsPermissions[TipoRutaPageControlPermission.ButtonEditar].visualizar
			} else if (action.id === "cloneOnTable") {
				action.showed = this.controlsPermissions[TipoRutaPageControlPermission.ButtonDuplicar].visualizar
			}
		});

		this.getDataToTable();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "01") {
				this.controlsPermissions[TipoRutaPageControlPermission.FiltroTipoSolicitud] = controlPermission;
			} else if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[TipoRutaPageControlPermission.ButtonAgregar] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[TipoRutaPageControlPermission.ButtonExportar] = controlPermission;
			} else if (controlPermission.codigo_Control === "04") {
				this.controlsPermissions[TipoRutaPageControlPermission.ButtonEditar] = controlPermission;
			} else if (controlPermission.codigo_Control === "05") {
				this.controlsPermissions[TipoRutaPageControlPermission.ButtonDuplicar] = controlPermission;
			}
		});
	}

	private getDataToTable(modalMessage: string = "") {
		return this.tiporutaesService.index().subscribe({
			next: (response) => {
				this.dataTable = response.tipoRutaType
					.map((tipoRutaResponse) => ({
						...tipoRutaResponse,
						estado: tipoRutaResponse.estado === "A",
						fechaActualizacion: new DatePipe('en-CO').transform(tipoRutaResponse.fechaActualizacion, "dd/MM/yyyy HH:mm:ss")
					}))
					.sort((a, b) => a.tipoRuta.localeCompare(b.tipoRuta));

				this.dataTableActive = this.dataTable.filter(data => data.estado);
				this.dataTableInactive = this.dataTable.filter(data => !data.estado);

				this.utilService.closeLoadingSpinner();

				if (modalMessage !== "") {
					this.utilService.modalResponse(modalMessage, "success");
				}
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.closeLoadingSpinner();

				this.utilService.modalResponse(error.error, "error");
			},
		});
	}
	/**
	 * Funcion para eliminar un registro
	 *
	 * @param key Id del registro
	 */
	private onDelete(key: string) {
		this.tiporutaesService.delete(key).subscribe({
			next: (response) => {
				this.getDataToTable(response);
			},
			error: (error: HttpErrorResponse) =>
				this.utilService.modalResponse(error.error, "error"),
		});
	}
	private onSaveRowTable(rowData: ITiporutaTable, finishedClonningRow: boolean) {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		// rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
		rowData.estado = rowData.estado === "A" || rowData.estado === true ? "A" : "I";
		rowData.tipoRuta = removeExtraSpaces(rowData.tipoRuta);

		if (rowData.key) {
			/* Actualizar */
			this.tiporutaesService.update(rowData).subscribe({
				next: (response) => {
					this.tableService.changeStateIsAnyEditRowActive(false);

					this.getDataToTable("Campos actualizados correctamente").add(() => {
						if (finishedClonningRow) {
							this.IdRowToClone = response.id.toString();
						}
					});
				},
				error: (error: HttpErrorResponse) =>
					this.utilService.modalResponse(error.error, "error"),
			});
		} else {
			/* Crear */
			rowData.id = 0;

			this.tiporutaesService.store(rowData).subscribe({
				next: (response) => {
					this.tableService.changeStateIsAnyEditRowActive(false);

					this.getDataToTable("Datos ingresados correctamente").add(() => {
						if (finishedClonningRow) {
							this.IdRowToClone = response.id.toString();
						}
					});
				},
				error: (error: HttpErrorResponse) =>
					this.utilService.modalResponse(error.error, "error"),
			});
		}
	}

	/**
	 * Función para realizar validaciones antes de crear/actualizar
	 *
	 * @param rowData Objeto con la informacion de la fila
	 * @param finishedClonningRow valida si al finalizar clona o no el ultimo registro
	 */
	private async validateToSave(
		rowData: ITiporuta,
		finishedClonningRow: boolean
	) {
		const descripcionNotEmpty =
			this.validationsService.isNotEmptyStringVariable(rowData.tipoRuta);
		if (!descripcionNotEmpty) {
			return;
		}
		if (
			!environment.modalConfirmation ||
			(await Swal.fire(UtilData.messageToSave)).isConfirmed
		) {
			this.onSaveRowTable(rowData, finishedClonningRow);
		}
	}

	public onChangeActiveRecordsCheckbox(event: any): void {
		this.activeRecords = event;
	}
}
