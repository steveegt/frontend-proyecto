import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-citas-medico',
  standalone: true,
  templateUrl: './citas-medico.html',
  styleUrls: ['./citas-medico.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule
  ]
})
export class CitasMedicoComponent implements OnInit {

  // ✅ URL BASE DEL BACKEND
  API = 'https://backend-proyecto-production-f013.up.railway.app';

  citas: any[] = [];
  citasAgendadas: any[] = [];

  displayedColumns: string[] = ['paciente', 'fecha', 'hora', 'estado', 'acciones'];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerAgendadas();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  mostrarMensaje(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // ✅ PENDIENTES
  obtenerCitas() {
    this.http.get<any[]>(`${this.API}/api/citas/citas-medico`, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: (data) => {
        this.citas = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarMensaje('❌ Error cargando citas');
      }
    });
  }

  // ✅ AGENDADAS
  obtenerAgendadas() {
    this.http.get<any[]>(`${this.API}/api/citas/citas-medico-agendadas`, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: (data) => {
        this.citasAgendadas = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarMensaje('❌ Error cargando agendadas');
      }
    });
  }

  // ✅ ACEPTAR
  aceptar(id: number) {
    this.http.put(`${this.API}/api/citas/aceptar/${id}`, {}, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: () => {
        this.obtenerCitas();
        this.obtenerAgendadas();
        this.mostrarMensaje('✅ Cita aceptada');
      },
      error: () => {
        this.mostrarMensaje('❌ Error al aceptar');
      }
    });
  }

  // ✅ RECHAZAR
  rechazar(id: number) {
    this.http.put(`${this.API}/api/citas/rechazar/${id}`, {}, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: () => {
        this.obtenerCitas();
        this.obtenerAgendadas();
        this.mostrarMensaje('❌ Cita rechazada');
      },
      error: () => {
        this.mostrarMensaje('❌ Error al rechazar');
      }
    });
  }
}