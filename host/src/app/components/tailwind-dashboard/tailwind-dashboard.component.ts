import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tailwind-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <!-- Header -->
      <header class="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4 animate-fade-in">
            🎯 MEF Frontend Arquetipo
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-balance animate-fade-in animation-delay-150">
            Arquitectura DDD + Hexagonal + Angular 18 + TanStack Query + Signals + Tailwind CSS
          </p>
          <div class="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in animation-delay-300">
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Angular 18 LTS
            </span>
            <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              TypeScript 5.3
            </span>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              Tailwind CSS
            </span>
            <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
              Native Federation
            </span>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Architecture Grid -->
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🏗️ Arquitectura Implementada
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- DDD Card -->
            <div class="card-hover animate-slide-up">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                  🎯
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Domain Driven Design
                </h3>
              </div>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Entities con lógica de negocio
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Value Objects inmutables
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Domain Events
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Domain Errors
                </li>
              </ul>
            </div>

            <!-- Hexagonal Architecture Card -->
            <div class="card-hover animate-slide-up animation-delay-75">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
                  🔗
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Hexagonal Architecture
                </h3>
              </div>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Puertos (interfaces)
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Adaptadores HTTP/Storage
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Casos de uso independientes
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Inversión de dependencias
                </li>
              </ul>
            </div>

            <!-- Angular 18 Card -->
            <div class="card-hover animate-slide-up animation-delay-150">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mr-3">
                  🚀
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Angular 18 LTS
                </h3>
              </div>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Standalone Components
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Angular Signals
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  TypeScript 5.3 Strict
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Native Federation
                </li>
              </ul>
            </div>

            <!-- State Management Card -->
            <div class="card-hover animate-slide-up animation-delay-300">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                  📊
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  State Management
                </h3>
              </div>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  TanStack Query (Server)
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Angular Signals (Local)
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  RxJS Event Bus
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Form State Management
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Interactive Demo Section -->
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🎮 Demo Interactivo
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button 
              (click)="showNotification()" 
              class="btn-primary group relative overflow-hidden">
              <span class="relative z-10 flex items-center justify-center">
                🔔 Notificación
              </span>
              <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            
            <button 
              (click)="toggleTheme()" 
              class="group relative overflow-hidden px-4 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              [class]="isDark ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400' : 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-600'">
              <span class="relative z-10 flex items-center justify-center">
                {{ isDark ? '☀️' : '🌙' }} {{ isDark ? 'Claro' : 'Oscuro' }}
              </span>
              <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            
            <button 
              (click)="simulateLoading()"
              [disabled]="isLoading"
              class="btn-secondary group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="relative z-10 flex items-center justify-center">
                <span *ngIf="!isLoading">⏳ Cargar</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <div class="loading-spinner mr-2"></div>
                  Cargando...
                </span>
              </span>
              <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            
            <button 
              (click)="showStats()"
              class="btn-success group relative overflow-hidden">
              <span class="relative z-10 flex items-center justify-center">
                📊 Estadísticas
              </span>
              <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>

          <!-- Loading Demo -->
          <div *ngIf="isLoading" class="card animate-slide-down mb-8">
            <div class="flex items-center justify-center py-8">
              <div class="loading-spinner w-8 h-8 text-blue-600 mr-4"></div>
              <span class="text-lg text-gray-600 dark:text-gray-300">
                ⏳ Simulando carga de datos del arquetipo...
              </span>
            </div>
          </div>

          <!-- Stats Panel -->
          <div *ngIf="showStatsPanel" class="card animate-slide-down mb-8">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              📈 Estadísticas del Arquetipo
              <button 
                (click)="showStats()"
                class="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">5</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Capas Arquitectónicas</div>
              </div>
              <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">12</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Patrones Implementados</div>
              </div>
              <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">15</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Casos de Uso</div>
              </div>
              <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">8</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Adaptadores</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Documentation Section -->
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            📚 Documentación
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="card-hover">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-xl">📖</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">README.md</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Documentación completa</p>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Documentación exhaustiva del proyecto con diagramas de arquitectura, guías de uso y mejores prácticas.
              </p>
            </div>

            <div class="card-hover">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-xl">🛠️</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Instrucciones</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Paso a paso</p>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Guía detallada para recrear el arquetipo desde cero, con comandos y configuraciones específicas.
              </p>
            </div>

            <div class="card-hover">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-xl">📋</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">ADR.txt</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Architecture Decisions</p>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Architecture Decision Record con las decisiones tecnológicas y patrones arquitectónicos adoptados.
              </p>
            </div>
          </div>
        </section>

        <!-- Technologies Section -->
        <section>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🚀 Stack Tecnológico
          </h2>
          <div class="card">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              <div class="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                <div class="text-2xl mb-2">🅰️</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">Angular 18</div>
              </div>
              <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div class="text-2xl mb-2">📘</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">TypeScript</div>
              </div>
              <div class="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg">
                <div class="text-2xl mb-2">🎨</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">Tailwind</div>
              </div>
              <div class="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div class="text-2xl mb-2">📊</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">TanStack</div>
              </div>
              <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div class="text-2xl mb-2">🧪</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">Jest</div>
              </div>
              <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 rounded-lg">
                <div class="text-2xl mb-2">📦</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">Nx</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p class="text-lg font-semibold text-gradient mb-2">
            ✨ MEF Frontend Arquetipo
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            Ejemplo completo de arquitectura moderna para aplicaciones Angular
          </p>
          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            🎯 DDD + Clean Architecture + Angular 18 + TanStack Query + Signals + Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  `
})
export class TailwindDashboardComponent {
  isDark = false;
  isLoading = false;
  showStatsPanel = false;

  constructor() {
    // Detectar tema inicial
    this.isDark = document.documentElement.classList.contains('dark');
  }

  showNotification() {
    // Crear notificación temporal con Tailwind
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <div class="font-medium">¡Notificación del arquetipo!</div>
          <div class="text-sm opacity-90">Sistema de notificaciones funcionando correctamente</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
    
    // Guardar preferencia
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.showNotification();
    }, 2000);
  }

  showStats() {
    this.showStatsPanel = !this.showStatsPanel;
  }
}