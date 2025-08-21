/**
 * Query Keys para TanStack Query
 * Proporciona keys tipadas y jerarquizadas para cache invalidation
 */

export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    search: (term: string) => [...queryKeys.users.all, 'search', term] as const,
  },

  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (term: string) => [...queryKeys.products.all, 'search', term] as const,
    categories: () => [...queryKeys.products.all, 'categories'] as const,
    category: (category: string) => 
      [...queryKeys.products.categories(), category] as const,
    available: () => [...queryKeys.products.all, 'available'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    history: () => [...queryKeys.notifications.all, 'history'] as const,
  },

  // Analytics/Metrics (para futuras features)
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    reports: () => [...queryKeys.analytics.all, 'reports'] as const,
  },
} as const;

/**
 * Utilidades para invalidar cache
 */
export const invalidationHelpers = {
  /**
   * Invalidar todas las queries de usuarios
   */
  invalidateAllUsers: () => queryKeys.users.all,

  /**
   * Invalidar listas de usuarios (mantiene detalles)
   */
  invalidateUserLists: () => queryKeys.users.lists(),

  /**
   * Invalidar un usuario específico
   */
  invalidateUser: (id: string) => queryKeys.users.detail(id),

  /**
   * Invalidar todas las queries de productos
   */
  invalidateAllProducts: () => queryKeys.products.all,

  /**
   * Invalidar listas de productos
   */
  invalidateProductLists: () => queryKeys.products.lists(),

  /**
   * Invalidar un producto específico
   */
  invalidateProduct: (id: string) => queryKeys.products.detail(id),

  /**
   * Invalidar productos de una categoría
   */
  invalidateProductCategory: (category: string) => 
    queryKeys.products.category(category),

  /**
   * Invalidar productos disponibles
   */
  invalidateAvailableProducts: () => queryKeys.products.available(),
};