import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormService } from "src/app/component/form/form.service";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { InputService } from "src/app/component/input/input.service";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { TipoAccionPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { removeExtraSpaces } from "src/app/services/util/text.util";
import { UtilData } from "src/app/services/util/util.data";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { TipoaccionData } from "./tipo-accion.data";
import {
	ITipoaccion,
	ITipoaccionTable
} from "./tipo-accion.interface";
import { TipoAccionService } from "./tipo-accion.service";

@Component({
	templateUrl: "./tipo-accion.component.html",
})
export class TipoAccionComponent implements OnInit {
	private pageCode: string = PageCodes.TipoAccion;
	public pageControlPermission: typeof TipoAccionPageControlPermission = TipoAccionPageControlPermission;
	public activeRecords: boolean = true;

	public controlsPermissions: PageControlPermiso = {
		[TipoAccionPageControlPermission.FiltroTipoSolicitud]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoAccionPageControlPermission.ButtonAgregar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoAccionPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoAccionPageControlPermission.ButtonEditar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoAccionPageControlPermission.ButtonDuplicar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		}
	};

	public columnsTable: IColumnsTable = TipoaccionData.columns;
	public dataTable: any[] = [];
	public dataTableActive: any[] = [];
	public dataTableInactive: any[] = [];
	public tableInputsEditRow: IInputsComponent =
		TipoaccionData.tableInputsEditRow;
	public colsToFilterByText: string[] = TipoaccionData.colsToFilterByText;
	public IdRowToClone: string = null;
	public defaultEmptyRowTable: ITipoaccionTable =
		TipoaccionData.defaultEmptyRowTable;
	public dataTipoSolicitudes: any[] = [];
	public codigoReporte: reportCodeEnum =
		reportCodeEnum.MANTENIMIENTO_TIPO_ACCION;
	constructor(
		private tipoaccionsService: TipoAccionService,
		private tableService: TableService,
		private validationsService: ValidationsService,
		private utilService: UtilService,
		private formService: FormService,
		private inputService: InputService,
		private mantenimientoService: MantenimientoService,
		private permissionService: PermisoService
	) {
		if (sessionStorage.getItem(LocalStorageKeys.Reloaded)! === "0" || sessionStorage.getItem(LocalStorageKeys.Reloaded) === null) {
			sessionStorage.setItem(LocalStorageKeys.Reloaded, "1");

			window.location.reload();
		}

		this.getPermissions();
	}

	ngOnInit(): void {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
			if (action.id === "editOnTable") {
				action.showed = this.controlsPermissions[TipoAccionPageControlPermission.ButtonEditar].visualizar
			} else if (action.id === "cloneOnTable") {
				action.showed = this.controlsPermissions[TipoAccionPageControlPermission.ButtonDuplicar].visualizar
			}
		});

		this.getDataToCombo();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "01") {
				this.controlsPermissions[TipoAccionPageControlPermission.FiltroTipoSolicitud] = controlPermission;
			} else if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[TipoAccionPageControlPermission.ButtonAgregar] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[TipoAccionPageControlPermission.ButtonExportar] = controlPermission;
			} else if (controlPermission.codigo_Control === "04") {
				this.controlsPermissions[TipoAccionPageControlPermission.ButtonEditar] = controlPermission;
			} else if (controlPermission.codigo_Control === "05") {
				this.controlsPermissions[TipoAccionPageControlPermission.ButtonDuplicar] = controlPermission;
			}
		});
	}

	private getDataToCombo() {
		return this.mantenimientoService.getTipoSolicitud().subscribe({
			next: (response: any) => {
				const comboTipoSolicitud = this.inputService.formatDataToOptionsValueInLabel(response.tipoSolicitudType.filter(data => data.estado === "A"), "tipoSolicitud", "id");

				this.dataTipoSolicitudes = response.tipoSolicitudType;

				this.tableInputsEditRow = this.formService.changeValuePropFormById("tipoSolicitudId", this.tableInputsEditRow, "options", comboTipoSolicitud);

				this.getDataToTable();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.closeLoadingSpinner();

				if (error.status !== 404) {
					this.utilService.modalResponse(error.error, "error");
				}
			},
		});
	}

	private getDataToTable(modalMessage: string = "") {
		return this.tipoaccionsService.index().subscribe({
			next: (response) => {
				this.dataTable = response
					.map((accionResponse) => ({
						...accionResponse,
						estado: accionResponse.estado === "A",
						tipoSolicitudFormatted: this.formatTipoSolicitudEstaciones(accionResponse),
						fechaActualizacion: new DatePipe('en-CO').transform(accionResponse.fechaActualizacion, "dd/MM/yyyy HH:mm:ss")
					}))
					.sort((a, b) => {
						const tipoSolicitudComparacion = a.tipoSolicitudFormatted.localeCompare(b.tipoSolicitudFormatted);

						if (tipoSolicitudComparacion !== 0) {
							return tipoSolicitudComparacion;
						}

						return a.tipoAccion.localeCompare(b.tipoAccion);
					});

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
			}
		});
	}
	private formatTipoSolicitudEstaciones(accionResponse: ITipoaccion): string {
		const tipoSolcicitud = this.dataTipoSolicitudes.find(
			(tipoSolcicitud) => tipoSolcicitud.id == accionResponse.tipoSolicitudId
		);
		if (tipoSolcicitud) {
			return tipoSolcicitud.tipoSolicitud;
		}
		return " ";
	}
	/**
	 * Funcion para eliminar un registro
	 *
	 * @param key Id del registro
	 */
	private onDelete(key: string) {
		this.tipoaccionsService.delete(key).subscribe({
			next: (response) => {
				this.getDataToTable(response);
			},
			error: (error: HttpErrorResponse) =>
				this.utilService.modalResponse(error.error, "error"),
		});
	}
	private onSaveRowTable(rowData: ITipoaccionTable, finishedClonningRow: boolean) {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		// rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
		rowData.estado = rowData.estado === "A" || rowData.estado === true ? "A" : "I";
		rowData.tipoAccion = removeExtraSpaces(rowData.tipoAccion);

		if (rowData.key) {
			/* Actualizar */
			this.tipoaccionsService.update(rowData).subscribe({
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

			this.tipoaccionsService.store(rowData).subscribe({
				next: (response) => {
					this.tableService.changeStateIsAnyEditRowActive(false);

					this.getDataToTable("Datos ingresados correctamente").add(() => {
						if (finishedClonningRow) {
							this.IdRowToClone = response.tipoAccion.toString();
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
		rowData: ITipoaccion,
		finishedClonningRow: boolean
	) {
		const descripcionNotEmpty =
			this.validationsService.isNotEmptyStringVariable(rowData.tipoAccion);
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
