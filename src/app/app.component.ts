import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="layout-wrapper">
      <app-sidebar />
      <div class="layout-main">
        <app-topbar />
        <main class="layout-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppComponent {}
