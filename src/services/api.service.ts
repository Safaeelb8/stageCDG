import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Réclamations
  getReclamations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reclamations`);
  }

  addReclamation(reclamation: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reclamations`, reclamation);
  }

  updateReclamationStatus(reclamationId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/reclamations/${reclamationId}/status`, { status });
  }

  // Réponses
  getReponsesByReclamation(reclamationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reponses/reclamation/${reclamationId}`);
  }

  addReponse(reclamationId: number, agentId: number, message: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reponses/reclamation/${reclamationId}/agent/${agentId}`, message);
  }

  // Initialisation des données
  initializeData(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/init/data`, {});
  }
} 