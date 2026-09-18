import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Sign in · NexisTech Admin Portal',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
