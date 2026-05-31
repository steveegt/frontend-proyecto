import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menuadmin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menuadmin.html',
  styleUrls: ['./menuadmin.css']
})
export class MenuadminComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}