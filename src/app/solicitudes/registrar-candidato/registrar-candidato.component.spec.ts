import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCandidatoComponent } from './registrar-candidato.component';

describe('RegistrarCandidatoComponent', () => {
  let component: RegistrarCandidatoComponent;
  let fixture: ComponentFixture<RegistrarCandidatoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarCandidatoComponent]
    });
    fixture = TestBed.createComponent(RegistrarCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
