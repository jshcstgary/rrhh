import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletarSolicitudComponent } from './completar-solicitud.component';

describe('CompletarSolicitudComponent', () => {
  let component: CompletarSolicitudComponent;
  let fixture: ComponentFixture<CompletarSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletarSolicitudComponent]
    });
    fixture = TestBed.createComponent(CompletarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
