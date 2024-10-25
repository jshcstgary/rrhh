import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "table-personalized",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
})
export class TablaComponent {
	@Input() columns: any[] = [];
	@Input() data: any[] = [];
	@Input() tableWidth: string = "100%";

	@Output() changeSort = new EventEmitter<any>();
	@Output() saveRowData = new EventEmitter<any>();
	@Output() actionClick = new EventEmitter<any>();

	public parentezcos: string[] = ["Madre/Padre", "Hermano/a", "Primo/a", "Hijo/a", "Tío/a", "Sobrino/a", "Nieto/a", "Cónyuge", "Abuelo/a"].sort((a, b) => a.localeCompare(b));

	onChangeSort(column: any) {
		this.changeSort.emit(column);
	}

	onSaveRowDataToModified(row: any) {
		row.isEditingRow = false;
		this.saveRowData.emit(row);
	}

	onInputChange(event: Event, row: any, dataIndex: string, index) {
		const input = event.target as HTMLInputElement;

		row[dataIndex] = input.value;

		return;
	}

	clickOnAction(
		action: string,
		index,
		row: any,
		tooltip: string,
		additionalParam: any
	) {
		this.actionClick.emit({ action, index, row, tooltip, additionalParam });
	}

	getAdditionalParam(row: any) {
		// Implementación de parámetros adicionales según sea necesario
		return row.idNivelAprobacion !== undefined
			? row.idNivelAprobacion
			: row.iD_APROBADOR !== undefined
				? row.iD_APROBADOR
				: row.idSolicitud;
	}
}
