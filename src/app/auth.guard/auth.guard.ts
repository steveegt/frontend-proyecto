import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipoUsuario');

    // ✅ no logeado
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    // ✅ rol requerido (desde rutas)
    const roleRequired = route.data['role'];

    // ✅ validar rol
    if (roleRequired && tipo !== roleRequired) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}