import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { VehicleDetection, DetectionSearchRequest, PagedResult } from '../models/detection.model';

@Injectable({ providedIn: 'root' })
export class DetectionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/detections`;

  registerDetection(detection: Partial<VehicleDetection>): Observable<string> {
    return this.http.post<string>(this.baseUrl, detection);
  }

  getByPlate(licensePlate: string): Observable<VehicleDetection[]> {
    return this.http.get<VehicleDetection[]>(`${this.baseUrl}/plate/${licensePlate}`);
  }

  getRecent(count: number = 50): Observable<VehicleDetection[]> {
    return this.http.get<VehicleDetection[]>(`${this.baseUrl}/recent`, {
      params: new HttpParams().set('count', count.toString())
    });
  }

  search(request: DetectionSearchRequest): Observable<PagedResult<VehicleDetection>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('pageSize', request.pageSize.toString());

    if (request.licensePlate) params = params.set('licensePlate', request.licensePlate);
    if (request.from) params = params.set('from', request.from);
    if (request.to) params = params.set('to', request.to);
    if (request.country) params = params.set('country', request.country);

    return this.http.get<PagedResult<VehicleDetection>>(`${environment.searchApiUrl}/search`, { params });
  }
}
