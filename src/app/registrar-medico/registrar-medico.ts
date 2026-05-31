import { Component, ChangeDetectorRef } from '@angular/core';import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-registrar-medico',
  standalone: true,
  templateUrl: './registrar-medico.html',
  styleUrls: ['./registrar-medico.css'],
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
export class RegistrarMedicoComponent {

  // ✅ URL BASE BACKEND
  API = 'https://backend-proyecto-production-f013.up.railway.app';

  medicoForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {

    this.medicoForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      colegiado: ['', Validators.required],
      especialidad: ['', Validators.required],
      direccion: [''],
      edad: ['', Validators.required],
      observacion: [''],

      // ✅ usuario
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  volver() {
    this.router.navigate(['/menuadmin']);
  }

  mostrar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  onSubmit() {

    if (this.medicoForm.invalid) {
      this.mostrar('⚠️ Completa todos los campos obligatorios');
      return;
    }

    this.loading = true;

    const datos = this.medicoForm.value;

    this.http.post(
      `${this.API}/api/medico/crear-con-usuario`,
      datos
    )
    .subscribe({
      next: (res: any) => {

        setTimeout(() => {
          this.loading = false;

          this.mostrar(res?.mensaje || '✅ Médico creado correctamente');

          this.medicoForm.reset();

          this.cdr.detectChanges();
        });

      },
      error: (err) => {

        console.error('Error backend:', err);

        setTimeout(() => {
          this.loading = false;

          this.mostrar('❌ Error al registrar médico');

          this.cdr.detectChanges();
        });

      }
    });
  }
}
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
