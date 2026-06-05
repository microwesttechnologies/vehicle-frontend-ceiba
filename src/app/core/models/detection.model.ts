export interface VehicleDetection {
  id: string;
  licensePlate: string;
  latitude: number;
  longitude: number;
  detectedAt: string;
  deviceId: string;
  imageUrl?: string;
}

export interface StolenVehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  country: string;
  reportedAt: string;
  status: VehicleStatus;
}

export type VehicleStatus = 'Active' | 'Recovered' | 'Inactive';

export interface Alert {
  id: string;
  detectionId: string;
  stolenVehicleId: string;
  licensePlate: string;
  latitude: number;
  longitude: number;
  generatedAt: string;
  severity: AlertSeverity;
  status?: AlertStatus;
}

export type AlertSeverity = 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved' | 'Expired';

export interface DetectionSearchRequest {
  licensePlate?: string;
  from?: string;
  to?: string;
  country?: string;
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface HeatmapPoint {
  id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  periodStart: string;
  periodEnd: string;
  country?: string;
}

export interface DetectionTrend {
  id: string;
  date: string;
  totalDetections: number;
  stolenMatches: number;
  country?: string;
}

export interface RiskSchedule {
  id: string;
  dayOfWeek: number;
  hourOfDay: number;
  riskScore: number;
  zone?: string;
}

export interface DashboardKpi {
  totalDetections: number;
  activeAlerts: number;
  stolenVehiclesRecovered: number;
  onlineDevices: number;
}
