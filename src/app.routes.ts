// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { ReclamationsListComponent } from './components/liste-reclamations.component';
import { ReclamationNewComponent } from './components/ajout-reclamation.component';
import { ReponsesListComponent } from './components/liste-reponses.component';
import { ReponseNewComponent } from './components/ajout-reponse.component';
import { RoleSelectComponent } from './components/role-select.component';
import { ReclamationDetailComponent } from './components/reclamation-detail.component'; // ⬅️ nouveau
import { roleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'role', pathMatch: 'full' },
  { path: 'role', component: RoleSelectComponent },

  // --- CLIENT (lecture / création réclamation) ---
  {
    path: 'client',
    canActivate: [roleGuard],
    children: [
      { path: 'reclamations', component: ReclamationsListComponent },
      { path: 'reclamations/nouvelle', component: ReclamationNewComponent },
      { path: 'reclamations/:id', component: ReclamationDetailComponent },          // ⬅️ détails client
      { path: 'reclamations/:id/reponses', component: ReponsesListComponent },      // réponses client
    ]
  },

  // --- AGENT (lecture / réponses / statut) ---
  {
    path: 'agent',
    canActivate: [roleGuard],
    children: [
      { path: 'reclamations', component: ReclamationsListComponent },
      { path: 'reclamations/:id', component: ReclamationDetailComponent },          // ⬅️ détails agent
      { path: 'reclamations/:id/reponses', component: ReponsesListComponent },
      { path: 'reclamations/:id/reponses/nouvelle', component: ReponseNewComponent },
    ]
  },

  { path: '**', redirectTo: 'role' }
];
