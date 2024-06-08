import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarEmpleadosComponent } from './buscar-empleados.component';

describe('BuscarEmpleadosComponent', () => {
  let component: BuscarEmpleadosComponent;
  let fixture: ComponentFixture<BuscarEmpleadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarEmpleadosComponent]
    });
    fixture = TestBed.createComponent(BuscarEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
