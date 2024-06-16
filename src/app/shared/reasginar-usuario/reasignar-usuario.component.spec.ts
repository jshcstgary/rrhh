import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasginarUsuarioComponent } from './reasginar-usuario.component';

describe('ReasginarUsuarioComponent', () => {
  let component: ReasginarUsuarioComponent;
  let fixture: ComponentFixture<ReasginarUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasginarUsuarioComponent]
    });
    fixture = TestBed.createComponent(ReasginarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
