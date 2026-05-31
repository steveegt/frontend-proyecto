import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/* MATERIAL */
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-citas',
  standalone: true,
  templateUrl: './citas.html',
  styleUrls: ['./citas.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule,
    MatSnackBarModule
  ]
})
export class CitasComponent implements OnInit {

  citaForm: FormGroup;
  citas: any[] = [];

  displayedColumns: string[] = ['fecha', 'hora', 'estado', 'acciones'];

  horarios: string[] = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00"
  ];

  horariosOcupados: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      observacion: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerCitas();

    this.citaForm.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.cargarHorariosOcupados(fecha);
      }
    });
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  filtroFechas = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    const dia = fecha.getDay();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return dia !== 0 && dia !== 6 && fecha >= hoy;
  };

  cargarHorariosOcupados(fecha: Date) {

    const fechaStr = this.formatearFecha(fecha);

    this.http.get<string[]>(
      `/api/citas/horarios-no-disponibles?fecha=${fechaStr}`
    )
    .subscribe({
      next: (data) => {
        this.horariosOcupados = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarMensaje('❌ Error cargando horarios');
      }
    });
  }

  crearCita() {

    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    const fecha = this.citaForm.value.fecha;

    const cita = {
      fecha: this.formatearFecha(fecha),
      hora: this.citaForm.value.hora,
      observacion: this.citaForm.value.observacion
    };

    this.http.post(`/api/citas/crear`, cita, {
      headers: this.getHeaders()
    })
    .subscribe({
      next: () => {
        this.obtenerCitas();
        this.citaForm.reset();
        this.mostrarMensaje('✅ Cita creada');
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.message || '❌ Sin disponibilidad');
      }
    });
  }

  formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  obtenerCitas() {
    this.http.get<any[]>(`/api/citas/mis-citas`, {
      headers: this.getHeaders()
    })
    .subscribe(data => {
      this.citas = data;
      this.cdr.detectChanges();
    });
  }

  cancelar(id: number) {
    this.http.put(`/api/citas/cancelar/${id}`, {}, {
      headers: this.getHeaders()
    })
    .subscribe(() => {
      this.obtenerCitas();
      this.mostrarMensaje('❌ Cita cancelada');
    });
  }

  reprogramar(cita: any) {

    const nuevaFecha = prompt('Nueva fecha (YYYY-MM-DD)');
    const nuevaHora = prompt('Nueva hora');

    if (!nuevaFecha || !nuevaHora) return;

    this.http.put(`/api/citas/reprogramar/${cita.id}`, {
      fecha: nuevaFecha,
      hora: nuevaHora
    }, {
      headers: this.getHeaders()
    })
    .subscribe(() => {
      this.obtenerCitas();
      this.mostrarMensaje('🔄 Reprogramada');
    });
  }
}