import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./components/tailwind-dashboard/tailwind-dashboard.component').then(c => c.TailwindDashboardComponent),
    title: 'Dashboard - MEF Frontend Arquetipo'
  },
  {
    path: 'event-driven-demo',
    loadComponent: () => 
      import('./components/event-driven-demo/event-driven-demo.component').then(c => c.EventDrivenDemoComponent),
    title: 'Event-Driven Demo - MEF Frontend Arquetipo'
  },
  {
    path: 'user-management-demo',
    loadComponent: () => 
      import('./components/user-management-demo/user-management-demo.component').then(c => c.UserManagementDemoComponent),
    title: 'User Management Demo - MEF Frontend Arquetipo'
  },
  {
    path: 'enhanced-dashboard',
    loadComponent: () => 
      import('./components/enhanced-dashboard/enhanced-dashboard.component').then(c => c.EnhancedDashboardComponent),
    title: 'Enhanced Dashboard - MEF Frontend Arquetipo'
  },
  {
    path: 'mef-integration-demo',
    loadComponent: () =>
      import('./components/mef-integration-demo/mef-integration-demo.component').then(c => c.MefIntegrationDemoComponent),
    title: 'MEF Backend Integration Demo'
  },
  {
    path: 'mef-ui-demo',
    loadComponent: () =>
      import('./components/mef-ui-demo/mef-ui-demo.component').then(c => c.MefUiDemoComponent),
    title: 'MEF UI Design System Demo'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: '404 - Not Found'
  }
];