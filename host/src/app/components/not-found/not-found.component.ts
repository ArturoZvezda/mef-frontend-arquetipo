import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 text-white">
      <div class="text-center px-6 py-12 max-w-md mx-auto animate-fade-in">
        <div class="mb-8">
          <h1 class="text-8xl md:text-9xl font-bold mb-4 text-white drop-shadow-lg animate-pulse-slow">
            404
          </h1>
          <h2 class="text-2xl md:text-3xl font-semibold mb-4 text-balance">
            Página no encontrada
          </h2>
          <p class="text-lg md:text-xl opacity-90 mb-8 text-balance">
            La página que estás buscando no existe en el arquetipo.
          </p>
        </div>
        
        <div class="space-y-4">
          <a 
            routerLink="/dashboard" 
            class="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            🏠 Volver al Dashboard
          </a>
          
          <div class="text-sm opacity-75">
            <p>Rutas disponibles:</p>
            <ul class="mt-2 space-y-1">
              <li><code class="bg-white/20 px-2 py-1 rounded text-xs">/dashboard</code> - Dashboard principal</li>
              <li><code class="bg-white/20 px-2 py-1 rounded text-xs">/</code> - Página de inicio</li>
            </ul>
          </div>
        </div>

        <div class="mt-12 text-xs opacity-60">
          ✨ MEF Frontend Arquetipo - Error 404
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}