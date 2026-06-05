import { createReducer, on } from '@ngrx/store';
import { Alert } from '../../core/models/detection.model';
import { AlertsActions } from './alerts.actions';

export interface AlertsState {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

export const initialState: AlertsState = {
  alerts: [],
  loading: false,
  error: null
};

export const alertsReducer = createReducer(
  initialState,
  on(AlertsActions.loadAlerts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlertsActions.loadAlertsSuccess, (state, { alerts }) => ({
    ...state,
    alerts,
    loading: false
  })),
  on(AlertsActions.loadAlertsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AlertsActions.acknowledgeAlertSuccess, (state, { id }) => ({
    ...state,
    alerts: state.alerts.filter(a => a.id !== id)
  }))
);
