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

    // ✅ SOLO UNA PETICIÓN (CORRECTA)
    this.http.post<any>(
      'https://backend-proyecto-production-f013.up.railway.app/auth/login',
      this.loginForm.value
    )
    .subscribe({
      next: (res) => {

        localStorage.setItem('token', res.token);
        localStorage.setItem('tipoUsuario', res.tipoUsuario);

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
        console.error('Error login', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}