import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class RoleService {
  private role: 'Client'|'Agent'|null = null;
  setRole(r:'Client'|'Agent'){ this.role = r; }
  getRole(){ return this.role; }
  clearRole(){ this.role = null; }
}

