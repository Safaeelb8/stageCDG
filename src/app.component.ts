import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentRole: 'Client' | 'Agent' | null = null;
  isLanding = false;  // vrai sur /role pour masquer le bouton

  constructor(private router: Router) {
    this.updateFromUrl(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const ev = e as NavigationEnd;
        this.updateFromUrl(ev.urlAfterRedirects || ev.url);
      });
  }

  private updateFromUrl(url: string) {
    this.isLanding   = url.startsWith('/role');
    this.currentRole = url.startsWith('/client') ? 'Client'
                    : url.startsWith('/agent')  ? 'Agent'
                    : null;
  }
}
