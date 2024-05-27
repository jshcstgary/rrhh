import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReingresoPersonalComponent } from './reingreso-personal.component';

describe('ReingresoPersonalComponent', () => {
  let component: ReingresoPersonalComponent;
  let fixture: ComponentFixture<ReingresoPersonalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReingresoPersonalComponent]
    });
    fixture = TestBed.createComponent(ReingresoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
