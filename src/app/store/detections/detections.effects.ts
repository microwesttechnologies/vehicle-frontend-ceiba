import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { DetectionService } from '../../core/services/detection.service';
import { DetectionsActions } from './detections.actions';

@Injectable()
export class DetectionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly detectionService = inject(DetectionService);

  loadRecent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetectionsActions.loadRecent),
      exhaustMap(() =>
        this.detectionService.getRecent().pipe(
          map(detections => DetectionsActions.loadRecentSuccess({ detections })),
          catchError(error => of(DetectionsActions.loadRecentFailure({ error: error.message })))
        )
      )
    )
  );

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetectionsActions.search),
      exhaustMap(({ request }) =>
        this.detectionService.search(request).pipe(
          map(result => DetectionsActions.searchSuccess({ result })),
          catchError(error => of(DetectionsActions.searchFailure({ error: error.message })))
        )
      )
    )
  );

  searchByPlate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetectionsActions.searchByPlate),
      exhaustMap(({ licensePlate }) =>
        this.detectionService.getByPlate(licensePlate).pipe(
          map(detections => DetectionsActions.searchByPlateSuccess({ detections })),
          catchError(error => of(DetectionsActions.searchByPlateFailure({ error: error.message })))
        )
      )
    )
  );
}
