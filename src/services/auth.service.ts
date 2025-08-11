import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

type User = {
  id: number;
  username: string;
  role: string;
  nom: string;
  email: string;
};

type LoginResponse =
  | { user: User; token?: string } // backend renvoie un wrapper
  | User;                          // backend renvoie directement l'utilisateur

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /** username OU email dans "identifier" */
  login(identifier: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { identifier, password })
      .pipe(
        tap((res) => {
          // Normaliser la réponse
          const user: User = (res as any).user ?? (res as User);
          const token = (res as any).token ?? 'dummy';

          // Stockage local (nécessaire pour guards/interceptors)
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  register(user: Partial<User> & { password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
