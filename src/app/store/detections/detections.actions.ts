import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { VehicleDetection, DetectionSearchRequest, PagedResult } from '../../core/models/detection.model';

export const DetectionsActions = createActionGroup({
  source: 'Detections',
  events: {
    'Load Recent': emptyProps(),
    'Load Recent Success': props<{ detections: VehicleDetection[] }>(),
    'Load Recent Failure': props<{ error: string }>(),
    'Search': props<{ request: DetectionSearchRequest }>(),
    'Search Success': props<{ result: PagedResult<VehicleDetection> }>(),
    'Search Failure': props<{ error: string }>(),
    'Search By Plate': props<{ licensePlate: string }>(),
    'Search By Plate Success': props<{ detections: VehicleDetection[] }>(),
    'Search By Plate Failure': props<{ error: string }>(),
  }
});
