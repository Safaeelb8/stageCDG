import { Component, HostListener } from '@angular/core';
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

  // état pour l’effet “tilt + glow” des deux cartes
  cards = [
    { mx: 0, my: 0, rx: 0, ry: 0 },
    { mx: 0, my: 0, rx: 0, ry: 0 }
  ];

  constructor(private router: Router, private roles: RoleService) {}

  onMove(ev: MouseEvent, i: number, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    const x = ev.clientX - r.left;
    const y = ev.clientY - r.top;
    this.cards[i].mx = x;
    this.cards[i].my = y;

    // tilt doux (±6°) selon la position du curseur
    const px = (x / r.width) - 0.5;
    const py = (y / r.height) - 0.5;
    this.cards[i].ry = 8 * px;       // tourne autour de Y
    this.cards[i].rx = -8 * py;      // tourne autour de X
  }
  onLeave(i: number) { this.cards[i] = { mx: 0, my: 0, rx: 0, ry: 0 }; }

  goClient() {
    this.roles.setRole('CLIENT');
    this.router.navigate(['/auth/login'], { queryParams: { role: 'CLIENT' } });
  }
  goAgent() {
    this.roles.setRole('AGENT');
    this.router.navigate(['/auth/login'], { queryParams: { role: 'AGENT' } });
  }

  // Liens d’aide
  mailto(){ window.location.href = 'mailto:support@cdg.ma?subject=Assistance portail réclamations'; }
  call(){   window.location.href = 'tel:+212520000000'; }
  faq(){    alert('FAQ : lie ce bouton vers /faq quand la page sera prête.'); }
  legal(e: Event){ e.preventDefault(); alert('Mentions légales — à relier à ta page dédiée.'); }
  privacy(e: Event){ e.preventDefault(); alert('Protection des données — à relier à ta page dédiée.'); }
}
