import { Routes } from '@angular/router';
import { AjoutReclamationComponent } from './components/ajout-reclamation.component';
import { AjoutReponseComponent } from './components/ajout-reponse.component';
import { ListeReponsesComponent } from './components/liste-reponses.component';
import { ListeReclamationsComponent } from './components/liste-reclamations.component';
import { LoginComponent } from './components/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'liste-reclamations', 
    component: ListeReclamationsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reclamations', 
    component: AjoutReclamationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reponse/ajouter/:id', 
    component: AjoutReponseComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reponses/:id', 
    component: ListeReponsesComponent,
    canActivate: [AuthGuard]
  }
]; 