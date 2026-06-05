import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Alert } from '../../core/models/detection.model';

export const AlertsActions = createActionGroup({
  source: 'Alerts',
  events: {
    'Load Alerts': emptyProps(),
    'Load Alerts Success': props<{ alerts: Alert[] }>(),
    'Load Alerts Failure': props<{ error: string }>(),
    'Acknowledge Alert': props<{ id: string }>(),
    'Acknowledge Alert Success': props<{ id: string }>(),
    'Acknowledge Alert Failure': props<{ error: string }>(),
  }
});
