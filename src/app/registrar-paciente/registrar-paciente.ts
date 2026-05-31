import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  templateUrl: './registrar-paciente.html',
  styleUrls: ['./registrar-paciente.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule
  ]
})
export class RegistrarPacienteComponent {

  // ✅ URL BASE BACKEND (IMPORTANTE)
  API = 'https://backend-proyecto-production-f013.up.railway.app';

  pacienteForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {

    this.pacienteForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      direccion: [''],
      telefono: ['', Validators.required],
      seguro: [''],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  volver() {
    this.router.navigate(['/menuadmin']);
  }

  mostrarMensaje(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  onSubmit() {

    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const datos = this.pacienteForm.value;

    this.http.post(
      `${this.API}/api/pacientes/crear-con-usuario`,
      datos,
      { responseType: 'text' }
    )
    .pipe(
      catchError(error => {

        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });

        this.mostrarMensaje('❌ Error al registrar paciente');
        return throwError(() => error);
      })
    )
    .subscribe({
      next: (res) => {

        setTimeout(() => {
          this.loading = false;
          this.pacienteForm.reset();
          this.cdr.detectChanges();
        });

        console.log('Respuesta backend:', res);

        this.mostrarMensaje('✅ Paciente creado correctamente');
      },
      error: () => {

        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });

      }
    });
  }
}