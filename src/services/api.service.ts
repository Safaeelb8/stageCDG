import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // POST /api/reclamations?clientId=1 (multipart)
  createWithRequestParam(clientId: number, fd: FormData): Observable<any> {
    const params = new HttpParams().set('clientId', String(clientId));
    return this.http.post(`${this.base}/reclamations`, fd, { params });
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/reclamations`);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/reclamations/${id}`);
  }
}
