import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertsState } from './alerts.reducer';

export const selectAlertsState = createFeatureSelector<AlertsState>('alerts');

export const selectAlerts = createSelector(selectAlertsState, state => state.alerts);
export const selectAlertsLoading = createSelector(selectAlertsState, state => state.loading);
export const selectAlertsError = createSelector(selectAlertsState, state => state.error);
export const selectAlertsCount = createSelector(selectAlerts, alerts => alerts.length);
