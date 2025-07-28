import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AjoutReclamationComponent } from './components/ajout-reclamation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AjoutReclamationComponent, MatIconModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>
          <mat-icon>business</mat-icon>
          Système de Gestion des Réclamations - CDG
        </h1>
      </header>
      <main>
        <app-ajout-reclamation></app-ajout-reclamation>
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
    }
  `]
})
export class App {
  name = 'Angular Réclamations CDG';
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule, MatIconModule)
  ]
});