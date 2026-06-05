import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface DashboardStats {
  detectionsToday: number;
  totalDetections: number;
  recoveredVehicles: number;
  devicesOnline: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stats`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.baseUrl);
  }
}
