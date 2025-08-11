import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Connexion</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="fill">
              <mat-label>Nom d'utilisateur ou Email</mat-label>
              <input matInput [(ngModel)]="identifier" name="identifier" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">
              Se connecter
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [/* tes styles inchangés */]
})
export class LoginComponent {
  identifier = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.identifier, this.password).subscribe({
      next: () => {
        // Le service a déjà stocké token/user.
        this.router.navigate(['/liste-reclamations']);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
      }
    });
  }
}
