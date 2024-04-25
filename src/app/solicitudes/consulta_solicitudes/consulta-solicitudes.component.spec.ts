import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConsultaComponent } from "./consulta-solicitudes.component";

describe("ConsultaComponent", () => {
  let component: ConsultaComponent;
  let fixture: ComponentFixture<ConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaComponent],
    });
    fixture = TestBed.createComponent(ConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
