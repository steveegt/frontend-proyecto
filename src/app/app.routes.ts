import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';

import { MenuclienteComponent } from './menucliente/menucliente';
import { MenumedicoComponent } from './menumedico/menumedico';
import { MenuadminComponent } from './menuadmin/menuadmin';

import { RegistrarPacienteComponent } from './registrar-paciente/registrar-paciente';
import { RegistrarMedicoComponent } from './registrar-medico/registrar-medico';

import { EditarPacienteComponent } from './editar-paciente/editar-paciente';
import { EditarMedicoComponent } from './editar-medico/editar-medico';

import { CitasComponent } from './citas/citas';
import { CitasMedicoComponent } from './citas-medico/citas-medico';

import { VerCitasComponent } from './ver-citas/ver-citas';

import { AuthGuard } from './auth.guard/auth.guard';

export const routes: Routes = [

  // ✅ LOGIN
  { path: '', component: LoginComponent },

  // ===============================
  // ✅ ADMIN
  // ===============================
  {
    path: 'menuadmin',
    component: MenuadminComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'ver-citas',
    component: VerCitasComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'registrar-paciente',
    component: RegistrarPacienteComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'registrar-medico',
    component: RegistrarMedicoComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'editar-medico',
    component: EditarMedicoComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'editar-paciente',
    component: EditarPacienteComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

  // ===============================
  // ✅ PACIENTE
  // ===============================
  {
    path: 'menucliente',
    component: MenuclienteComponent,
    canActivate: [AuthGuard],
    data: { role: 'PACIENTE' }
  },
  {
    path: 'citas',
    component: CitasComponent,
    canActivate: [AuthGuard],
    data: { role: 'PACIENTE' }
  },

  // ===============================
  // ✅ MÉDICO 🔥 AQUÍ ESTABA EL ERROR
  // ===============================
  {
    path: 'menu-medico',
    component: MenumedicoComponent,
    canActivate: [AuthGuard],
    data: { role: 'MEDICO' }
  },
  {
    path: 'citas-medico',
    component: CitasMedicoComponent,
    canActivate: [AuthGuard],
    data: { role: 'MEDICO' }
  },

  // ===============================
  // ✅ WILDCARD
  // ===============================
  { path: '**', redirectTo: '' }

];