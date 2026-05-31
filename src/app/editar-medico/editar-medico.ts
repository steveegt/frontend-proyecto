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

// ✅ NUEVO IMPORT
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

  // ✅ BUSCAR MÉDICOS
  buscar() {
    this.http.get<any[]>(
      `http://localhost:8080/api/medico/buscar?nombre=${this.nombreBusqueda}`
    ).subscribe(data => {

      setTimeout(() => {
        this.medicos = data;
        this.cdr.detectChanges();
      });

    });
  }

  // ✅ SELECCIONAR MÉDICO
  seleccionar(m: any) {
    this.medicoSeleccionado = { ...m };

    this.http.get<any>(`http://localhost:8080/api/usuarios/por-medico/${m.medicoId}`)
      .subscribe({
        next: (user) => {
          this.medicoSeleccionado.username = user.username;
          this.medicoSeleccionado.password = user.password;
          this.medicoSeleccionado.usuarioId = user.id;

          this.cdr.detectChanges();
        },
        error: () => {
          console.error('Usuario no encontrado');
        }
      });
  }

  // ✅ GUARDAR
  guardar() {

    this.http.put(
      `http://localhost:8080/api/medico/actualizar/${this.medicoSeleccionado.medicoId}`,
      this.medicoSeleccionado
    ).subscribe();

    if (this.medicoSeleccionado.usuarioId) {
      this.http.put(
        `http://localhost:8080/api/usuarios/actualizar/${this.medicoSeleccionado.usuarioId}`,
        {
          username: this.medicoSeleccionado.username,
          password: this.medicoSeleccionado.password
        }
      ).subscribe(() => {

        this.mostrar('✅ Médico actualizado');

        this.medicoSeleccionado = null;
        this.medicos = [];

      });
    }
  }

  // ✅ ELIMINAR CON DIALOG BONITO
  eliminar() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        mensaje: '¿Seguro que deseas eliminar este médico? Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.http.delete(
          `http://localhost:8080/api/medico/eliminar/${this.medicoSeleccionado.medicoId}`
        ).subscribe(() => {

          this.mostrar('🗑️ Médico eliminado correctamente');

          this.medicoSeleccionado = null;
          this.medicos = [];

        });

      }

    });
  }
}
