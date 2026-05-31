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

  // ✅ CITAS PENDIENTES
  citas: any[] = [];

  // ✅ CITAS AGENDADAS
  citasAgendadas: any[] = [];

  // ✅ COLUMNAS
  displayedColumns: string[] = ['paciente', 'fecha', 'hora', 'estado', 'acciones'];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  // ✅ INIT
  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerAgendadas();
  }

  // ✅ HEADERS JWT
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // ✅ MENSAJES
  mostrarMensaje(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // ✅ OBTENER CITAS PENDIENTES
  obtenerCitas() {
    this.http.get<any[]>(`/api/citas/citas-medico`, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: (data) => {
        this.citas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('❌ Error cargando citas');
      }
    });
  }

  // ✅ OBTENER CITAS AGENDADAS
  obtenerAgendadas() {
    this.http.get<any[]>(`/api/citas/citas-medico-agendadas`, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: (data) => {
        this.citasAgendadas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('❌ Error cargando agendadas');
      }
    });
  }

  // ✅ ACEPTAR CITA
  aceptar(id: number) {
    this.http.put(`/api/citas/aceptar/${id}`, {}, {
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

  // ✅ RECHAZAR CITA
  rechazar(id: number) {
    this.http.put(`/api/citas/rechazar/${id}`, {}, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: () => {
        this.obtenerCitas();
        this.obtenerAgendadas();
        this.mostrarMensaje('❌ Cita rechazada y enviada a otro médico');
      },
      error: () => {
        this.mostrarMensaje('❌ Error al rechazar');
      }
    });
  }
}