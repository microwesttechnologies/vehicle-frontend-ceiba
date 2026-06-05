import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  authService.login();
  return false;
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRoles = authService.getUserRoles();
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (hasRole) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
