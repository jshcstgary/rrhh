import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAprobadorFijoComponent } from './buscar-aprobador-fijo.component';

describe('BuscarAprobadorFijoComponent', () => {
  let component: BuscarAprobadorFijoComponent;
  let fixture: ComponentFixture<BuscarAprobadorFijoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarAprobadorFijoComponent]
    });
    fixture = TestBed.createComponent(BuscarAprobadorFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
