import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TailwindDashboardComponent } from '../tailwind-dashboard/tailwind-dashboard.component';
import { EventDrivenDemoComponent } from '../event-driven-demo/event-driven-demo.component';

@Component({
  selector: 'app-enhanced-dashboard',
  standalone: true,
  imports: [CommonModule, TailwindDashboardComponent, EventDrivenDemoComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      
      <!-- Header Mejorado -->
      <header class="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4 animate-fade-in">
            🎯 MEF Frontend Arquetipo
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-balance animate-fade-in animation-delay-150">
            DDD + Hexagonal + Event-Driven + Angular 18 + TanStack Query + Tailwind CSS
          </p>
          <div class="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in animation-delay-300">
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Angular 18 LTS
            </span>
            <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              Event-Driven Design
            </span>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              Domain Events
            </span>
            <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
              Event Handlers
            </span>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- Event-Driven Demo Section -->
        <section class="mb-16">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📡 Event-Driven Architecture
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sistema completo de eventos del dominio con handlers automáticos y logging en tiempo real
            </p>
          </div>
          
          <app-event-driven-demo></app-event-driven-demo>
        </section>

        <!-- Architecture Info -->
        <section class="mb-16">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🏗️ Arquitectura Completa
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Implementación completa de DDD, Arquitectura Hexagonal y Event-Driven Design
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- DDD Card -->
            <div class="card-hover animate-slide-up">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                  🎯
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Domain-Driven Design</h3>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>✅ Entidades y Value Objects</li>
                <li>✅ Agregados y Repositorios</li>
                <li>✅ Domain Services</li>
                <li>✅ Domain Events</li>
              </ul>
            </div>

            <!-- Hexagonal Architecture -->
            <div class="card-hover animate-slide-up animation-delay-75">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                  🔶
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Hexagonal Architecture</h3>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>✅ Puertos y Adaptadores</li>
                <li>✅ Casos de Uso</li>
                <li>✅ Inversión de Dependencias</li>
                <li>✅ Clean Architecture</li>
              </ul>
            </div>

            <!-- Event-Driven -->
            <div class="card-hover animate-slide-up animation-delay-150">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
                  📡
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Event-Driven Design</h3>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>✅ Domain Events</li>
                <li>✅ Event Handlers</li>
                <li>✅ Event Bus (RxJS)</li>
                <li>✅ Async Communication</li>
              </ul>
            </div>

            <!-- Tech Stack -->
            <div class="card-hover animate-slide-up animation-delay-300">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mr-3">
                  🛠️
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tech Stack</h3>
              </div>
              <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>✅ Angular 18 + Signals</li>
                <li>✅ TanStack Query</li>
                <li>✅ Tailwind CSS v3</li>
                <li>✅ Native Federation</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Performance Metrics -->
        <section class="mb-16">
          <div class="card">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              📊 Métricas del Arquetipo
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Casos de Uso</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">8+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Adaptadores</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">3+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Domain Events</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">2+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Event Handlers</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Original Dashboard Content -->
        <section>
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Demo Interactivo
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Prueba todas las funcionalidades del arquetipo en acción
            </p>
          </div>
          
          <!-- Aquí incluimos el dashboard original pero sin el header -->
          <div class="space-y-8">
            <div class="card">
              <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  🎮 Panel de Control
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                  Interactúa con los diferentes componentes del arquetipo
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button class="btn-primary">
                    🎯 Probar Casos de Uso
                  </button>
                  <button class="btn-secondary">
                    📡 Ver Event Handlers
                  </button>
                  <button class="btn-success">
                    🔄 Simular Workflows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <!-- Footer -->
      <footer class="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-gray-600 dark:text-gray-300">
            🚀 MEF Frontend Arquetipo - Implementación completa de DDD + Hexagonal + Event-Driven Architecture
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Angular 18 LTS • TypeScript 5.3 • Tailwind CSS • TanStack Query • RxJS
          </p>
        </div>
      </footer>
    </div>
  `
})
export class EnhancedDashboardComponent {}