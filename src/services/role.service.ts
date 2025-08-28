import { Injectable } from '@angular/core';

export type AppRole = 'CLIENT' | 'AGENT';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly KEY = 'selectedRole';

  setRole(r: AppRole) {
    sessionStorage.setItem(this.KEY, r);
  }

  getRole(): AppRole | null {
    const v = sessionStorage.getItem(this.KEY);
    return v === 'CLIENT' || v === 'AGENT' ? v : null;
  }

  clearRole() {
    sessionStorage.removeItem(this.KEY);
  }
}
