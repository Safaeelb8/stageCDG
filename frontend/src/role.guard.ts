import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const url = state.url;

  // lire la session d'auth créée après login/register OK
  let auth: { token?: string; role?: 'CLIENT'|'AGENT' } | null = null;
  try { auth = JSON.parse(localStorage.getItem('auth') || 'null'); } catch { auth = null; }

  const wantsAgent = url.startsWith('/agent');
  const wantsClient = url.startsWith('/client');
  const expectedRole = wantsAgent ? 'AGENT' : wantsClient ? 'CLIENT' : null;

  // pas connecté → forcer le passage par l'écran login avec le rôle attendu
  if (!auth || !auth.token) {
    return router.createUrlTree(['/auth/login'], { queryParams: { role: expectedRole || 'CLIENT' } });
  }

  // connecté mais pas le bon rôle → renvoyer vers login du rôle attendu
  if (expectedRole && auth.role !== expectedRole) {
    return router.createUrlTree(['/auth/login'], { queryParams: { role: expectedRole } });
  }

  return true;
};
