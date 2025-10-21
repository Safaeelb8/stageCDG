import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../services/reclamation.service';

type UiMsg = {
  id: number;
  message: string;
  date: Date;
  time: string;
  author: string;
  initials: string;
  role: 'agent' | 'client';   // ➜ pour la couleur
  mine: boolean;              // ➜ alignement à droite
};
type UiGroup = { key: string; label: string; items: UiMsg[] };

@Component({
  standalone: true,
  selector: 'app-reponses-list',
  imports: [CommonModule],
  templateUrl: './liste-reponses.component.html',
  styleUrls: ['./liste-reponses.component.css']
})
export class ReponsesListComponent implements OnInit {
  reclamationId = 0;
  loading = true;
  error = '';
  groups: UiGroup[] = [];

  constructor(private api: ReclamationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    this.api.listReponsesByReclamation(this.reclamationId).subscribe({
      next: (data) => {
        const isViewerAgent = this.isAgent;

        const msgs: UiMsg[] = (data || [])
          .map((r) => {
            const d = new Date(r.dateReponse);
            const isAgentMsg = !!r.agent;

            // auteur lisible et robuste (évite "undefined")
            const parts: string[] = [];
            if (r.agent?.prenom) parts.push(r.agent.prenom);
            if (r.agent?.nom) parts.push(r.agent.nom);
            const fallback = isAgentMsg ? 'Agent' : 'Utilisateur';
            const author = (parts.join(' ') || fallback).trim();

            const initials = this.makeInitials(author);

            // ⬇️ Forcer le type littéral pour éviter l'élargissement en string
            const role: UiMsg['role'] = isAgentMsg ? 'agent' : 'client';
            const mine: boolean = (isViewerAgent && isAgentMsg) || (!isViewerAgent && !isAgentMsg);

            return {
              id: r.id,
              message: r.message,
              date: d,
              time: this.formatTime(d),
              author,
              initials,
              role,
              mine
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime()); // plus récent en premier

        // grouper par jour
        const map = new Map<string, UiMsg[]>();
        for (const m of msgs) {
          const key = this.dateKey(m.date);
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(m);
        }
        this.groups = Array.from(map.entries())
          .map(([key, items]) => ({
            key,
            label: this.labelFor(key),
            items
          }))
          .sort((a, b) => (a.key < b.key ? 1 : -1)); // date desc

        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des réponses';
        this.loading = false;
      }
    });
  }

  get isAgent(): boolean { return this.router.url.startsWith('/agent'); }

  goNew() {
    if (!this.isAgent) return;
    this.router.navigate(['/agent/reclamations', this.reclamationId, 'reponses', 'nouvelle']);
  }

  goBack() {
    const base = this.isAgent ? '/agent' : '/client';
    this.router.navigate([base, 'reclamations', this.reclamationId]);
  }

  // helpers
  private makeInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const one = (s:string)=> s[0]?.toUpperCase() ?? '';
    if (parts.length >= 2) return one(parts[0]) + one(parts[1]);
    if (parts.length === 1) return one(parts[0]);
    return 'UA';
  }
  private dateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private labelFor(key: string): string {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
  private formatTime(d: Date): string {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
