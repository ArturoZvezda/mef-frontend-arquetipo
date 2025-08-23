// MSW (Mock Service Worker) - Sistema de mocking para APIs
export * from './browser';
export * from './server';
export * from './handlers';

// Re-export handlers específicos para uso directo
export { userHandlers } from './handlers/user.handlers';
export { productHandlers } from './handlers/product.handlers';
export { authHandlers } from './handlers/auth.handlers';

/**
 * Configuración de MSW para diferentes entornos
 * 
 * Uso:
 * 
 * En desarrollo:
 * ```typescript
 * import { enableMocking } from '@mef-frontend-arquetipo/shared';
 * await enableMocking('development');
 * ```
 * 
 * En tests:
 * ```typescript
 * import { setupMSWForTests } from '@mef-frontend-arquetipo/shared';
 * setupMSWForTests();
 * ```
 * 
 * Endpoints disponibles:
 * 
 * AUTH:
 * - POST /api/auth/login
 * - POST /api/auth/refresh  
 * - GET /api/auth/me
 * - POST /api/auth/logout
 * - POST /api/auth/forgot-password
 * - GET /api/auth/permissions
 * 
 * USERS:
 * - GET /api/users (con filtros y paginación)
 * - GET /api/users/:id
 * - POST /api/users
 * - PUT /api/users/:id
 * - DELETE /api/users/:id
 * - PATCH /api/users/:id/activate
 * 
 * PRODUCTS:
 * - GET /api/products (con filtros y paginación)
 * - GET /api/products/:id
 * - POST /api/products
 * - POST /api/products/:id/reserve
 * - GET /api/products/categories
 * - GET /api/products/stats
 */

export const MSW_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    PERMISSIONS: '/api/auth/permissions'
  },
  USERS: {
    LIST: '/api/users',
    GET: '/api/users/:id',
    CREATE: '/api/users',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id',
    ACTIVATE: '/api/users/:id/activate'
  },
  PRODUCTS: {
    LIST: '/api/products',
    GET: '/api/products/:id',
    CREATE: '/api/products',
    RESERVE: '/api/products/:id/reserve',
    CATEGORIES: '/api/products/categories',
    STATS: '/api/products/stats'
  }
} as const;

/**
 * Credenciales mock para testing
 */
export const MSW_TEST_CREDENTIALS = {
  ADMIN: {
    email: 'admin@mef.gob.pe',
    password: 'admin123'
  },
  USER: {
    email: 'user@mef.gob.pe', 
    password: 'user123'
  }
} as const;