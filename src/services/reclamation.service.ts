// src/app/services/reclamation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export type ReclamationStatus = 'NOUVELLE' | 'EN_COURS' | 'RESOLUE';
const ALLOWED_STATUSES = ['NOUVELLE', 'EN_COURS', 'RESOLUE'] as const;

function normalizeStatus(value: string | ReclamationStatus): ReclamationStatus {
  let raw = String(value ?? '');
  let s = raw.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[\s\-]+/g, '_');
  if (s === 'RESOLU') s = 'RESOLUE';
  if (s === 'ENCOURS' || s === 'EN_COUR') s = 'EN_COURS';
  if ((ALLOWED_STATUSES as readonly string[]).includes(s)) return s as ReclamationStatus;
  throw new Error(`Status invalide: "${value}". Attendus: ${ALLOWED_STATUSES.join(', ')}`);
}

export interface Attachment { id: string | number; fileName: string; fileType: string; size?: number; url?: string; }
export interface ReclamationDto {
  id: number;
  objet: string;
  description: string;
  categorie: string;
  statut: ReclamationStatus | null;
  dateCreation: string | null;
  clientId?: number | null;
  clientNom?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  attachments?: Attachment[];
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

  /** POST multipart/form-data — backend lit @RequestParam + @RequestPart */
  create(fd: FormData): Observable<ReclamationDto> {
    return this.http.post<ReclamationDto>(`${this.base}/reclamations`, fd);
  }

  /** Toutes les réclamations (AGENT) */
  listAll(): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.base}/reclamations`);
  }

  /** Réclamations d'un client (CLIENT) */
  listByClient(clientId: number): Observable<ReclamationDto[]> {
    const params = new HttpParams().set('clientId', String(clientId));
    return this.http.get<ReclamationDto[]>(`${this.base}/reclamations`, { params });
  }

  get(id: number): Observable<ReclamationDto> {
    return this.http.get<ReclamationDto>(`${this.base}/reclamations/${id}`);
  }
  getReclamation(id: number) { return this.get(id); }

  /** PATCH statut — body JSON { status } (backend tolère aussi ?status=) */
  updateReclamationStatus(id: number, status: ReclamationStatus | string): Observable<ReclamationDto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const normalized = normalizeStatus(status);
    return this.http.patch<ReclamationDto>(`${this.base}/reclamations/${id}/status`, { status: normalized }, { headers });
  }

  /** Réponses */
  listReponsesByReclamation(reclamationId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.base}/reponses/reclamation/${reclamationId}`);
  }
  createReponse(payload: { reclamationId: number; message: string; agentId?: number | null }): Observable<Reponse> {
    const hasAgent = payload.agentId != null && !Number.isNaN(payload.agentId);
    const url = hasAgent
      ? `${this.base}/reponses/reclamation/${payload.reclamationId}/agent/${payload.agentId}`
      : `${this.base}/reponses/reclamation/${payload.reclamationId}`;
    return this.http.post<Reponse>(url, { message: payload.message }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  attachmentUrl(reclamationId: number): string {
    return `${this.base}/reclamations/${reclamationId}/file`;
  }
}
