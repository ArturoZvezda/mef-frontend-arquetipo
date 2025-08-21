import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist.</p>
        <a routerLink="/dashboard" class="btn-home">
          🏠 Go Home
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .not-found-content h1 {
      font-size: 8rem;
      font-weight: bold;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .not-found-content h2 {
      font-size: 2rem;
      margin: 0 0 20px 0;
    }

    .not-found-content p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }

    .btn-home {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(255,255,255,0.2);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      border: 2px solid rgba(255,255,255,0.3);
      transition: all 0.3s;
    }

    .btn-home:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.5);
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {}