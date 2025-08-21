import { QueryClient } from '@tanstack/query-core';

/**
 * Configuración global del QueryClient para TanStack Query
 * Según el ADR: Server cache/sync con @tanstack/angular-query
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por defecto
      staleTime: 5 * 60 * 1000,
      // Mantener en cache por 10 minutos después de que no se use
      gcTime: 10 * 60 * 1000,
      // Retry automático en caso de error
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch cuando la ventana vuelve a tener foco
      refetchOnWindowFocus: true,
      // Refetch cuando se reconecta la red
      refetchOnReconnect: true,
      // No refetch automático al montar
      refetchOnMount: true,
    },
    mutations: {
      // Retry para mutaciones críticas
      retry: 1,
      retryDelay: 1000,
    },
  },
};

/**
 * Factory para crear una instancia de QueryClient
 */
export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}

/**
 * Configuración para desarrollo (más logging)
 */
export const devQueryClientConfig = {
  ...queryClientConfig,
  defaultOptions: {
    ...queryClientConfig.defaultOptions,
    queries: {
      ...queryClientConfig.defaultOptions.queries,
      // En desarrollo, cache más corto para ver cambios rápido
      staleTime: 1 * 60 * 1000, // 1 minuto
      gcTime: 2 * 60 * 1000,    // 2 minutos
    },
  },
};

/**
 * Factory para crear QueryClient en desarrollo
 */
export function createDevQueryClient(): QueryClient {
  const queryClient = new QueryClient(devQueryClientConfig);
  
  // Agregar logging en desarrollo
  queryClient.setDefaultOptions({
    queries: {
      ...devQueryClientConfig.defaultOptions.queries,
      meta: {
        errorMessage: 'Failed to fetch data',
      },
    },
    mutations: {
      ...devQueryClientConfig.defaultOptions.mutations,
      meta: {
        errorMessage: 'Failed to save data',
      },
    },
  });

  return queryClient;
}