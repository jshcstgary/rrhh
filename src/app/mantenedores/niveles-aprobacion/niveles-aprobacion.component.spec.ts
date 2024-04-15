import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NivelesAprobacionComponent } from "./niveles-aprobacion.component";

describe("NivelesComponent", () => {
  let component: NivelesAprobacionComponent;
  let fixture: ComponentFixture<NivelesAprobacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NivelesAprobacionComponent],
    });
    fixture = TestBed.createComponent(NivelesAprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
