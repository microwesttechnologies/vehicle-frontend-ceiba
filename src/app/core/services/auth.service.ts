import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: Integrate KeycloakService for production via APP_INITIALIZER
  // For development, mock values are returned so the app runs without Keycloak.

  getToken(): string | undefined {
    return 'dev-token';
  }

  isLoggedIn(): boolean {
    return true;
  }

  getUserName(): string {
    return 'dev-operator';
  }

  getUserRoles(): string[] {
    return ['admin', 'operator'];
  }

  logout(): void {
    console.log('Logout (dev mode — Keycloak not configured)');
  }

  login(): void {
    console.log('Login (dev mode — Keycloak not configured)');
  }
}
