import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/* ✅ ANGULAR MATERIAL */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  API = 'https://backend-proyecto-production-f013.up.railway.app';

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  login() {

    if (this.loginForm.invalid) return;

    this.http.post<any>(
      `${this.API}/auth/login`,
      this.loginForm.value
    )
    .subscribe({
      next: (res) => {

        // 🔥 VER QUÉ DEVUELVE EL BACKEND
        console.log("🔥 RESPUESTA BACKEND:", res);

        // ✅ LIMPIAR datos viejos
        localStorage.clear();

        // 🔥 DETECTAR TOKEN (POR SI VIENE CON OTRO NOMBRE)
        const token = res.token || res.accessToken || res.data?.token;

        if (!token) {
          alert('❌ ERROR: El backend NO está enviando token');
          console.error("❌ TOKEN NO ENCONTRADO EN RESPUESTA:", res);
          return;
        }

        // ✅ GUARDAR CORRECTO
        localStorage.setItem('token', token);
        localStorage.setItem('tipoUsuario', res.tipoUsuario);

        console.log("✅ TOKEN GUARDADO:", token);

        // ✅ REDIRECCIÓN
        switch (res.tipoUsuario) {
          case 'PACIENTE':
            this.router.navigate(['/menucliente']);
            break;

          case 'MEDICO':
            this.router.navigate(['/menumedico']);
            break;

          case 'ADMIN':
            this.router.navigate(['/menuadmin']);
            break;

          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('❌ Error login', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}