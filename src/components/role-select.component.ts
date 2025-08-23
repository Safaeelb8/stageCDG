import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RoleService } from '../services/role.service';

@Component({
  standalone: true,
  selector: 'app-role-select',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatRippleModule],
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.css']
})
export class RoleSelectComponent {
  year = new Date().getFullYear();

  constructor(private router: Router, private roles: RoleService) {}

  goClient() {
    this.roles.setRole('Client');
    this.router.navigate(['/client/reclamations']);
  }

  goAgent() {
    this.roles.setRole('Agent');
    this.router.navigate(['/agent/reclamations']);
  }

  // Liens d'aide simples (tu pourras les pointer vers de vraies pages)
  mailto() { window.location.href = 'mailto:support@cdg.ma?subject=Assistance portail réclamations'; }
  call()   { window.location.href = 'tel:+212520000000'; }
  faq()    { alert('FAQ : lie ce bouton vers /faq quand la page sera prête.'); }
  legal(e: Event){ e.preventDefault(); alert('Mentions légales — à relier à ta page dédiée.'); }
  privacy(e: Event){ e.preventDefault(); alert('Protection des données — à relier à ta page dédiée.'); }
}
