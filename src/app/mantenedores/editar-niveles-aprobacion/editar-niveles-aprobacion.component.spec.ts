import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarNivelesAprobacionComponent } from './editar-niveles-aprobacion.component';

describe('EditarNivelesAprobacionComponent', () => {
  let component: EditarNivelesAprobacionComponent;
  let fixture: ComponentFixture<EditarNivelesAprobacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarNivelesAprobacionComponent]
    });
    fixture = TestBed.createComponent(EditarNivelesAprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
