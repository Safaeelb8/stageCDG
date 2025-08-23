import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from './services/role.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  const role = roleService.getRole();
  const url = state.url;

  if (!role) {
    return router.parseUrl('/role');
  }

  if (role === 'Client' && url.startsWith('/client')) return true;
  if (role === 'Agent' && url.startsWith('/agent')) return true;

  return router.parseUrl('/role');
};
