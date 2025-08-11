import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { AjoutReclamationComponent } from './components/ajout-reclamation.component';
import { AjoutReponseComponent } from './components/ajout-reponse.component';
import { ListeReponsesComponent } from './components/liste-reponses.component';
import { ListeReclamationsComponent } from './components/liste-reclamations.component';
import { LoginComponent } from './components/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';                 // ⬅️ NgIf


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
        NgIf,                   // ⬅️ nécessaire pour *ngIf

    AjoutReclamationComponent, 
    AjoutReponseComponent, 
    ListeReponsesComponent, 
    ListeReclamationsComponent, 
    LoginComponent,
    MatIconModule, 
    RouterOutlet
  ],
  template: `
    <div class="app-container">
      <header class="app-header" *ngIf="isLoggedIn">
        <h1>
          <mat-icon>business</mat-icon>
          Système de Gestion des Réclamations - CDG
        </h1>
        <nav class="nav-menu">
          <a routerLink="/liste-reclamations" class="nav-link">
            <mat-icon>list</mat-icon>
            Liste des réclamations
          </a>
          <a routerLink="/reclamations" class="nav-link">
            <mat-icon>add</mat-icon>
            Nouvelle réclamation
          </a>
          <button (click)="logout()" class="nav-link logout-btn">
            <mat-icon>exit_to_app</mat-icon>
            Déconnexion
          </button>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <p>&copy; 2025 Caisse de Dépôt et de Gestion. Tous droits réservés.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
      backdrop-filter: blur(10px);
    }

    .app-header h1 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-menu {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: background-color 0.3s ease;
      font-weight: 500;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      margin-left: auto;
    }

    main {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .app-footer {
      background: linear-gradient(135deg, #2c3e50, #34495e);
      color: white;
      text-align: center;
      padding: 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    }

    .app-footer p {
      margin: 0;
    }

    @media (max-width: 600px) {
      .app-header {
        padding: 1.2rem;
      }

      .app-header h1 {
        font-size: 1.4rem;
      }

      .nav-menu {
        flex-direction: column;
      }

      .logout-btn {
        margin-left: 0;
      }
    }
  `]
})
export class App {
  name = 'Angular Réclamations CDG';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      MatSnackBarModule,
      MatIconModule
    )
  ]
});
