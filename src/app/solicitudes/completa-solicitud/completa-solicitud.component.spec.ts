import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletaSolicitudComponent } from './completa-solicitud.component';

describe('CompletaSolicitudComponent', () => {
  let component: CompletaSolicitudComponent;
  let fixture: ComponentFixture<CompletaSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletaSolicitudComponent]
    });
    fixture = TestBed.createComponent(CompletaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
