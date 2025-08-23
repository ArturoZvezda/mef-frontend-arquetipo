import { setupWorker } from 'msw/browser';
import { userHandlers } from './handlers/user.handlers';
import { productHandlers } from './handlers/product.handlers';
import { authHandlers } from './handlers/auth.handlers';

/**
 * Configuración de MSW (Mock Service Worker) para interceptar requests HTTP
 * Útil para desarrollo y testing sin necesidad de backend real
 */

// Combinar todos los handlers
const handlers = [
  ...userHandlers,
  ...productHandlers,
  ...authHandlers
];

// Configurar el service worker
export const worker = setupWorker(...handlers);

/**
 * Configuración para diferentes entornos
 */
export const mswConfig = {
  development: {
    // En desarrollo, interceptar solo algunos endpoints
    onUnhandledRequest: 'warn' as const,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    }
  },
  test: {
    // En tests, ser más estricto
    onUnhandledRequest: 'error' as const,
  },
  production: {
    // En producción, MSW no debería estar activo
    onUnhandledRequest: 'bypass' as const,
  }
};

/**
 * Inicializar MSW basado en el entorno
 */
export async function enableMocking(environment: 'development' | 'test' | 'production' = 'development') {
  if (environment === 'production') {
    console.warn('🚫 MSW no debe estar activo en producción');
    return;
  }

  const config = mswConfig[environment];

  try {
    await worker.start({
      ...config,
      quiet: environment === 'test', // Silenciar logs en tests
    });

    if (environment === 'development') {
      console.log('🔧 MSW activado en modo desarrollo');
      console.log('📡 Interceptando:', handlers.length, 'endpoints');
      console.log('🎯 Endpoints disponibles:');
      
      // Log de endpoints para debugging
      const endpoints = handlers.map(handler => {
        const info = handler.info;
        const method = typeof info.method === 'string' ? info.method.toUpperCase() : info.method.toString();
        return `  ${method} ${info.path}`;
      }).sort();
      
      endpoints.forEach(endpoint => console.log(endpoint));
    }

  } catch (error) {
    console.error('❌ Error iniciando MSW:', error);
    throw error;
  }
}

/**
 * Resetear todos los handlers (útil en tests)
 */
export function resetMSW() {
  worker.resetHandlers();
}

/**
 * Agregar handlers dinámicamente
 */
export function addMSWHandlers(...newHandlers: any[]) {
  worker.use(...newHandlers);
}

/**
 * Obtener estadísticas de requests interceptados
 */
export function getMSWStats() {
  // En una implementación real, esto podría trackear requests
  return {
    handlersCount: handlers.length,
    interceptedRequests: 0, // Implementar counter si es necesario
    environment: 'browser'
  };
}