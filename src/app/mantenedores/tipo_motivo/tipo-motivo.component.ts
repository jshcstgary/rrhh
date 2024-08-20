import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormService } from "src/app/component/form/form.service";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { InputService } from "src/app/component/input/input.service";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { TipoMotivoPageControlPermission } from "src/app/enums/page-control-permisions.enum";
import { MantenimientoService } from "src/app/services/mantenimiento/mantenimiento.service";
import { PermisoService } from "src/app/services/permiso/permiso.service";
import { UtilData } from "src/app/services/util/util.data";
import { reportCodeEnum } from "src/app/services/util/util.interface";
import { UtilService } from "src/app/services/util/util.service";
import { ValidationsService } from "src/app/services/validations/validations.service";
import { PageControlPermiso } from "src/app/types/page-control-permiso.type";
import { Control } from "src/app/types/permiso.type";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { TipomotivoData } from "./tipo-motivo.data";
import {
	ITipomotivo,
	ITipomotivoTable
} from "./tipo-motivo.interface";
import { TipoMotivoService } from "./tipo-motivo.service";

@Component({
	templateUrl: "./tipo-motivo.component.html",
})
export class TipoMotivoComponent implements OnInit {
	private pageCode: string = PageCodes.TipoMotivo;
	public pageControlPermission: typeof TipoMotivoPageControlPermission = TipoMotivoPageControlPermission;
	public activeRecords: boolean = true;

	public controlsPermissions: PageControlPermiso = {
		[TipoMotivoPageControlPermission.FiltroTipoSolicitud]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoMotivoPageControlPermission.ButtonAgregar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoMotivoPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoMotivoPageControlPermission.ButtonEditar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[TipoMotivoPageControlPermission.ButtonDuplicar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		}
	};

	public columnsTable: IColumnsTable = TipomotivoData.columns;
	public dataTable: any[] = [];
	public dataTableActive: any[] = [];
	public dataTableInactive: any[] = [];
	public tableInputsEditRow: IInputsComponent =
		TipomotivoData.tableInputsEditRow;
	public colsToFilterByText: string[] = TipomotivoData.colsToFilterByText;
	public IdRowToClone: string = null;
	public defaultEmptyRowTable: ITipomotivoTable =
		TipomotivoData.defaultEmptyRowTable;
	public dataTipoSolicitudes: any[] = [];
	public codigoReporte: reportCodeEnum =
		reportCodeEnum.MANTENIMIENTO_TIPO_MOTIVO;
	constructor(
		private tipomotivosService: TipoMotivoService,
		private tableService: TableService,
		private validationsService: ValidationsService,
		private utilService: UtilService,
		private formService: FormService,
		private inputService: InputService,
		private mantenimientoService: MantenimientoService,
		private permissionService: PermisoService
	) {
		if (localStorage.getItem(LocalStorageKeys.Reloaded)! === "0" || localStorage.getItem(LocalStorageKeys.Reloaded) === null) {
			localStorage.setItem(LocalStorageKeys.Reloaded, "1");

			window.location.reload();
		}

		this.getPermissions();
	}

	ngOnInit(): void {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		this.columnsTable[this.columnsTable.length - 1].actions.forEach(action => {
			if (action.id === "editOnTable") {
				action.showed = this.controlsPermissions[TipoMotivoPageControlPermission.ButtonEditar].visualizar
			} else if (action.id === "cloneOnTable") {
				action.showed = this.controlsPermissions[TipoMotivoPageControlPermission.ButtonDuplicar].visualizar
			}
		});

		this.getDataToCombo();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "01") {
				this.controlsPermissions[TipoMotivoPageControlPermission.FiltroTipoSolicitud] = controlPermission;
			} else if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[TipoMotivoPageControlPermission.ButtonAgregar] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[TipoMotivoPageControlPermission.ButtonExportar] = controlPermission;
			} else if (controlPermission.codigo_Control === "04") {
				this.controlsPermissions[TipoMotivoPageControlPermission.ButtonEditar] = controlPermission;
			} else if (controlPermission.codigo_Control === "05") {
				this.controlsPermissions[TipoMotivoPageControlPermission.ButtonDuplicar] = controlPermission;
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

	private getDataToTable() {
		return this.tipomotivosService.index().subscribe({
			next: (response) => {
				this.dataTable = response
					.map((motivoResponse) => ({
						...motivoResponse,
						estado: motivoResponse.estado === "A",
						tipoSolicitudFormatted: this.formatTipoSolicitudEstaciones(motivoResponse),
					}))
					// .sort((a, b) => a.tipoMotivo.localeCompare(b.tipoMotivo));
					.sort((a, b) => {
						if (a.tipoSolicitudId === b.tipoSolicitudId) {
							return a.tipoMotivo.localeCompare(b.tipoMotivo);
						}

						return (a.tipoSolicitudId as number) - (b.tipoSolicitudId as number);
					});

				this.dataTableActive = this.dataTable.filter(data => data.estado);
				this.dataTableInactive = this.dataTable.filter(data => !data.estado);

				this.utilService.closeLoadingSpinner();
			},
			error: (error: HttpErrorResponse) => {
				this.utilService.closeLoadingSpinner();

				this.utilService.modalResponse(error.error, "error");
			}
		});
	}
	private formatTipoSolicitudEstaciones(motivoResponse: ITipomotivo): string {
		const tipoSolcicitud = this.dataTipoSolicitudes.find(
			(tipoSolcicitud) => tipoSolcicitud.id == motivoResponse.tipoSolicitudId
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
		this.tipomotivosService.delete(key).subscribe({
			next: (response) => {
				this.getDataToTable();
				this.utilService.modalResponse(response, "success");
			},
			error: (error: HttpErrorResponse) =>
				this.utilService.modalResponse(error.error, "error"),
		});
	}
	private onSaveRowTable(rowData: ITipomotivoTable, finishedClonningRow: boolean) {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		// rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
		rowData.estado = rowData.estado === "A" || rowData.estado === true ? "A" : "I";

		if (rowData.key) {
			/* Actualizar */
			this.tipomotivosService.update(rowData).subscribe({
				next: (response) => {
					this.tableService.changeStateIsAnyEditRowActive(false);

					this.utilService.modalResponse("Campos actualizados correctamente", "success");

					this.getDataToTable().add(() => {
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

			this.tipomotivosService.store(rowData).subscribe({
				next: (response) => {
					this.tableService.changeStateIsAnyEditRowActive(false);

					this.utilService.modalResponse("Datos ingresados correctamente", "success");

					this.getDataToTable().add(() => {
						if (finishedClonningRow) {
							this.IdRowToClone = response.tipoMotivo.toString();
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
	private async validateToSave(rowData: ITipomotivo, finishedClonningRow: boolean) {
		const descripcionNotEmpty = this.validationsService.isNotEmptyStringVariable(rowData.tipoMotivo);
		if (!descripcionNotEmpty) {
			return;
		}

		if (!environment.modalConfirmation || (await Swal.fire(UtilData.messageToSave)).isConfirmed) {
			this.onSaveRowTable(rowData, finishedClonningRow);
		}
	}

	public onChangeActiveRecordsCheckbox(event: any): void {
		this.activeRecords = event;
	}
}
