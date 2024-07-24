import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrazabilidadSolicitudComponent } from './trazabilidad-solicitud.component';

describe('TrazabilidadSolicitudComponent', () => {
  let component: TrazabilidadSolicitudComponent;
  let fixture: ComponentFixture<TrazabilidadSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrazabilidadSolicitudComponent]
    });
    fixture = TestBed.createComponent(TrazabilidadSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
