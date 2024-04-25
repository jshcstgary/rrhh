import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTareasComponent } from './consulta-tareas.component';

describe('ConsultaTareasComponent', () => {
  let component: ConsultaTareasComponent;
  let fixture: ComponentFixture<ConsultaTareasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaTareasComponent]
    });
    fixture = TestBed.createComponent(ConsultaTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
