// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { ReclamationsListComponent } from './components/liste-reclamations.component';
import { ReclamationNewComponent } from './components/ajout-reclamation.component';
import { ReponsesListComponent } from './components/liste-reponses.component';
import { ReponseNewComponent } from './components/ajout-reponse.component';
import { RoleSelectComponent } from './components/role-select.component';
import { ReclamationDetailComponent } from './components/reclamation-detail.component';
import { roleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'role', pathMatch: 'full' },
  { path: 'role', component: RoleSelectComponent },

  { path: 'auth/login', loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent) },

  // --- CLIENT ---
  {
    path: 'client',
    canActivate: [roleGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reclamations' }, // ⬅️ important
      { path: 'reclamations', component: ReclamationsListComponent },
      { path: 'reclamations/nouvelle', component: ReclamationNewComponent },
      { path: 'reclamations/:id', component: ReclamationDetailComponent },
      { path: 'reclamations/:id/reponses', component: ReponsesListComponent },
    ]
  },

  // --- AGENT ---
  {
    path: 'agent',
    canActivate: [roleGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reclamations' }, // ⬅️ important
      { path: 'reclamations', component: ReclamationsListComponent },
      { path: 'reclamations/:id', component: ReclamationDetailComponent },
      { path: 'reclamations/:id/reponses', component: ReponsesListComponent },
      { path: 'reclamations/:id/reponses/nouvelle', component: ReponseNewComponent },
    ]
  },

  { path: '**', redirectTo: 'role' }
];
