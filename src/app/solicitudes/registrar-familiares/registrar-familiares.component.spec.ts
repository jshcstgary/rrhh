import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarFamiliaresComponent } from './registrar-familiares.component';

describe('RegistrarFamiliaresComponent', () => {
  let component: RegistrarFamiliaresComponent;
  let fixture: ComponentFixture<RegistrarFamiliaresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarFamiliaresComponent]
    });
    fixture = TestBed.createComponent(RegistrarFamiliaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
