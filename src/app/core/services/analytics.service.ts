import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HeatmapPoint, DetectionTrend, RiskSchedule } from '../models/detection.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.analyticsApiUrl}/analytics`;

  getHeatmap(from?: string, to?: string, country?: string): Observable<HeatmapPoint[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (country) params = params.set('country', country);

    return this.http.get<HeatmapPoint[]>(`${this.baseUrl}/heatmap`, { params });
  }

  getTrends(from?: string, to?: string): Observable<DetectionTrend[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<DetectionTrend[]>(`${this.baseUrl}/trends`, { params });
  }

  getRiskSchedule(zone?: string): Observable<RiskSchedule[]> {
    let params = new HttpParams();
    if (zone) params = params.set('zone', zone);

    return this.http.get<RiskSchedule[]>(`${this.baseUrl}/risk-schedule`, { params });
  }
}
