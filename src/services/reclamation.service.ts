// src/app/services/reclamation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8080/api/reclamations'; // ⚠️ adapte le port si besoin

  constructor(private http: HttpClient) {}

  submitReclamation(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
