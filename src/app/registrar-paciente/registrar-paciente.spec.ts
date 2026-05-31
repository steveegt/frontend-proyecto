import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarPacienteComponent } from './registrar-paciente';

describe('RegistrarPacienteComponent', () => {
  let component: RegistrarPacienteComponent;
  let fixture: ComponentFixture<RegistrarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPacienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPacienteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});