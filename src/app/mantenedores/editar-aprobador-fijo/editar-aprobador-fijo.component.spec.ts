import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAprobadorFijoComponent } from './editar-aprobador-fijo.component';

describe('EditarAprobadorFijoComponent', () => {
  let component: EditarAprobadorFijoComponent;
  let fixture: ComponentFixture<EditarAprobadorFijoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarAprobadorFijoComponent]
    });
    fixture = TestBed.createComponent(EditarAprobadorFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
