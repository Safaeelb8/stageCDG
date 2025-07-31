import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ReclamationService } from '../services/reclamation.service';

interface ReclamationData {
  categorie: string;
  objet: string;
  description: string;
  fichierJoint?: File;
}

@Component({
  selector: 'app-ajout-reclamation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="reclamation-container">
      <mat-card class="reclamation-form-card">
        <mat-card-header>
          <div mat-card-avatar class="header-icon">
            <mat-icon>support_agent</mat-icon>
          </div>
          <mat-card-title>Nouvelle Réclamation</mat-card-title>
          <mat-card-subtitle>Veuillez remplir le formulaire ci-dessous pour soumettre votre réclamation</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="reclamationForm" (ngSubmit)="onSubmit()" class="reclamation-form">
            
            <!-- Catégorie -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Catégorie de la réclamation</mat-label>
              <mat-select formControlName="categorie" required>
                <mat-option value="">-- Sélectionner une catégorie --</mat-option>
                <mat-option value="Retard de service">Retard de service</mat-option>
                    <mat-option value="Erreur de données">Erreur de données</mat-option>
                    <mat-option value="Qualité de service">Qualité de service</mat-option>
                    <mat-option value="Problème de facturation">Problème de facturation</mat-option>
                    <mat-option value="Accueil et information">Accueil et information</mat-option>
                    <mat-option value="Autre">Autre</mat-option>
              </mat-select>
              <mat-icon matSuffix>category</mat-icon>
              @if (reclamationForm.get('categorie')?.invalid && reclamationForm.get('categorie')?.touched) {
                <mat-error>Veuillez sélectionner une catégorie</mat-error>
              }
            </mat-form-field>

            <!-- Objet -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Objet de la réclamation</mat-label>
              <input matInput 
                     formControlName="objet" 
                     placeholder="Résumé concis de votre réclamation"
                     maxlength="100"
                     required>
              <mat-icon matSuffix>title</mat-icon>
              <mat-hint align="end">{{reclamationForm.get('objet')?.value?.length || 0}}/100</mat-hint>
              @if (reclamationForm.get('objet')?.invalid && reclamationForm.get('objet')?.touched) {
                <mat-error>
                  @if (reclamationForm.get('objet')?.errors?.['required']) {
                    L'objet est obligatoire
                  }
                  @if (reclamationForm.get('objet')?.errors?.['minlength']) {
                    L'objet doit contenir au moins 5 caractères
                  }
                </mat-error>
              }
            </mat-form-field>

            <!-- Description -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description détaillée</mat-label>
              <textarea matInput 
                        formControlName="description" 
                        placeholder="Décrivez votre réclamation en détail..."
                        rows="6"
                        maxlength="1000"
                        required></textarea>
              <mat-icon matSuffix>description</mat-icon>
              <mat-hint align="end">{{reclamationForm.get('description')?.value?.length || 0}}/1000</mat-hint>
              @if (reclamationForm.get('description')?.invalid && reclamationForm.get('description')?.touched) {
                <mat-error>
                  @if (reclamationForm.get('description')?.errors?.['required']) {
                    La description est obligatoire
                  }
                  @if (reclamationForm.get('description')?.errors?.['minlength']) {
                    La description doit contenir au moins 20 caractères
                  }
                </mat-error>
              }
            </mat-form-field>

            <!-- Fichier joint -->
            <div class="file-upload-section">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Fichier joint (optionnel)</mat-label>
                <input matInput 
                       readonly 
                       [value]="selectedFileName"
                       placeholder="Aucun fichier sélectionné">
                <mat-icon matSuffix>attach_file</mat-icon>
              </mat-form-field>
              
              <div class="file-upload-buttons">
                <input type="file" 
                       #fileInput 
                       (change)="onFileSelected($event)"
                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                       style="display: none;">
                
                <button mat-raised-button 
                        type="button" 
                        color="accent" 
                        (click)="fileInput.click()"
                        class="file-select-btn">
                  <mat-icon>cloud_upload</mat-icon>
                  Choisir un fichier
                </button>
                
                @if (selectedFile) {
                  <button mat-icon-button 
                          type="button" 
                          color="warn" 
                          (click)="removeFile()"
                          matTooltip="Supprimer le fichier">
                    <mat-icon>delete</mat-icon>
                  </button>
                }
              </div>

              @if (selectedFile) {
                <mat-chip-set class="file-info-chips">
                  <mat-chip>
                    <mat-icon matChipAvatar>insert_drive_file</mat-icon>
                    {{selectedFile.name}} ({{formatFileSize(selectedFile.size)}})
                  </mat-chip>
                </mat-chip-set>
              }

              <div class="file-info">
                <small class="file-constraints">
                  <mat-icon class="info-icon">info</mat-icon>
                  Formats acceptés: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT (max. 5MB)
                </small>
              </div>
            </div>

          </form>
        </mat-card-content>

        <mat-card-actions class="form-actions">
          <button mat-raised-button 
                  color="primary" 
                  type="submit"
                  [disabled]="reclamationForm.invalid || isSubmitting"
                  (click)="onSubmit()">
            @if (isSubmitting) {
              <mat-spinner diameter="20" class="submit-spinner"></mat-spinner>
              Envoi en cours...
            } @else {
              <mat-icon>send</mat-icon>
              Envoyer la réclamation
            }
          </button>
          
          <button mat-stroked-button 
                  type="button" 
                  color="warn"
                  (click)="onReset()"
                  [disabled]="isSubmitting">
            <mat-icon>refresh</mat-icon>
            Réinitialiser
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Message de succès -->
      @if (showSuccessMessage) {
        <mat-card class="success-message">
          <mat-card-content>
            <div class="success-content">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <div class="success-text">
                <h3>Réclamation envoyée avec succès!</h3>
                <p>Votre réclamation a été enregistrée. Vous recevrez un accusé de réception par email avec le numéro de suivi: <strong>{{numeroSuivi}}</strong></p>
              </div>
            </div>
            <button mat-button color="primary" (click)="nouvellReclamation()">
              Soumettre une nouvelle réclamation
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styleUrls: ['./ajout-reclamation.component.css']
})
export class AjoutReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  numeroSuivi: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private reclamationService: ReclamationService 
  
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.reclamationForm = this.fb.group({
      categorie: ['', [Validators.required]],
      objet: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification de la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Le fichier ne doit pas dépasser 5MB', 'Fermer', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Vérification du type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
      
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Format de fichier non autorisé', 'Fermer', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.reclamationForm.valid) {
      this.isSubmitting = true;

      const reclamationData: ReclamationData = {
        categorie: this.reclamationForm.value.categorie,
        objet: this.reclamationForm.value.objet,
        description: this.reclamationForm.value.description,
        fichierJoint: this.selectedFile || undefined
      };

      // Simulation d'un appel HTTP (à remplacer par un vrai service)
     const formData = new FormData();
formData.append('categorie', reclamationData.categorie);
formData.append('objet', reclamationData.objet);
formData.append('description', reclamationData.description);
if (reclamationData.fichierJoint) {
  formData.append('fichierJoint', reclamationData.fichierJoint, reclamationData.fichierJoint.name);
}

this.reclamationService.submitReclamation(formData).subscribe({
  next: (response) => {
    this.isSubmitting = false;
    this.numeroSuivi = this.generateTrackingNumber(); // tu peux garder ça ou le remplacer par response.numeroSuivi
    this.showSuccessMessage = true;

    this.snackBar.open('Réclamation envoyée avec succès!', 'Fermer', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  },
  error: (error) => {
    this.isSubmitting = false;
    this.snackBar.open("Erreur lors de l'envoi de la réclamation", 'Fermer', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
    console.error(error);
  }
});

    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire', 'Fermer', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private simulateHttpPost(data: ReclamationData): void {
    // Simulation d'un délai réseau
    setTimeout(() => {
      this.isSubmitting = false;
      this.numeroSuivi = this.generateTrackingNumber();
      this.showSuccessMessage = true;
      
      this.snackBar.open('Réclamation envoyée avec succès!', 'Fermer', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      // TODO: Remplacer par un vrai appel HTTP
      // this.reclamationService.submitReclamation(data).subscribe({
      //   next: (response) => {
      //     this.numeroSuivi = response.numeroSuivi;
      //     this.showSuccessMessage = true;
      //   },
      //   error: (error) => {
      //     this.snackBar.open('Erreur lors de l\'envoi', 'Fermer', {
      //       duration: 4000,
      //       panelClass: ['error-snackbar']
      //     });
      //   }
      // });
    }, 2000);
  }

  private generateTrackingNumber(): string {
    const prefix = 'REC';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  onReset(): void {
    this.reclamationForm.reset();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.showSuccessMessage = false;
    
    this.snackBar.open('Formulaire réinitialisé', 'Fermer', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  nouvellReclamation(): void {
    this.showSuccessMessage = false;
    this.onReset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reclamationForm.controls).forEach(key => {
      const control = this.reclamationForm.get(key);
      control?.markAsTouched();
    });
  }
}