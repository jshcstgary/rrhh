import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBuscarEmpleadosComponent } from './buscar-empleados.component';

describe('DialogBuscarEmpleadosComponent', () => {
  let component: DialogBuscarEmpleadosComponent;
  let fixture: ComponentFixture<DialogBuscarEmpleadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogBuscarEmpleadosComponent]
    });
    fixture = TestBed.createComponent(DialogBuscarEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
