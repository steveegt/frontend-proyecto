import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMedico } from './registrar-medico';

describe('RegistrarMedico', () => {
  let component: RegistrarMedico;
  let fixture: ComponentFixture<RegistrarMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarMedico],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
