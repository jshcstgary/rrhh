import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSolicitudComponent } from './registrar-solicitud.component';

describe('RegistrarSolicitudComponent', () => {
  let component: RegistrarSolicitudComponent;
  let fixture: ComponentFixture<RegistrarSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarSolicitudComponent]
    });
    fixture = TestBed.createComponent(RegistrarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
