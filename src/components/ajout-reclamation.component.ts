import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReclamationService } from '../services/reclamation.service';

@Component({
  selector: 'app-reclamation-new',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './ajout-reclamation.component.html',
  styleUrls: ['./ajout-reclamation.component.css']
})
export class ReclamationNewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private api = inject(ReclamationService);

  form!: FormGroup;
  isSending = false;

  selectedFile: File | null = null;
  selectedFileName = '';
  dragOver = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      clientId: [null, [Validators.required, Validators.min(1)]],
      categorie: ['', Validators.required],
      objet: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    });
  }

  get f() { return this.form.controls; }

  // --- Fichiers
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (!f) return;
    this.acceptFile(f);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dragOver = true;
  }
  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
  }
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    const f = e.dataTransfer?.files?.[0];
    if (f) this.acceptFile(f);
  }

  private acceptFile(f: File) {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png',
      'text/plain'
    ];
    if (!allowed.includes(f.type)) {
      this.snack.open('Format non autorisé. PDF/DOC/DOCX/JPG/PNG/TXT uniquement.', 'Fermer', { duration: 4000 });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      this.snack.open('Le fichier ne doit pas dépasser 5 MB.', 'Fermer', { duration: 4000 });
      return;
    }
    this.selectedFile = f;
    this.selectedFileName = f.name;
  }

  clearFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  // --- Envoi
  submit() {
    if (this.isSending) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fd = new FormData();
    fd.append('clientId', String(this.f['clientId'].value));
    fd.append('categorie', String(this.f['categorie'].value));
    fd.append('objet', String(this.f['objet'].value));
    fd.append('description', String(this.f['description'].value));
    if (this.selectedFile) fd.append('fichierJoint', this.selectedFile, this.selectedFile.name);

    this.isSending = true;
    this.api.create(fd).subscribe({
      next: (created) => {
        this.isSending = false;
        this.snack.open(`Réclamation #${created.id} créée ✅`, 'Fermer', { duration: 3000 });
        this.reset();
      },
      error: (err) => {
        this.isSending = false;
        const msg = err?.error?.message || 'Erreur lors de la création';
        this.snack.open(msg, 'Fermer', { duration: 5000 });
        console.error('ERREUR =>', err);
      }
    });
  }

  reset() {
    this.form.reset();
    this.clearFile();
  }
}
