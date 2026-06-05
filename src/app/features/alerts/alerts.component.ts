import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AlertsActions } from '../../store/alerts/alerts.actions';
import { selectAlerts, selectAlertsLoading } from '../../store/alerts/alerts.selectors';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ConfirmDialogModule],
  template: `
    <div class="page-header">
      <h1>Alertas</h1>
      <p>Vehículos hurtados detectados por el sistema</p>
    </div>

    <div class="card">
      @if (loading$ | async) {
        <div class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
      } @else {
        <p-table [value]="(alerts$ | async) || []" [rows]="15" [paginator]="true"
                 styleClass="p-datatable-sm" [rowHover]="true"
                 [globalFilterFields]="['licensePlate', 'severity']">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="licensePlate">Matrícula <p-sortIcon field="licensePlate" /></th>
              <th pSortableColumn="generatedAt">Fecha <p-sortIcon field="generatedAt" /></th>
              <th>Ubicación</th>
              <th pSortableColumn="severity">Severidad <p-sortIcon field="severity" /></th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-alert>
            <tr>
              <td><strong class="alert-plate">{{ alert.licensePlate }}</strong></td>
              <td>{{ alert.generatedAt | date:'medium' }}</td>
              <td>{{ alert.latitude | number:'1.4-4' }}, {{ alert.longitude | number:'1.4-4' }}</td>
              <td>
                <p-tag [severity]="getSeverityColor(alert.severity)" [value]="alert.severity" />
              </td>
              <td>
                <p-button icon="pi pi-check" severity="success" [text]="true" [rounded]="true"
                          pTooltip="Confirmar" (onClick)="acknowledge(alert.id)" />
                <p-button icon="pi pi-map-marker" severity="info" [text]="true" [rounded]="true"
                          pTooltip="Ver en mapa" (onClick)="viewOnMap(alert)" />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="empty-message">
                <i class="pi pi-check-circle" style="font-size: 2rem; color: #10b981"></i>
                <p>No hay alertas activas</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
  styles: [`
    .alert-plate { color: #ef4444; font-size: 0.95rem; }
    .loading-state {
      display: flex;
      justify-content: center;
      padding: 3rem;
      color: var(--text-color-secondary);
    }
    .empty-message {
      text-align: center;
      padding: 3rem !important;
      color: var(--text-color-secondary);
    }
    .empty-message p { margin-top: 0.5rem; }
  `]
})
export class AlertsComponent implements OnInit {
  private readonly store = inject(Store);

  alerts$ = this.store.select(selectAlerts);
  loading$ = this.store.select(selectAlertsLoading);

  ngOnInit(): void {
    this.store.dispatch(AlertsActions.loadAlerts());
  }

  acknowledge(id: string): void {
    this.store.dispatch(AlertsActions.acknowledgeAlert({ id }));
  }

  viewOnMap(alert: { latitude: number; longitude: number }): void {
    // Navigate to map with coordinates
    window.open(`/map?lat=${alert.latitude}&lng=${alert.longitude}`, '_self');
  }

  getSeverityColor(severity: string): 'danger' | 'warning' | 'success' {
    switch (severity) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      default: return 'success';
    }
  }
}
