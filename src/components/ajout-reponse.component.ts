import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../services/reclamation.service';

@Component({
  standalone: true,
  selector: 'app-reponse-new',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajout-reponse.component.html',
  styleUrls: ['./ajout-reponse.component.css']
})
export class ReponseNewComponent implements OnInit {
  reclamationId = 0;
  maxLen = 1000;

  form = this.fb.group({
    agentId: [null, [Validators.required, Validators.min(1)]],        // ⬅️ obligatoire
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(this.maxLen)]]
  });

  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private api: ReclamationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));
  }

  get messageCtrl(): AbstractControl { return this.form.controls['message']; }
  get agentCtrl(): AbstractControl { return this.form.controls['agentId']; }

  cancel(): void {
    // cette page est côté Agent ; on revient vers la liste des réponses agent
    this.router.navigate(['/agent/reclamations', this.reclamationId, 'reponses']);
  }

  submit(): void {
    if (this.loading || this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = '';
    this.success = false;

    const message = String(this.form.value.message || '').trim();
    const agentId = Number(this.form.value.agentId);

    this.api.createReponse({ reclamationId: this.reclamationId, message, agentId }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/agent/reclamations', this.reclamationId, 'reponses']), 600);
      },
      error: () => {
        this.loading = false;
        this.error = "Erreur lors de l'ajout de la réponse.";
      }
    });
  }
}
