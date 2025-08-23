// src/services/reclamation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export type ReclamationStatus = 'NOUVELLE' | 'EN_COURS' | 'RESOLUE';
const ALLOWED_STATUSES = ['NOUVELLE', 'EN_COURS', 'RESOLUE'] as const;

/** Normalise: trim + uppercase + supprime accents + remplace espaces/“-” par “_”
 *  Puis mappe quelques variantes tolérées (RESOLU -> RESOLUE, ENCOURS -> EN_COURS).
 */
function normalizeStatus(value: string | ReclamationStatus): ReclamationStatus {
  let raw = String(value ?? '');

  // Uppercase + suppression des diacritiques (accents)
  let s = raw
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Uniformiser séparateurs (espaces et tirets -> underscore)
  s = s.replace(/[\s\-]+/g, '_');

  // Mappings tolérants
  if (s === 'RESOLU') s = 'RESOLUE';
  if (s === 'ENCOURS') s = 'EN_COURS';
  if (s === 'ENCOUR') s = 'EN_COURS';
  if (s === 'EN_COUR') s = 'EN_COURS';

  if ((ALLOWED_STATUSES as readonly string[]).includes(s)) {
    return s as ReclamationStatus;
  }
  throw new Error(`Status invalide: "${value}". Attendus: ${ALLOWED_STATUSES.join(', ')}`);
}

/** 🔹 Pièce jointe (utilisée par la page Détails) */
export interface Attachment {
  id: string | number;
  fileName: string;
  fileType: string;
  size?: number;
  url?: string;
}

export interface ReclamationDto {
  id: number;
  objet: string;
  description: string;
  categorie: string;
  statut: ReclamationStatus | null;
  dateCreation: string | null;
  clientId?: number | null;
  clientNom?: string | null;
  fileName?: string | null;  // si tu stockes un seul fichier sur l'entité
  fileType?: string | null;
  attachments?: Attachment[]; // ⬅️ ajouté pour la compatibilité avec l'écran Détails
}

export interface Reponse {
  id: number;
  message: string;
  dateReponse: string;
  agent?: { id: number; nom: string; prenom: string } | null;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly base = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  /** POST multipart/form-data (clientId, categorie, objet, description, fichierJoint) */
  create(fd: FormData): Observable<ReclamationDto> {
    // Ne PAS forcer Content-Type: HttpClient le gère avec FormData
    return this.http.post<ReclamationDto>(`${this.base}/reclamations`, fd);
  }

  list(): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.base}/reclamations`);
  }

  get(id: number): Observable<ReclamationDto> {
    return this.http.get<ReclamationDto>(`${this.base}/reclamations/${id}`);
  }

  /** ✅ alias utilisé par le composant Détail */
  getReclamation(id: number): Observable<ReclamationDto> {
    return this.get(id);
  }

  /** PATCH /api/reclamations/{id}/status — body { "status": "NOUVELLE"|"EN_COURS"|"RESOLUE" } */
  updateReclamationStatus(id: number, status: ReclamationStatus | string): Observable<ReclamationDto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const normalized = normalizeStatus(status);
    return this.http.patch<ReclamationDto>(
      `${this.base}/reclamations/${id}/status`,
      { status: normalized },
      { headers }
    );
  }

  /** GET /api/reponses/reclamation/{reclamationId} */
  listReponsesByReclamation(reclamationId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.base}/reponses/reclamation/${reclamationId}`);
  }

  /**
   * POST /api/reponses/reclamation/{reclamationId}               (si agentId absent)
   * POST /api/reponses/reclamation/{reclamationId}/agent/{id}    (si agentId fourni)
   * Body attendu : { message }
   */
  createReponse(payload: { reclamationId: number; message: string; agentId?: number | null }): Observable<Reponse> {
    const hasAgent = payload.agentId !== undefined && payload.agentId !== null && !Number.isNaN(payload.agentId);
    const url = hasAgent
      ? `${this.base}/reponses/reclamation/${payload.reclamationId}/agent/${payload.agentId}`
      : `${this.base}/reponses/reclamation/${payload.reclamationId}`;

    return this.http.post<Reponse>(
      url,
      { message: payload.message },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  /** ✅ URL publique du fichier joint (cas “un seul fichier” sur l’entité) */
  attachmentUrl(reclamationId: number, _attachmentId?: string): string {
    // Adapte si ton backend expose une autre route
    return `${this.base}/reclamations/${reclamationId}/file`;
    // Pour un backend multi-fichiers, tu ferais plutôt:
    // return `${this.base}/reclamations/${reclamationId}/attachments/${_attachmentId}`;
  }
}
