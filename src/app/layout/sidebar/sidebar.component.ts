import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAlertsCount } from '../../store/alerts/alerts.selectors';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar-nav">
      <div class="sidebar-brand">
        <i class="pi pi-shield sidebar-brand-icon"></i>
        <span class="sidebar-brand-text">VDS</span>
      </div>
      <ul class="sidebar-menu">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-home"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a routerLink="/search" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-search"></i>
            <span>Buscar</span>
          </a>
        </li>
        <li>
          <a routerLink="/map" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-map"></i>
            <span>Mapa</span>
          </a>
        </li>
        <li>
          <a routerLink="/alerts" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-bell"></i>
            <span>Alertas</span>
            @if (alertsCount$ | async; as count) {
              @if (count > 0) {
                <span class="badge">{{ count }}</span>
              }
            }
          </a>
        </li>
        <li>
          <a routerLink="/analytics" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-chart-bar"></i>
            <span>Analytics</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar-nav {
      padding: 1rem;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      margin-bottom: 2rem;
    }
    .sidebar-brand-icon {
      font-size: 1.75rem;
      color: #3B82F6;
    }
    .sidebar-brand-text {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .sidebar-menu {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: var(--text-color-secondary);
      text-decoration: none;
      transition: all 0.2s;
      font-size: 0.9rem;
    }
    .sidebar-link:hover {
      background-color: rgba(59, 130, 246, 0.1);
      color: var(--text-color);
    }
    .sidebar-link.active {
      background-color: rgba(59, 130, 246, 0.15);
      color: #3B82F6;
      font-weight: 600;
    }
    .badge {
      margin-left: auto;
      background-color: #ef4444;
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 700;
    }
  `]
})
export class SidebarComponent {
  private readonly store = inject(Store);
  alertsCount$ = this.store.select(selectAlertsCount);
}
