import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-editar-paciente',
  standalone: true,
  templateUrl: './editar-paciente.html',
  styleUrls: ['./editar-paciente.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ]
})
export class EditarPacienteComponent {

  API = 'https://backend-proyecto-production-f013.up.railway.app';

  nombreBusqueda = '';
  pacientes: any[] = [];
  pacienteSeleccionado: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  // ✅ 🔥 CLAVE GLOBAL (TOKEN)
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
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

  // ✅ BUSCAR PACIENTES
  buscar() {
    this.http.get<any[]>(
      `${this.API}/api/pacientes/buscar?nombre=${this.nombreBusqueda}`,
      { headers: this.getHeaders() } // ✅ FIX
    ).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ SELECCIONAR
  seleccionar(p: any) {
    this.pacienteSeleccionado = { ...p };

    this.http.get<any>(
      `${this.API}/api/usuarios/por-paciente/${p.idPaciente}`,
      { headers: this.getHeaders() } // ✅ FIX
    )
    .subscribe(user => {
      this.pacienteSeleccionado.username = user.username;
      this.pacienteSeleccionado.password = user.password;
      this.pacienteSeleccionado.usuarioId = user.id;
    });
  }

  // ✅ GUARDAR
  guardar() {

    this.http.put(
      `${this.API}/api/pacientes/actualizar/${this.pacienteSeleccionado.idPaciente}`,
      this.pacienteSeleccionado,
      { headers: this.getHeaders() } // ✅ FIX
    ).subscribe();

    this.http.put(
      `${this.API}/api/usuarios/actualizar/${this.pacienteSeleccionado.usuarioId}`,
      {
        username: this.pacienteSeleccionado.username,
        password: this.pacienteSeleccionado.password
      },
      { headers: this.getHeaders() } // ✅ FIX
    ).subscribe(() => {

      this.mostrar('Paciente actualizado correctamente');

      this.pacienteSeleccionado = null;
      this.pacientes = [];

    });
  }
}