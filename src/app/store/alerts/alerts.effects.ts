import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AlertService } from '../../core/services/alert.service';
import { AlertsActions } from './alerts.actions';

@Injectable()
export class AlertsEffects {
  private readonly actions$ = inject(Actions);
  private readonly alertService = inject(AlertService);

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.loadAlerts),
      exhaustMap(() =>
        this.alertService.getActiveAlerts().pipe(
          map(alerts => AlertsActions.loadAlertsSuccess({ alerts })),
          catchError(error => of(AlertsActions.loadAlertsFailure({ error: error.message })))
        )
      )
    )
  );

  acknowledgeAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.acknowledgeAlert),
      exhaustMap(({ id }) =>
        this.alertService.acknowledgeAlert(id).pipe(
          map(() => AlertsActions.acknowledgeAlertSuccess({ id })),
          catchError(error => of(AlertsActions.acknowledgeAlertFailure({ error: error.message })))
        )
      )
    )
  );
}
