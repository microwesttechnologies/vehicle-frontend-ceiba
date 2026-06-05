import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DetectionsState } from './detections.reducer';

export const selectDetectionsState = createFeatureSelector<DetectionsState>('detections');

export const selectRecentDetections = createSelector(selectDetectionsState, state => state.recent);
export const selectSearchResults = createSelector(selectDetectionsState, state => state.searchResults);
export const selectPlateHistory = createSelector(selectDetectionsState, state => state.plateHistory);
export const selectDetectionsLoading = createSelector(selectDetectionsState, state => state.loading);
export const selectDetectionsError = createSelector(selectDetectionsState, state => state.error);
