import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menumedico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menumedico.html',
  styleUrls: ['./menumedico.css']
})
export class MenumedicoComponent implements OnInit {

  // ✅ URL BACKEND
  API = 'https://backend-proyecto-production-f013.up.railway.app';

  nombreUsuario: string = '';
  mostrarPerfil: boolean = false;
  medico: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    const token: any = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);

      this.nombreUsuario = decoded.sub;

      this.http.get<any>(
        `${this.API}/api/medico/mi-perfil`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .subscribe({
        next: (res) => {
          this.medico = res;
        },
        error: (err) => {
          console.error('Error al obtener perfil médico', err);
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