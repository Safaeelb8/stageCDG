import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, Role } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  role: Role = 'CLIENT';
  hide = true;
  loading = false;
  error = '';

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.role = (this.route.snapshot.queryParamMap.get('role') || 'CLIENT') as Role;
  }

  get roleClass() { return this.role === 'CLIENT' ? 'role--client' : 'role--agent'; }
  get roleIcon()  { return this.role === 'CLIENT' ? 'person' : 'support_agent'; }

  submit() {
    if (this.form.invalid || this.loading) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const payload = this.form.value as any;

    this.auth.register(this.role, payload).subscribe({
      next: res => {
        this.loading = false;
        if (res.role === 'CLIENT') this.router.navigateByUrl('/client/reclamations');
        else this.router.navigateByUrl('/agent/reclamations');
      },
      error: err => {
        this.loading = false;
        const status = err?.status;
        this.error = err?.error?.message || (status === 409 ? 'Email déjà utilisé' : 'Échec d’inscription');
        if (status === 409) {
          this.router.navigate(['/auth/login'], { queryParams: { role: this.role, email: payload.email } });
        }
      }
    });
  }

  goLogin() { this.router.navigate(['/auth/login'], { queryParams: { role: this.role } }); }
}
