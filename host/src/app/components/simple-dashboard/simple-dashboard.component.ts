import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>🎯 MEF Frontend Arquetipo</h1>
        <p class="subtitle">Arquitectura DDD + Hexagonal + Angular 18 + TanStack Query + Signals</p>
      </header>

      <div class="architecture-grid">
        <div class="arch-card">
          <h3>🏗️ Domain Driven Design</h3>
          <ul>
            <li>✅ Entities con lógica de negocio</li>
            <li>✅ Value Objects inmutables</li>
            <li>✅ Domain Events</li>
            <li>✅ Domain Errors</li>
          </ul>
        </div>

        <div class="arch-card">
          <h3>🔗 Hexagonal Architecture</h3>
          <ul>
            <li>✅ Puertos (interfaces)</li>
            <li>✅ Adaptadores HTTP/Storage</li>
            <li>✅ Casos de uso independientes</li>
            <li>✅ Inversión de dependencias</li>
          </ul>
        </div>

        <div class="arch-card">
          <h3>🚀 Angular 18 LTS</h3>
          <ul>
            <li>✅ Standalone Components</li>
            <li>✅ Angular Signals</li>
            <li>✅ TypeScript 5.3 Strict</li>
            <li>✅ Native Federation</li>
          </ul>
        </div>

        <div class="arch-card">
          <h3>📊 State Management</h3>
          <ul>
            <li>✅ TanStack Query (Server State)</li>
            <li>✅ Angular Signals (Local State)</li>
            <li>✅ RxJS Event Bus</li>
            <li>✅ Form State Management</li>
          </ul>
        </div>
      </div>

      <div class="demo-section">
        <h2>🎮 Demo Interactivo</h2>
        <div class="demo-grid">
          <button class="demo-button" (click)="showNotification()">
            🔔 Mostrar Notificación
          </button>
          <button class="demo-button" (click)="toggleTheme()">
            {{ isDark ? '☀️' : '🌙' }} Cambiar Tema
          </button>
          <button class="demo-button" (click)="simulateLoading()">
            ⏳ Simular Carga
          </button>
          <button class="demo-button" (click)="showStats()">
            📊 Ver Estadísticas
          </button>
        </div>

        <div *ngIf="isLoading" class="loading-demo">
          <p>⏳ Cargando datos...</p>
        </div>

        <div *ngIf="showStatsPanel" class="stats-panel">
          <h3>📈 Estadísticas del Arquetipo</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <strong>5</strong>
              <span>Capas Arquitectónicas</span>
            </div>
            <div class="stat-item">
              <strong>12</strong>
              <span>Patrones Implementados</span>
            </div>
            <div class="stat-item">
              <strong>15</strong>
              <span>Casos de Uso</span>
            </div>
            <div class="stat-item">
              <strong>8</strong>
              <span>Adaptadores</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>📚 Documentación</h2>
        <div class="docs-grid">
          <div class="doc-card">
            <h4>📖 README.md</h4>
            <p>Documentación completa del proyecto</p>
          </div>
          <div class="doc-card">
            <h4>🛠️ INSTRUCCIONES_ARQUETIPO_FRONTEND.md</h4>
            <p>Pasos para recrear el arquetipo</p>
          </div>
          <div class="doc-card">
            <h4>📋 adr.txt</h4>
            <p>Architecture Decision Record</p>
          </div>
        </div>
      </div>

      <footer class="dashboard-footer">
        <p>✨ MEF Frontend Arquetipo - Ejemplo completo de arquitectura moderna</p>
        <p><small>🎯 DDD + Clean Architecture + Angular 18 + TanStack Query + Signals</small></p>
      </footer>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .architecture-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .arch-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }

    .arch-card h3 {
      color: #2d3748;
      margin: 0 0 16px 0;
      font-size: 1.2rem;
    }

    .arch-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .arch-card li {
      padding: 4px 0;
      color: #4a5568;
    }

    .demo-section, .info-section {
      margin-bottom: 40px;
    }

    .demo-section h2, .info-section h2 {
      color: #2d3748;
      border-bottom: 3px solid #667eea;
      padding-bottom: 8px;
      margin-bottom: 24px;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .demo-button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .demo-button:active {
      transform: translateY(0);
    }

    .loading-demo {
      text-align: center;
      padding: 20px;
      background: #f7fafc;
      border-radius: 8px;
      color: #4a5568;
      font-size: 1.1rem;
    }

    .stats-panel {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }

    .stats-panel h3 {
      color: #2d3748;
      margin: 0 0 20px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .stat-item strong {
      display: block;
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 4px;
    }

    .stat-item span {
      font-size: 0.9rem;
      color: #4a5568;
    }

    .docs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .doc-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-top: 4px solid #48bb78;
    }

    .doc-card h4 {
      color: #2d3748;
      margin: 0 0 8px 0;
    }

    .doc-card p {
      color: #4a5568;
      margin: 0;
      font-size: 0.9rem;
    }

    .dashboard-footer {
      text-align: center;
      padding: 40px 20px;
      background: #2d3748;
      color: white;
      border-radius: 8px;
      margin-top: 40px;
    }

    .dashboard-footer p {
      margin: 4px 0;
    }

    /* Dark mode styles */
    .dark .dashboard {
      background: #1a202c;
      color: white;
    }

    .dark .arch-card,
    .dark .stats-panel,
    .dark .doc-card {
      background: #2d3748;
      color: white;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 10px;
      }
      
      .dashboard-header h1 {
        font-size: 2rem;
      }
      
      .architecture-grid {
        grid-template-columns: 1fr;
      }
      
      .demo-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SimpleDashboardComponent {
  isDark = false;
  isLoading = false;
  showStatsPanel = false;

  showNotification() {
    alert('🎉 ¡Notificación del arquetipo! Sistema de notificaciones funcionando correctamente.');
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark', this.isDark);
  }

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('✅ Carga completada! Estado de loading gestionado correctamente.');
    }, 2000);
  }

  showStats() {
    this.showStatsPanel = !this.showStatsPanel;
  }
}