import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAprobadorFijoComponent } from './crear-aprobador-fijo.component';

describe('CrearAprobadorFijoComponent', () => {
  let component: CrearAprobadorFijoComponent;
  let fixture: ComponentFixture<CrearAprobadorFijoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearAprobadorFijoComponent]
    });
    fixture = TestBed.createComponent(CrearAprobadorFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
