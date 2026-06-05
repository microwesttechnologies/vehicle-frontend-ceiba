import { createReducer, on } from '@ngrx/store';
import { VehicleDetection, PagedResult } from '../../core/models/detection.model';
import { DetectionsActions } from './detections.actions';

export interface DetectionsState {
  recent: VehicleDetection[];
  searchResults: PagedResult<VehicleDetection> | null;
  plateHistory: VehicleDetection[];
  loading: boolean;
  error: string | null;
}

export const initialState: DetectionsState = {
  recent: [],
  searchResults: null,
  plateHistory: [],
  loading: false,
  error: null
};

export const detectionsReducer = createReducer(
  initialState,
  on(DetectionsActions.loadRecent, (state) => ({ ...state, loading: true, error: null })),
  on(DetectionsActions.loadRecentSuccess, (state, { detections }) => ({
    ...state, recent: detections, loading: false
  })),
  on(DetectionsActions.loadRecentFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(DetectionsActions.search, (state) => ({ ...state, loading: true, error: null })),
  on(DetectionsActions.searchSuccess, (state, { result }) => ({
    ...state, searchResults: result, loading: false
  })),
  on(DetectionsActions.searchFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(DetectionsActions.searchByPlate, (state) => ({ ...state, loading: true, error: null })),
  on(DetectionsActions.searchByPlateSuccess, (state, { detections }) => ({
    ...state, plateHistory: detections, loading: false
  })),
  on(DetectionsActions.searchByPlateFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
