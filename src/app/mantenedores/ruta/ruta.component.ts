import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormService } from "src/app/component/form/form.service";
import { IInputsComponent } from "src/app/component/input/input.interface";
import { InputService } from "src/app/component/input/input.service";
import { IColumnsTable } from "src/app/component/table/table.interface";
import { TableService } from "src/app/component/table/table.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { RutaPageControlPermission } from "src/app/enums/page-control-permisions.enum";
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
import { TiporutaData } from "./ruta.data";
import { IRuta, IRutaTable } from "./ruta.interface";
import { RutaService } from "./ruta.service";

@Component({
	templateUrl: "./ruta.component.html",
})
export class RutaComponent implements OnInit {
	public pageControlPermission: typeof RutaPageControlPermission = RutaPageControlPermission;
	public activeRecords: boolean = true;

	private pageCode: string = PageCodes.Ruta;

	public controlsPermissions: PageControlPermiso = {
		[RutaPageControlPermission.FiltroTipoSolicitud]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[RutaPageControlPermission.ButtonAgregar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[RutaPageControlPermission.ButtonExportar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[RutaPageControlPermission.ButtonEditar]: {
			"codigo_Control": "",
			"habilitar": false,
			"modificar": false,
			"visualizar": false
		},
		[RutaPageControlPermission.ButtonDuplicar]: {
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
	public defaultEmptyRowTable: IRutaTable = TiporutaData.defaultEmptyRowTable;
	public dataTipoRuta: any[] = [];
	public codigoReporte: reportCodeEnum =
		reportCodeEnum.MANTENIMIENTO_RUTA;
	constructor(
		private RutasService: RutaService,
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
				action.showed = this.controlsPermissions[RutaPageControlPermission.ButtonEditar].visualizar
			} else if (action.id === "cloneOnTable") {
				action.showed = this.controlsPermissions[RutaPageControlPermission.ButtonDuplicar].visualizar
			}
		});

		this.getDataToCombo();
	}

	private getPermissions(): void {
		const controlsPermission: Control[] = this.permissionService.getPagePermission(this.pageCode);

		controlsPermission.forEach(controlPermission => {
			if (controlPermission.codigo_Control === "01") {
				this.controlsPermissions[RutaPageControlPermission.FiltroTipoSolicitud] = controlPermission;
			} else if (controlPermission.codigo_Control === "02") {
				this.controlsPermissions[RutaPageControlPermission.ButtonAgregar] = controlPermission;
			} else if (controlPermission.codigo_Control === "03") {
				this.controlsPermissions[RutaPageControlPermission.ButtonExportar] = controlPermission;
			} else if (controlPermission.codigo_Control === "04") {
				this.controlsPermissions[RutaPageControlPermission.ButtonEditar] = controlPermission;
			} else if (controlPermission.codigo_Control === "05") {
				this.controlsPermissions[RutaPageControlPermission.ButtonDuplicar] = controlPermission;
			}
		});
	}

	private getDataToCombo() {
		return this.mantenimientoService.getTipoRuta().subscribe({
			next: (response) => {
				const comboTipoRuta = this.inputService.formatDataToOptionsValueInLabel(response.tipoRutaType.filter(data => data.estado === "A"), "tipoRuta", "id");

				this.dataTipoRuta = response.tipoRutaType;

				this.tableInputsEditRow = this.formService.changeValuePropFormById("idTipoRuta", this.tableInputsEditRow, "options", comboTipoRuta);

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
		return this.RutasService.index().subscribe({
			next: (response) => {
				this.dataTable = response
					.map((accionResponse) => ({
						...accionResponse,
						estado: accionResponse.estado === "A",
						tipoRutaFormatted: this.formatTipoRutaEstaciones(accionResponse),
					}))
					// .sort((a, b) => a.ruta.localeCompare(b.ruta));
					.sort((a, b) => {
						if (a.idTipoRuta === b.idTipoRuta) {
							return a.ruta.localeCompare(b.ruta);
						}

						return (a.idTipoRuta as number) - (b.idTipoRuta as number);
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
	private formatTipoRutaEstaciones(accionResponse: IRuta): string {
		const tipoRuta = this.dataTipoRuta.find(
			(tipoRuta) => tipoRuta.id == accionResponse.idTipoRuta
		);
		if (tipoRuta) {
			return tipoRuta.tipoRuta;
		}
		return " ";
	}
	/**
	 * Funcion para eliminar un registro
	 *
	 * @param key Id del registro
	 */
	private onDelete(key: string) {
		this.RutasService.delete(key).subscribe({
			next: (response) => {
				this.getDataToTable();
				this.utilService.modalResponse(response, "success");
			},
			error: (error: HttpErrorResponse) =>
				this.utilService.modalResponse(error.error, "error"),
		});
	}
	private onSaveRowTable(rowData: IRutaTable, finishedClonningRow: boolean) {
		this.utilService.openLoadingSpinner("Cargando información, espere por favor...");

		// rowData = { ...rowData, estado: rowData.estado ? "A" : "I" };
		rowData.estado = rowData.estado === "A" || rowData.estado === true ? "A" : "I";

		if (rowData.key) {
			/* Actualizar */
			this.RutasService.update(rowData).subscribe({
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

			this.RutasService.store(rowData).subscribe({
				next: (response) => {
					this.tableService.changeStateIsAnyEditRowActive(false);

					this.utilService.modalResponse("Datos ingresados correctamente", "success");

					this.getDataToTable().add(() => {
						if (finishedClonningRow) {
							this.IdRowToClone = response.ruta.toString();
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
	private async validateToSave(rowData: IRuta, finishedClonningRow: boolean) {
		const descripcionNotEmpty =
			this.validationsService.isNotEmptyStringVariable(rowData.ruta);
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
