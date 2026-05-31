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

  // ✅ CORREGIDO (tenías "constructorconstructor")
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    const token: any = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);

      // ✅ USERNAME DEL TOKEN
      this.nombreUsuario = decoded.sub;

      // ✅ TRAER PERFIL DEL PACIENTE
      this.http.get<any>('http://localhost:8080/api/pacientes/mi-perfil')
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

  // ✅ NUEVO: LOGOUT
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}