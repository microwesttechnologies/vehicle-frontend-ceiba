import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DetectionsActions } from '../../store/detections/detections.actions';
import { AlertsActions } from '../../store/alerts/alerts.actions';
import { selectRecentDetections } from '../../store/detections/detections.selectors';
import { selectAlerts, selectAlertsCount } from '../../store/alerts/alerts.selectors';
import { StatsService, DashboardStats } from '../../core/services/stats.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Vista general del sistema de detecciones</p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon" style="background-color: rgba(59,130,246,0.15)">
          <i class="pi pi-car" style="color: #3B82F6"></i>
        </div>
        <div class="kpi-content">
          <h3>Detecciones Hoy</h3>
          <span class="kpi-value">{{ stats?.detectionsToday ?? 0 }}</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon" style="background-color: rgba(239,68,68,0.15)">
          <i class="pi pi-bell" style="color: #ef4444"></i>
        </div>
        <div class="kpi-content">
          <h3>Alertas Activas</h3>
          <span class="kpi-value">{{ alertsCount$ | async }}</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon" style="background-color: rgba(16,185,129,0.15)">
          <i class="pi pi-check-circle" style="color: #10b981"></i>
        </div>
        <div class="kpi-content">
          <h3>Recuperados</h3>
          <span class="kpi-value">{{ stats?.recoveredVehicles ?? 0 }}</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon" style="background-color: rgba(245,158,11,0.15)">
          <i class="pi pi-wifi" style="color: #f59e0b"></i>
        </div>
        <div class="kpi-content">
          <h3>Dispositivos Online</h3>
          <span class="kpi-value">{{ stats?.devicesOnline ?? 0 }}</span>
        </div>
      </div>
    </div>

    <div class="grid-2col">
      <div class="card">
        <h3 class="card-title">Detecciones Recientes</h3>
        <p-table [value]="(recentDetections$ | async) || []" [rows]="10" [paginator]="true"
                 styleClass="p-datatable-sm p-datatable-striped">
          <ng-template pTemplate="header">
            <tr>
              <th>Matrícula</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Dispositivo</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-detection>
            <tr>
              <td><strong>{{ detection.licensePlate }}</strong></td>
              <td>{{ detection.latitude | number:'1.4-4' }}, {{ detection.longitude | number:'1.4-4' }}</td>
              <td>{{ detection.detectedAt | date:'short' }}</td>
              <td>{{ detection.deviceId }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="card">
        <h3 class="card-title">Alertas Activas</h3>
        @for (alert of alerts$ | async; track alert.id) {
          <div class="alert-item">
            <div class="alert-info">
              <span class="alert-plate">{{ alert.licensePlate }}</span>
              <span class="alert-time">{{ alert.generatedAt | date:'medium' }}</span>
            </div>
            <p-tag [severity]="alert.severity === 'High' ? 'danger' : 'warning'" [value]="alert.severity" />
          </div>
        } @empty {
          <p class="empty-state">No hay alertas activas</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .alert-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .alert-item:last-child { border-bottom: none; }
    .alert-info { display: flex; flex-direction: column; gap: 0.25rem; }
    .alert-plate { font-weight: 700; font-size: 0.9rem; }
    .alert-time { font-size: 0.75rem; color: var(--text-color-secondary); }
    .empty-state { color: var(--text-color-secondary); font-style: italic; }
    @media (max-width: 1024px) {
      .grid-2col { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly statsService = inject(StatsService);

  recentDetections$ = this.store.select(selectRecentDetections);
  alerts$ = this.store.select(selectAlerts);
  alertsCount$ = this.store.select(selectAlertsCount);
  stats: DashboardStats | null = null;

  ngOnInit(): void {
    this.store.dispatch(DetectionsActions.loadRecent());
    this.store.dispatch(AlertsActions.loadAlerts());
    this.statsService.getStats().subscribe(s => this.stats = s);
  }
}
