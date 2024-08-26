import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalBuscadorTableData } from "src/app/eschemas/modal-buscadr.type";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilService } from "src/app/services/util/util.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-modal-buscador",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./modal-buscador.component.html",
	styleUrls: ["./modal-buscador.component.scss"]
})
export class ModalBuscadorComponent {
	@Input()
	public tableData: ModalBuscadorTableData[] = [];

	@Input()
	public inputSearchPlaceholder: string = "";

	@Output()
	public search = new EventEmitter<string>();

	public myForm: FormGroup = this.formBuilder.group({
		searchInput: ["", [Validators.required, Validators.minLength(1)]]
	});

	constructor(private activeModal: NgbActiveModal, private utilService: UtilService, private formBuilder: FormBuilder) { }

	public onSearch(): void {
		this.search.emit(this.myForm.value.searchInput);
	}
}
