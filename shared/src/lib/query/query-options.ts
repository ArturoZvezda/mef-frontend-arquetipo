import { signal } from '@angular/core';
import { queryKeys } from './query-keys';
import { 
  GetUsersQuery, 
  GetUserByIdQuery,
  SearchProductsQuery,
  GetProductByIdQuery,
  UserDto,
  ProductDto,
  PaginatedUsersDto,
  PaginatedProductsDto
} from '@mef-frontend-arquetipo/application';

/**
 * Query Options para Users
 * Configuraciones reutilizables para queries de usuarios
 */
export const userQueries = {
  /**
   * Query para obtener lista paginada de usuarios
   */
  list: (query: GetUsersQuery) => ({
    queryKey: queryKeys.users.list({
      limit: query.limit,
      offset: query.offset,
      searchTerm: query.searchTerm,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    }),
    staleTime: 2 * 60 * 1000, // 2 minutos para listas
    gcTime: 5 * 60 * 1000,    // 5 minutos en cache
    meta: {
      errorMessage: 'Failed to load users',
    },
  }),

  /**
   * Query para obtener un usuario por ID
   */
  detail: (query: GetUserByIdQuery) => ({
    queryKey: queryKeys.users.detail(query.userId),
    staleTime: 5 * 60 * 1000, // 5 minutos para detalles
    gcTime: 10 * 60 * 1000,   // 10 minutos en cache
    meta: {
      errorMessage: `Failed to load user ${query.userId}`,
    },
  }),

  /**
   * Query para buscar usuarios
   */
  search: (searchTerm: string, limit: number = 20) => ({
    queryKey: queryKeys.users.search(searchTerm),
    staleTime: 1 * 60 * 1000, // 1 minuto para búsquedas
    enabled: searchTerm.length >= 2, // Solo buscar si hay al menos 2 caracteres
    meta: {
      errorMessage: 'Failed to search users',
    },
  }),
};

/**
 * Query Options para Products
 */
export const productQueries = {
  /**
   * Query para obtener lista de productos con filtros
   */
  list: (query: SearchProductsQuery) => ({
    queryKey: queryKeys.products.list({
      limit: query.limit,
      offset: query.offset,
      category: query.category,
      searchTerm: query.searchTerm,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      availableOnly: query.availableOnly,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    }),
    staleTime: 3 * 60 * 1000, // 3 minutos para listas de productos
    gcTime: 10 * 60 * 1000,   // 10 minutos en cache
    meta: {
      errorMessage: 'Failed to load products',
    },
  }),

  /**
   * Query para obtener un producto por ID
   */
  detail: (query: GetProductByIdQuery) => ({
    queryKey: queryKeys.products.detail(query.productId),
    staleTime: 5 * 60 * 1000, // 5 minutos para detalles
    gcTime: 15 * 60 * 1000,   // 15 minutos en cache (productos cambian menos)
    meta: {
      errorMessage: `Failed to load product ${query.productId}`,
    },
  }),

  /**
   * Query para productos disponibles
   */
  available: (limit: number = 50, offset: number = 0) => ({
    queryKey: queryKeys.products.available(),
    staleTime: 1 * 60 * 1000, // 1 minuto (stock cambia rápido)
    gcTime: 5 * 60 * 1000,
    meta: {
      errorMessage: 'Failed to load available products',
    },
  }),

  /**
   * Query para productos por categoría
   */
  byCategory: (category: string, limit: number = 50, offset: number = 0) => ({
    queryKey: queryKeys.products.category(category),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    meta: {
      errorMessage: `Failed to load products in category ${category}`,
    },
  }),

  /**
   * Query para búsqueda de productos
   */
  search: (searchTerm: string, limit: number = 20) => ({
    queryKey: queryKeys.products.search(searchTerm),
    staleTime: 2 * 60 * 1000,
    enabled: searchTerm.length >= 2,
    meta: {
      errorMessage: 'Failed to search products',
    },
  }),
};

/**
 * Query Options para casos especiales
 */
export const specialQueries = {
  /**
   * Query para dashboard data (múltiples recursos)
   */
  dashboard: () => ({
    queryKey: ['dashboard'],
    staleTime: 30 * 1000, // 30 segundos para dashboard
    gcTime: 2 * 60 * 1000,
    meta: {
      errorMessage: 'Failed to load dashboard data',
    },
  }),

  /**
   * Query infinita para scroll infinito
   */
  infiniteProducts: (filters: Partial<SearchProductsQuery> = {}) => ({
    queryKey: ['products', 'infinite', filters],
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    getNextPageParam: (lastPage: PaginatedProductsDto) => 
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    meta: {
      errorMessage: 'Failed to load more products',
    },
  }),
};