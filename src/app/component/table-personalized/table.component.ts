import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'table-perso',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TablaComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() tableWidth: string = '100%';

  @Output() changeSort = new EventEmitter<any>();
  @Output() saveRowData = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<any>();

  onChangeSort(column: any) {
    this.changeSort.emit(column);
  }

  onSaveRowDataToModified(row: any) {
    row.isEditingRow = false;
    this.saveRowData.emit(row);
  }

  onInputChange(event: Event, row: any, dataIndex: string) {
    const input = event.target as HTMLInputElement;
    row[dataIndex] = input.value;
  }

  clickOnAction(actionId: string, rowKey: any, tooltip: string, additionalParam: any) {
    this.actionClick.emit({ actionId, rowKey, tooltip, additionalParam });
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
