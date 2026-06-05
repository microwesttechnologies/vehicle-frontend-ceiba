import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Alert } from '../models/detection.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.alertApiUrl}/alerts`;

  getActiveAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/active`);
  }

  acknowledgeAlert(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/acknowledge`, {});
  }
}
