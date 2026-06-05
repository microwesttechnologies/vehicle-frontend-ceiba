import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DetectionsActions } from '../../store/detections/detections.actions';
import { selectSearchResults, selectDetectionsLoading, selectPlateHistory } from '../../store/detections/detections.selectors';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, CalendarModule],
  template: `
    <div class="page-header">
      <h1>Buscar Vehículo</h1>
      <p>Buscar por matrícula o filtros avanzados</p>
    </div>

    <div class="card search-form">
      <div class="search-row">
        <span class="p-input-icon-left flex-1">
          <i class="pi pi-search"></i>
          <input type="text" pInputText [(ngModel)]="licensePlate"
                 placeholder="Ingrese matrícula..." class="w-full"
                 (keyup.enter)="searchByPlate()" />
        </span>
        <p-button label="Buscar" icon="pi pi-search" (onClick)="searchByPlate()" />
      </div>
      <div class="search-filters">
        <p-calendar [(ngModel)]="dateFrom" placeholder="Desde" [showIcon]="true" dateFormat="yy-mm-dd" />
        <p-calendar [(ngModel)]="dateTo" placeholder="Hasta" [showIcon]="true" dateFormat="yy-mm-dd" />
        <p-button label="Buscar con filtros" icon="pi pi-filter" severity="secondary" (onClick)="searchWithFilters()" />
      </div>
    </div>

    <div class="card results-section">
      <h3 class="card-title">Resultados</h3>
      @if (loading$ | async) {
        <div class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>Buscando...</p>
        </div>
      } @else {
        <p-table [value]="(plateHistory$ | async) || []" [rows]="15" [paginator]="true"
                 styleClass="p-datatable-sm p-datatable-striped" [rowHover]="true">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="licensePlate">Matrícula <p-sortIcon field="licensePlate" /></th>
              <th pSortableColumn="detectedAt">Fecha <p-sortIcon field="detectedAt" /></th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Dispositivo</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-detection>
            <tr>
              <td><strong>{{ detection.licensePlate }}</strong></td>
              <td>{{ detection.detectedAt | date:'medium' }}</td>
              <td>{{ detection.latitude | number:'1.6-6' }}</td>
              <td>{{ detection.longitude | number:'1.6-6' }}</td>
              <td>{{ detection.deviceId }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center">No se encontraron resultados</td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
  styles: [`
    .search-form { margin-bottom: 1.5rem; }
    .search-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }
    .search-filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .flex-1 { flex: 1; }
    .w-full { width: 100%; }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 3rem;
      color: var(--text-color-secondary);
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .text-center { text-align: center; color: var(--text-color-secondary); }
  `]
})
export class SearchComponent {
  private readonly store = inject(Store);

  licensePlate = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  plateHistory$ = this.store.select(selectPlateHistory);
  searchResults$ = this.store.select(selectSearchResults);
  loading$ = this.store.select(selectDetectionsLoading);

  searchByPlate(): void {
    if (this.licensePlate.trim()) {
      this.store.dispatch(DetectionsActions.searchByPlate({ licensePlate: this.licensePlate.trim() }));
    }
  }

  searchWithFilters(): void {
    this.store.dispatch(DetectionsActions.search({
      request: {
        licensePlate: this.licensePlate || undefined,
        from: this.dateFrom?.toISOString(),
        to: this.dateTo?.toISOString(),
        page: 1,
        pageSize: 20
      }
    }));
  }
}
