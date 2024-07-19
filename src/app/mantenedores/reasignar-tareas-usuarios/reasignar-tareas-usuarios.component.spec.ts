import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarTareasUsuariosComponent } from './reasignar-tareas-usuarios.component';

describe('ReasignarTareasUsuariosComponent', () => {
  let component: ReasignarTareasUsuariosComponent;
  let fixture: ComponentFixture<ReasignarTareasUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasignarTareasUsuariosComponent]
    });
    fixture = TestBed.createComponent(ReasignarTareasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
