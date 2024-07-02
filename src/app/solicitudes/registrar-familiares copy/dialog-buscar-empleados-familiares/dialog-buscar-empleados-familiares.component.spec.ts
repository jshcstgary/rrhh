import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBuscarEmpleadosFamiliaresComponent } from './dialog-buscar-empleados-familiares.component';

describe('DialogBuscarEmpleadosComponent', () => {
  let component: DialogBuscarEmpleadosFamiliaresComponent;
  let fixture: ComponentFixture<DialogBuscarEmpleadosFamiliaresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogBuscarEmpleadosFamiliaresComponent]
    });
    fixture = TestBed.createComponent(DialogBuscarEmpleadosFamiliaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
