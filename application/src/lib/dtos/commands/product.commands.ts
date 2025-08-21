/**
 * Command para crear un nuevo producto
 */
export interface CreateProductCommand {
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category?: string;
}

/**
 * Command para actualizar un producto existente
 */
export interface UpdateProductCommand {
  productId: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stock?: number;
  category?: string;
}

/**
 * Command para reservar stock de un producto
 */
export interface ReserveProductStockCommand {
  productId: string;
  quantity: number;
  userId: string;
}

/**
 * Command para actualizar solo el stock de un producto
 */
export interface UpdateProductStockCommand {
  productId: string;
  newStock: number;
}

/**
 * Command para eliminar un producto
 */
export interface DeleteProductCommand {
  productId: string;
}

/**
 * Query para obtener producto por ID
 */
export interface GetProductByIdQuery {
  productId: string;
}

/**
 * Query para buscar productos
 */
export interface SearchProductsQuery {
  limit: number;
  offset: number;
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Query para obtener productos disponibles
 */
export interface GetAvailableProductsQuery {
  limit: number;
  offset: number;
  sortBy?: 'name' | 'price' | 'stock';
  sortOrder?: 'asc' | 'desc';
}