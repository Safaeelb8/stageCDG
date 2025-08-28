// src/components/liste-reclamations.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReclamationService, ReclamationDto, ReclamationStatus } from '../services/reclamation.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-reclamations-list',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './liste-reclamations.component.html',
  styleUrls: ['./liste-reclamations.component.css']
})
export class ReclamationsListComponent implements OnInit {
  loading = true;
  error = '';
  reclamations: ReclamationDto[] = [];
  patching: Record<number, boolean> = {};

  constructor(private api: ReclamationService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void { this.refresh(); }

  refresh() {
    this.loading = true;
    const me = this.auth.me;

    if (!me) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
      this.loading = false;
      this.router.navigate(['/auth/login'], { queryParams: { role: 'CLIENT' } });
      return;
    }

    const obs = (me.role === 'CLIENT')
      ? this.api.listByClient(me.userId)
      : this.api.listAll();

    obs.subscribe({
      next: data => { this.reclamations = data; this.loading = false; },
      error: () => { this.error = 'Erreur lors du chargement des réclamations'; this.loading = false; }
    });
  }

  get isAgent(): boolean { return (this.auth.me?.role === 'AGENT'); }

  goNew() {
    const base = this.isAgent ? '/agent' : '/client';
    this.router.navigate([base, 'reclamations', 'nouvelle']);
  }

  goDetails(r: ReclamationDto) {
    const base = this.isAgent ? '/agent' : '/client';
    this.router.navigate([base, 'reclamations', r.id]);
  }

  goReponses(r: ReclamationDto) {
    const base = this.isAgent ? '/agent' : '/client';
    this.router.navigate([base, 'reclamations', r.id, 'reponses']);
  }

  labelStatut(s?: string) {
    return s === 'NOUVELLE' ? 'Nouvelle'
         : s === 'EN_COURS' ? 'En cours'
         : s === 'RESOLUE'  ? 'Résolue'
         : '—';
  }
  statusChip(s?: string) {
    return s === 'RESOLUE' ? 'chip--success'
         : s === 'EN_COURS' ? 'chip--warn'
         : 'chip--info';
  }
  countBy(status: ReclamationStatus) { return (this.reclamations || []).filter(r => r.statut === status).length; }
  trackById(_i: number, r: ReclamationDto) { return r.id; }

  private setStatus(r: ReclamationDto, status: ReclamationStatus) {
    if (!r?.id || this.patching[r.id]) return;
    this.patching[r.id] = true;

    const previous = r.statut;
    r.statut = status; // optimistic

    this.api.updateReclamationStatus(r.id, status).subscribe({
      next: updated => { r.statut = updated.statut; this.patching[r.id] = false; },
      error: err => { console.error('PATCH status error', err); r.statut = previous; this.patching[r.id] = false; }
    });
  }

  setEnCours(r: ReclamationDto)  { this.setStatus(r, 'EN_COURS'); }
  setResolue(r: ReclamationDto)  { this.setStatus(r, 'RESOLUE'); }
  setNouvelle(r: ReclamationDto) { this.setStatus(r, 'NOUVELLE'); }
}
