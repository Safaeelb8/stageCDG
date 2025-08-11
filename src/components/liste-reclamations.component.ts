import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';

interface Reclamation {
  id: number;
  categorie: string;
  objet: string;
  description: string;
  dateCreation: string;
  statut: string; // ex: 'NOUVELLE' | 'EN_COURS' | ...
  client: { id: number; nom: string; email: string; };
}

@Component({
  selector: 'app-liste-reclamations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `<!-- identique à ton template -->`,
  styles: [`/* identiques à tes styles */`]
})
export class ListeReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  loading = true;
  error = '';
  isAgent = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public router: Router
  ) {
    const user = this.authService.getCurrentUser();
    // Vérifie bien la valeur réelle renvoyée par le back (ex: "AGENT" ou "ROLE_AGENT")
    this.isAgent = user?.role === 'ROLE_AGENT' || user?.role === 'AGENT';
  }

  ngOnInit(): void {
    this.chargerReclamations();
  }

  chargerReclamations(): void {
    this.loading = true;
    this.error = '';
    this.apiService.getReclamations().subscribe({
      next: (recs) => { this.reclamations = recs; this.loading = false; },
      error: (err) => {
        this.error = 'Erreur lors du chargement des réclamations';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  trackByRecId = (_: number, r: Reclamation) => r.id;

  voirReponses(id: number) { this.router.navigate(['/reponses', id]); }
  ajouterReponse(id: number) { this.router.navigate(['/reponse/ajouter', id]); }
  ajouterReclamation() { this.router.navigate(['/reclamations']); }

  updateStatus(id: number, newStatus: string): void {
    this.apiService.updateReclamationStatus(id, newStatus).subscribe({
      next: () => {
        const r = this.reclamations.find(x => x.id === id);
        if (r) r.statut = newStatus;
      },
      error: (e) => console.error('Erreur lors de la mise à jour du statut:', e)
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getStatusColor(statut: string): 'primary' | 'accent' | 'warn' {
    switch (statut) {
      case 'EN_COURS':   return 'accent';
      case 'TRAITEE':    return 'primary';
      case 'EN_ATTENTE': return 'warn';
      case 'FERMEE':     return 'warn';
      default:           return 'primary'; // NOUVELLE + fallback
    }
  }
}
