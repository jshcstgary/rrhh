import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNivelesAprobacionComponent } from './crear-niveles-aprobacion.component';

describe('CrearNivelesAprobacionComponent', () => {
  let component: CrearNivelesAprobacionComponent;
  let fixture: ComponentFixture<CrearNivelesAprobacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearNivelesAprobacionComponent]
    });
    fixture = TestBed.createComponent(CrearNivelesAprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
