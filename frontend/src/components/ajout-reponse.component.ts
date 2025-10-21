// src/components/ajout-reponse.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../services/reclamation.service';
import { AuthService } from '../services/auth.service';

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
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(this.maxLen)]]
  });

  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private api: ReclamationService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));

    const me = this.auth.me;
    if (!me || me.role !== 'AGENT') {
      this.error = 'Session agent requise.';
      this.router.navigate(['/auth/login'], { queryParams: { role: 'AGENT' } });
    }
  }

  get messageCtrl(): AbstractControl { return this.form.controls['message']; }

  cancel(): void {
    this.router.navigate(['/agent/reclamations', this.reclamationId, 'reponses']);
  }

  submit(): void {
    if (this.loading || this.form.invalid) { this.form.markAllAsTouched(); return; }

    const me = this.auth.me;
    if (!me || me.role !== 'AGENT') {
      this.error = 'Rôle incompatible (AGENT attendu).';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const message = String(this.form.value.message || '').trim();
    const agentId = me.userId; // ⬅️ depuis la session

    this.api.createReponse({ reclamationId: this.reclamationId, message, agentId }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/agent/reclamations', this.reclamationId, 'reponses']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || err?.error?.message || "Erreur lors de l'ajout de la réponse.";
      }
    });
  }
}
