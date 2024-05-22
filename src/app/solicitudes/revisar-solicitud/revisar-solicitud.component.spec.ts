import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarSolicitudComponent } from './revisar-solicitud.component';

describe('RevisarSolicitudComponent', () => {
  let component: RevisarSolicitudComponent;
  let fixture: ComponentFixture<RevisarSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisarSolicitudComponent]
    });
    fixture = TestBed.createComponent(RevisarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
