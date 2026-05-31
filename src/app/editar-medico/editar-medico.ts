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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-editar-medico',
  standalone: true,
  templateUrl: './editar-medico.html',
  styleUrls: ['./editar-medico.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDialogModule
  ]
})
export class EditarMedicoComponent {

  API = 'https://backend-proyecto-production-f013.up.railway.app';

  nombreBusqueda = '';
  medicos: any[] = [];
  medicoSeleccionado: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

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

  // ✅ BUSCAR
  buscar() {
    this.http.get<any[]>(
      `${this.API}/api/medico/buscar?nombre=${this.nombreBusqueda}`,
      { headers: this.getHeaders() }
    ).subscribe(data => {

      setTimeout(() => {
        this.medicos = data;
        this.cdr.detectChanges();
      });

    });
  }

  // ✅ SELECCIONAR (CORREGIDO)
  seleccionar(m: any) {
    this.medicoSeleccionado = { ...m };

    this.http.get<any>(
      `${this.API}/api/usuarios/por-medico/${m.medicoId}`,
      { headers: this.getHeaders() }
    )
    .subscribe({
      next: (user) => {
        this.medicoSeleccionado.username = user.username;

        // ❌ ELIMINADO → NO TRAER PASSWORD ENCRIPTADA
        // this.medicoSeleccionado.password = user.password;

        this.medicoSeleccionado.usuarioId = user.id;

        this.cdr.detectChanges();
      },
      error: () => {
        console.error('Usuario no encontrado');
      }
    });
  }

  // ✅ GUARDAR (CORREGIDO)
  guardar() {

    this.http.put(
      `${this.API}/api/medico/actualizar/${this.medicoSeleccionado.medicoId}`,
      this.medicoSeleccionado,
      { headers: this.getHeaders() }
    ).subscribe();

    if (this.medicoSeleccionado.usuarioId) {

      const data: any = {
        username: this.medicoSeleccionado.username
      };

      // ✅ SOLO enviar password si el usuario escribe uno nuevo
      if (this.medicoSeleccionado.password && this.medicoSeleccionado.password.trim() !== '') {
        data.password = this.medicoSeleccionado.password;
      }

      this.http.put(
        `${this.API}/api/usuarios/actualizar/${this.medicoSeleccionado.usuarioId}`,
        data,
        { headers: this.getHeaders() }
      ).subscribe(() => {

        this.mostrar('Médico actualizado');

        this.medicoSeleccionado = null;
        this.medicos = [];

      });
    }
  }

  // ✅ ELIMINAR
  eliminar() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        mensaje: '¿Seguro que deseas eliminar este médico?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.http.delete(
          `${this.API}/api/medico/eliminar/${this.medicoSeleccionado.medicoId}`,
          { headers: this.getHeaders() }
        ).subscribe(() => {

          this.mostrar('Médico eliminado correctamente');

          this.medicoSeleccionado = null;
          this.medicos = [];

        });

      }

    });
  }
}