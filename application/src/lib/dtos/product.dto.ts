/**
 * DTO para transferencia de datos de producto entre capas
 */
export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  stock: number;
  category?: string;
  isAvailable: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * DTO para lista paginada de productos
 */
export interface PaginatedProductsDto {
  products: ProductDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * DTO para datos de entrada de producto (creación)
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category?: string;
}

/**
 * DTO para actualización de producto
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stock?: number;
  category?: string;
}

/**
 * Query parameters para búsqueda de productos
 */
export interface ProductSearchQuery {
  limit?: number;
  offset?: number;
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * DTO para operación de reserva de producto
 */
export interface ProductReservationDto {
  id: string;
  productId: string;
  quantity: number;
  userId: string;
  reservedAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'consumed' | 'cancelled';
}