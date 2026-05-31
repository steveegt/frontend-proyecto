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

  ngOnInit(): void {
    this.obtenerCitas();
    this.obtenerAgendadas(); // ✅ NUEVO
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

  // ✅ CITAS PENDIENTES
  obtenerCitas() {
    this.http.get<any[]>('http://localhost:8080/api/citas/citas-medico', {
      headers: this.getHeaders()
    })
    .subscribe({
      next: (data) => {
        this.citas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ CITAS AGENDADAS
  obtenerAgendadas() {
    this.http.get<any[]>('http://localhost:8080/api/citas/citas-medico-agendadas', {
      headers: this.getHeaders()
    })
    .subscribe({
      next: (data) => {
        this.citasAgendadas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ ACEPTAR
  aceptar(id: number) {
    this.http.put(`http://localhost:8080/api/citas/aceptar/${id}`, {}, {
      headers: this.getHeaders()
    })
    .subscribe(() => {
      this.obtenerCitas();
      this.obtenerAgendadas(); // ✅ refresca ambas listas
      this.mostrarMensaje('✅ Cita aceptada');
    });
  }

  // ✅ RECHAZAR
  rechazar(id: number) {
    this.http.put(`http://localhost:8080/api/citas/rechazar/${id}`, {}, {
      headers: this.getHeaders()
    })
    .subscribe(() => {
      this.obtenerCitas();
      this.obtenerAgendadas(); // ✅ refresca ambas listas
      this.mostrarMensaje('❌ Cita rechazada y enviada a otro médico');
    });
  }
}