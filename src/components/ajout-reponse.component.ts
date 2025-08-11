import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ajout-reponse',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ajout-reponse.component.html',
  styleUrls: ['./ajout-reponse.component.css']
})
export class AjoutReponseComponent implements OnInit {
  reponseForm: FormGroup;
  reclamationId: number = 0;
  agentId: number = 1; // ID par défaut de l'agent
  loading = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.reponseForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reclamationId = +params['id'];
    });
  }

  onSubmit() {
    if (this.reponseForm.valid) {
      this.loading = true;
      this.error = '';
      
      const message = this.reponseForm.get('message')?.value;
      
      this.apiService.addReponse(this.reclamationId, this.agentId, message)
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.success = true;
            this.reponseForm.reset();
            setTimeout(() => {
              this.router.navigate(['/reclamations']);
            }, 2000);
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Erreur lors de l\'ajout de la réponse. Veuillez réessayer.';
            console.error('Erreur:', error);
          }
        });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.reponseForm.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('minlength')) {
      return 'Le message doit contenir au moins 10 caractères';
    }
    return '';
  }
} 