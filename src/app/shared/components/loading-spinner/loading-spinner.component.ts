import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <div class="spinner">
        <i class="pi pi-spin pi-spinner"></i>
      </div>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }
    .spinner-container.overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }
    .spinner i { font-size: 2.5rem; color: #3B82F6; }
    .spinner-message { color: var(--text-color-secondary); font-size: 0.875rem; }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() overlay = false;
}
