import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="layout-topbar">
      <h2 class="topbar-title">Vehicle Detection System</h2>
      <div class="topbar-actions">
        <span class="topbar-user">
          <i class="pi pi-user"></i>
          {{ authService.getUserName() }}
        </span>
        <button class="topbar-btn" (click)="authService.logout()">
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color-secondary);
    }
    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .topbar-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
    .topbar-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-color-secondary);
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .topbar-btn:hover {
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }
  `]
})
export class TopbarComponent {
  readonly authService = inject(AuthService);
}
