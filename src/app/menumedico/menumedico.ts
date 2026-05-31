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

  API = 'https://backend-proyecto-production-f013.up.railway.app';

  nombreUsuario: string = '';
  mostrarPerfil: boolean = false;
  medico: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    const token: any = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      this.nombreUsuario = decoded.sub;
    } catch (e) {
      console.error('❌ Error con token');
      this.logout();
      return;
    }

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

  // ✅ 🔥 MÉTODO CLAVE (NAVEGACIÓN)
  irACitas() {
    console.log("✅ NAVEGANDO A CITAS");
    this.router.navigate(['/citas-medico']);
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