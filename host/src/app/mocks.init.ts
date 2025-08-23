/**
 * Inicialización de MSW (Mock Service Worker) para la aplicación
 * Solo se activa en desarrollo para interceptar llamadas HTTP
 */

import { enableMocking } from '@mef-frontend-arquetipo/shared';

/**
 * Función para inicializar MSW basado en el entorno
 */
export async function initializeMSW() {
  // Browser-safe environment detection
  const isDev = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
  // Solo activar en desarrollo
  if (isDev) {
    try {
      await enableMocking('development');
    } catch (error) {
      console.error('❌ Error inicializando MSW:', error);
    }
  }
}

/**
 * Flag para controlar MSW desde el browser console
 * Útil para debugging
 */
if (typeof window !== 'undefined') {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  (window as any).MSW_ENABLED = isDev;
  
  if (isDev) {
    console.log('🔧 MSW disponible. Para desactivar: window.MSW_ENABLED = false');
  }
}