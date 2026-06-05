import { Component, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import { DetectionsActions } from '../../store/detections/detections.actions';
import { selectRecentDetections } from '../../store/detections/detections.selectors';
import { Subscription } from 'rxjs';
import { VehicleDetection } from '../../core/models/detection.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Mapa de Detecciones</h1>
      <p>Visualización geográfica de las detecciones en tiempo real</p>
    </div>
    <div class="card map-container">
      <div id="detection-map" class="map"></div>
    </div>
    <div class="card map-legend">
      <h4>Leyenda</h4>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-dot" style="background: #3B82F6"></span>
          <span>Detección normal</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #ef4444"></span>
          <span>Vehículo hurtado detectado</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container { padding: 0; overflow: hidden; margin-bottom: 1rem; }
    .map { height: 500px; width: 100%; border-radius: 12px; }
    .map-legend { display: flex; align-items: center; gap: 2rem; }
    .map-legend h4 { margin: 0; font-size: 0.875rem; }
    .legend-items { display: flex; gap: 1.5rem; }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; }
    .legend-dot { width: 12px; height: 12px; border-radius: 50%; }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(Store);
  private map!: L.Map;
  private markers: L.CircleMarker[] = [];
  private subscription!: Subscription;

  ngOnInit(): void {
    this.store.dispatch(DetectionsActions.loadRecent());
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.subscription = this.store.select(selectRecentDetections).subscribe(detections => {
      this.updateMarkers(detections);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map('detection-map', {
      center: [4.6097, -74.0817],
      zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private updateMarkers(detections: VehicleDetection[]): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

    detections.forEach(detection => {
      const marker = L.circleMarker([detection.latitude, detection.longitude], {
        radius: 8,
        fillColor: '#3B82F6',
        color: '#1d4ed8',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      });

      marker.bindPopup(`
        <strong>${detection.licensePlate}</strong><br/>
        Dispositivo: ${detection.deviceId}<br/>
        Fecha: ${new Date(detection.detectedAt).toLocaleString()}
      `);

      marker.addTo(this.map);
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers as L.Layer[]);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
