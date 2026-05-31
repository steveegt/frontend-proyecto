import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-ver-citas',
  standalone: true,
  templateUrl: './ver-citas.html',
  styleUrls: ['./ver-citas.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class VerCitasComponent implements OnInit {

  nombreBusqueda = '';
  citas: any[] = [];

  columnas: string[] = ['paciente', 'medico', 'fecha', 'hora', 'estado'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarTodas();
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

  // ✅ HEADER CON TOKEN
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // ✅ CARGAR TODAS
  cargarTodas() {
    this.http.get<any[]>(
      'http://localhost:8080/api/citas/todas',
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => {

        setTimeout(() => {
          this.citas = data;
          this.cdr.detectChanges();
        });

      },
      error: (err) => {
        this.mostrar(err.error?.message || '❌ Error al cargar citas');
      }
    });
  }

  // ✅ BUSCAR
  buscar() {

    if (!this.nombreBusqueda) {
      this.cargarTodas();
      return;
    }

    this.http.get<any[]>(
      `http://localhost:8080/api/citas/buscar?nombre=${this.nombreBusqueda}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => {

        setTimeout(() => {
          this.citas = data;
          this.cdr.detectChanges();
        });

      },
      error: (err) => {
        this.mostrar(err.error?.message || '❌ Error en la búsqueda');
      }
    });
  }

  // ✅ EXPORTAR PDF PROFESIONAL
  exportarPDF() {

    const doc = new jsPDF();

    const logo = new Image();
    logo.src = '/logo.png';

    logo.onload = () => {

      // ✅ HEADER AZUL
      doc.setFillColor(33, 150, 243);
      doc.rect(0, 0, 210, 30, 'F');

      // ✅ LOGO
      doc.addImage(logo, 'PNG', 10, 5, 20, 20);

      // ✅ TÍTULO
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('REPORTE DE CITAS', 105, 18, { align: 'center' });

      // ✅ FECHA
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 40);

      // ✅ DATOS
      const filas = this.citas.map(c => [
        c.nombrePaciente,
        c.nombreMedico,
        c.fecha,
        c.hora,
        c.estado
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['Paciente', 'Médico', 'Fecha', 'Hora', 'Estado']],
        body: filas,
        theme: 'grid',

        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          halign: 'center'
        },

        bodyStyles: {
          halign: 'center'
        },

        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });

      doc.save('reporte-citas.pdf');
    };

    // ✅ fallback si falla logo
    logo.onerror = () => {
      this.mostrar('⚠️ No se pudo cargar el logo, generando PDF simple...');

      const filas = this.citas.map(c => [
        c.nombrePaciente,
        c.nombreMedico,
        c.fecha,
        c.hora,
        c.estado
      ]);

      autoTable(doc, {
        head: [['Paciente', 'Médico', 'Fecha', 'Hora', 'Estado']],
        body: filas
      });

      doc.save('reporte-citas.pdf');
    };
  }
}