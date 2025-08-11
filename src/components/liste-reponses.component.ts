import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Reponse {
  id: number;
  message: string;
  dateReponse: string;
  agent: {
    id: number;
    nom: string;
    prenom: string;
  };
}

@Component({
  selector: 'app-liste-reponses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './liste-reponses.component.html',
  styleUrls: ['./liste-reponses.component.css']
})
export class ListeReponsesComponent implements OnInit {
  reponses: Reponse[] = [];
  reclamationId: number = 0;
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reclamationId = +params['id'];
      this.chargerReponses();
    });
  }

  chargerReponses() {
    this.loading = true;
    this.error = '';

    this.apiService.getReponsesByReclamation(this.reclamationId)
      .subscribe({
        next: (reponses) => {
          this.reponses = reponses;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des réponses';
          this.loading = false;
          console.error('Erreur:', error);
        }
      });
  }

  ajouterReponse() {
    this.router.navigate(['/reponse/ajouter', this.reclamationId]);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 