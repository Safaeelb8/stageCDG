// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../environments/environment';

export type Role = 'CLIENT' | 'AGENT';
export interface AuthResponse { token: string; userId: number; role: Role; nom: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/api/auth`;
  constructor(private http: HttpClient) {}

  /** Sauvegarde unique de la session */
  setSession(res: AuthResponse) {
    localStorage.setItem('auth', JSON.stringify(res));
    sessionStorage.removeItem('selectedRole');
  }

  register(role: Role, payload: { email:string; password:string; nom:string; prenom:string }): Observable<AuthResponse> {
    const params = new HttpParams().set('role', role);
    return this.http.post<AuthResponse>(`${this.base}/register`, payload, { params }).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(payload: { email:string; password:string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload).pipe(
      tap(res => this.setSession(res))
    );
  }

  /** ➜ Empêche "je choisis CLIENT" mais je me loggue en AGENT (ou inverse) */
  loginWithRole(role: Role, payload: { email:string; password:string }): Observable<AuthResponse> {
    return this.login(payload).pipe(
      map(res => {
        if (res.role !== role) {
          throw new HttpErrorResponse({
            status: 403,
            error: { message: `Rôle incompatible: ce compte est ${res.role}, vous avez choisi ${role}.` }
          });
        }
        return res;
      })
    );
  }

  logout() { localStorage.removeItem('auth'); }
  get me(): AuthResponse | null { try { return JSON.parse(localStorage.getItem('auth') || 'null'); } catch { return null; } }
}
