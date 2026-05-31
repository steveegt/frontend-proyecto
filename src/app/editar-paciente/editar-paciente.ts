import { Component } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';


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

  nombreBusqueda = '';
  pacientes: any[] = [];
  pacienteSeleccionado: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
      private cdr: ChangeDetectorRef
  ) {}

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

 buscar() {
  this.http.get<any[]>(
    `http://localhost:8080/api/pacientes/buscar?nombre=${this.nombreBusqueda}`
  ).subscribe({
    next: (data) => {
      this.pacientes = data;

      this.cdr.detectChanges(); 
    }
  });
}

  seleccionar(p: any) {
    this.pacienteSeleccionado = { ...p };

    // 🔥 TRAER USUARIO
    this.http.get<any>(`http://localhost:8080/api/usuarios/por-paciente/${p.idPaciente}`)
      .subscribe(user => {
        this.pacienteSeleccionado.username = user.username;
        this.pacienteSeleccionado.password = user.password;
        this.pacienteSeleccionado.usuarioId = user.id;
      });
  }

  guardar() {

    // ✅ UPDATE PACIENTE
    this.http.put(
      `http://localhost:8080/api/pacientes/actualizar/${this.pacienteSeleccionado.idPaciente}`,
      this.pacienteSeleccionado
    ).subscribe();

    // ✅ UPDATE USUARIO
    this.http.put(
      `http://localhost:8080/api/usuarios/actualizar/${this.pacienteSeleccionado.usuarioId}`,
      {
        username: this.pacienteSeleccionado.username,
        password: this.pacienteSeleccionado.password
      }
    ).subscribe(() => {
      this.mostrar('✅ Paciente actualizado correctamente');
      this.pacienteSeleccionado = null;
      this.pacientes = [];
    });
  }
}