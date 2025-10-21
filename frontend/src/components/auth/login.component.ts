import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, Role } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  role: Role = 'CLIENT';
  hide = true;                        // ⬅️ pour l’icône œil
  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const r = (qp.get('role') || 'CLIENT').toUpperCase() as Role;
    this.role = (r === 'AGENT' ? 'AGENT' : 'CLIENT');
    const email = qp.get('email');
    if (email) this.form.patchValue({ email });
  }

  get roleClass() { return this.role === 'CLIENT' ? 'pill pill--client' : 'pill pill--agent'; }
  get roleIcon()  { return this.role === 'CLIENT' ? 'person' : 'support_agent'; }

  submit() {
    if (this.form.invalid || this.loading) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';

    this.auth.loginWithRole(this.role, this.form.value as any).subscribe({
      next: (res) => {
        this.loading = false;
        this.auth.setSession(res);
        this.router.navigateByUrl(res.role === 'CLIENT' ? '/client/reclamations' : '/agent/reclamations');
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 403) this.error = err?.error?.message || 'Rôle incompatible pour ce compte.';
        else if (err?.status === 401) this.error = 'Identifiants invalides';
        else this.error = err?.error?.message || 'Échec de connexion';
      }
    });
  }

  goRegister() {
    this.router.navigate(['/auth/register'], { queryParams: { role: this.role, email: this.form.value.email } });
  }
}
