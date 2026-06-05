import { Component, OnInit, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AnalyticsService } from '../../core/services/analytics.service';
import { HeatmapPoint, DetectionTrend } from '../../core/models/detection.model';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, ButtonModule, DropdownModule],
  template: `
    <div class="page-header">
      <h1>Analytics</h1>
      <p>Analítica avanzada y patrones de detección</p>
    </div>

    <div class="analytics-filters card">
      <div class="filter-row">
        <p-calendar [(ngModel)]="dateFrom" placeholder="Desde" [showIcon]="true" />
        <p-calendar [(ngModel)]="dateTo" placeholder="Hasta" [showIcon]="true" />
        <p-button label="Actualizar" icon="pi pi-refresh" (onClick)="loadData()" />
      </div>
    </div>

    <div class="analytics-grid">
      <div class="card">
        <h3 class="card-title">Mapa de Calor</h3>
        <div id="heatmap" class="analytics-map"></div>
      </div>

      <div class="card">
        <h3 class="card-title">Tendencias de Detección</h3>
        <div class="trends-list">
          @for (trend of trends; track trend.id) {
            <div class="trend-item">
              <span class="trend-date">{{ trend.date | date:'mediumDate' }}</span>
              <div class="trend-bars">
                <div class="trend-bar detection" [style.width.%]="getBarWidth(trend.totalDetections)">
                  {{ trend.totalDetections }}
                </div>
                <div class="trend-bar stolen" [style.width.%]="getBarWidth(trend.stolenMatches * 10)">
                  {{ trend.stolenMatches }}
                </div>
              </div>
            </div>
          } @empty {
            <p class="empty-state">No hay datos disponibles para el rango seleccionado</p>
          }
        </div>
      </div>

      <div class="card stats-card">
        <h3 class="card-title">Estadísticas del Período</h3>
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-value">{{ totalDetections }}</span>
            <span class="stat-label">Total Detecciones</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalMatches }}</span>
            <span class="stat-label">Coincidencias</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ heatmapPoints.length }}</span>
            <span class="stat-label">Zonas Activas</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ matchRate }}%</span>
            <span class="stat-label">Tasa de Acierto</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-filters { margin-bottom: 1.5rem; }
    .filter-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .analytics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .analytics-map { height: 350px; border-radius: 8px; }
    .card-title { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
    .trends-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .trend-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 0;
    }
    .trend-date { font-size: 0.8rem; color: var(--text-color-secondary); min-width: 100px; }
    .trend-bars { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .trend-bar {
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding-left: 0.5rem;
      font-size: 0.7rem;
      font-weight: 600;
      min-width: 30px;
      transition: width 0.3s ease;
    }
    .trend-bar.detection { background-color: rgba(59, 130, 246, 0.3); color: #3B82F6; }
    .trend-bar.stolen { background-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
    .stats-card { grid-column: 1 / -1; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
    .stat-item { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
    .stat-value { font-size: 2rem; font-weight: 800; color: #3B82F6; }
    .stat-label { font-size: 0.8rem; color: var(--text-color-secondary); }
    .empty-state { color: var(--text-color-secondary); font-style: italic; text-align: center; padding: 2rem; }
    @media (max-width: 1024px) {
      .analytics-grid { grid-template-columns: 1fr; }
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly analyticsService = inject(AnalyticsService);
  private map!: L.Map;
  private subscription?: Subscription;

  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  heatmapPoints: HeatmapPoint[] = [];
  trends: DetectionTrend[] = [];

  get totalDetections(): number {
    return this.trends.reduce((sum, t) => sum + t.totalDetections, 0);
  }

  get totalMatches(): number {
    return this.trends.reduce((sum, t) => sum + t.stolenMatches, 0);
  }

  get matchRate(): string {
    if (this.totalDetections === 0) return '0';
    return ((this.totalMatches / this.totalDetections) * 100).toFixed(1);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initHeatmap();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.map?.remove();
  }

  loadData(): void {
    const from = this.dateFrom?.toISOString();
    const to = this.dateTo?.toISOString();

    this.analyticsService.getHeatmap(from, to).subscribe(points => {
      this.heatmapPoints = points;
      this.renderHeatmapMarkers();
    });

    this.analyticsService.getTrends(from, to).subscribe(trends => {
      this.trends = trends;
    });
  }

  getBarWidth(value: number): number {
    const max = Math.max(...this.trends.map(t => t.totalDetections), 1);
    return Math.max((value / max) * 100, 5);
  }

  private initHeatmap(): void {
    this.map = L.map('heatmap', {
      center: [4.6097, -74.0817],
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);
  }

  private renderHeatmapMarkers(): void {
    this.heatmapPoints.forEach(point => {
      const color = point.intensity > 7 ? '#ef4444' : point.intensity > 4 ? '#f59e0b' : '#3B82F6';
      L.circleMarker([point.latitude, point.longitude], {
        radius: point.intensity * 3,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0.4
      }).addTo(this.map);
    });
  }
}
