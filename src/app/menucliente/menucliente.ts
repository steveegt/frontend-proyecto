import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menucliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menucliente.html',
  styleUrls: ['./menucliente.css']
})
export class MenuclienteComponent implements OnInit {

  nombreUsuario: string = '';
  mostrarPerfil: boolean = false;
  paciente: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    const token: any = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);

      this.nombreUsuario = decoded.sub;

      this.http.get<any>(`/api/pacientes/mi-perfil`)
        .subscribe({
          next: (res) => {
            this.paciente = res;
          },
          error: (err) => {
            console.error('Error al obtener perfil', err);
          }
        });
    }
  }

  abrirPerfil() {
    this.mostrarPerfil = true;
  }

  cerrarPerfil() {
    this.mostrarPerfil = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}