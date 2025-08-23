// src/app/components/reclamation-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ReclamationService,
  ReclamationDto,
  Attachment
} from '../services/reclamation.service';

@Component({
  standalone: true,
  selector: 'app-reclamation-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './reclamation-detail.component.html',
  styleUrls: ['./reclamation-detail.component.css']
})
export class ReclamationDetailComponent implements OnInit {
  loading = true;
  error = '';
  data!: ReclamationDto;             // ⬅️ utilise le DTO du service (statut nullable)
  reclamationId!: number;

  constructor(private api: ReclamationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getReclamation(this.reclamationId).subscribe({
      next: d => {
        // Normalise les pièces jointes si backend ne renvoie qu’un seul fichier (fileName/fileType)
        if (!d.attachments && (d.fileName || d.fileType)) {
          d.attachments = [{
            id: 'file',
            fileName: d.fileName || 'fichier',
            fileType: d.fileType || 'application/octet-stream',
            url: this.api.attachmentUrl(this.reclamationId)   // id optionnel côté service
          }];
        }
        this.data = d;
        this.loading = false;
      },
      error: () => { this.error = 'Impossible de charger la réclamation'; this.loading = false; }
    });
  }

  get isAgent() { return this.router.url.startsWith('/agent'); }

  labelStatut(s?: string | null) {
    return s === 'NOUVELLE' ? 'Nouvelle'
         : s === 'EN_COURS' ? 'En cours'
         : s === 'RESOLUE'  ? 'Résolue'
         : '—';
  }

  chipClass(s?: string | null) {
    return s === 'RESOLUE'  ? 'chip chip--success'
         : s === 'EN_COURS' ? 'chip chip--warn'
         : s === 'NOUVELLE' ? 'chip chip--info'
         : 'chip';
  }

  iconFor(att: Attachment) {
    const t = (att.fileType || '').toLowerCase();
    if (t.startsWith('image/')) return '🖼️';
    if (t === 'application/pdf') return '📄';
    if (t.includes('zip') || t.includes('rar')) return '🗜️';
    if (t.includes('excel') || att.fileName?.match(/\.(xlsx?|csv)$/i)) return '📊';
    if (t.includes('word')  || att.fileName?.match(/\.(docx?)$/i))     return '📝';
    return '📎';
  }

  openAttachment(att: Attachment) {
    const url = att.url || this.api.attachmentUrl(this.reclamationId, String(att.id));
    window.open(url, '_blank');
  }

  backToList() {
    const base = this.isAgent ? '/agent' : '/client';
    this.router.navigate([base, 'reclamations']);
  }

  goReponses() {
    const base = this.isAgent ? '/agent' : '/client';
    this.router.navigate([base, 'reclamations', this.reclamationId, 'reponses']);
  }

  goNewResponse() {
  if (!this.isAgent) return;
  this.router.navigate(['/agent', 'reclamations', this.reclamationId, 'reponses', 'nouvelle']);
}

}
