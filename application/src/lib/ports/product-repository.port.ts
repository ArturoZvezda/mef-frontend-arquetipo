import { Product, ProductId } from '@mef-frontend-arquetipo/domain';

/**
 * Puerto para repositorio de productos - Define el contrato para persistencia
 * Implementado por adapters en la capa de infraestructura
 */
export interface ProductRepositoryPort {
  /**
   * Buscar producto por ID
   * @param id - Identificador único del producto
   * @returns Producto encontrado o null si no existe
   */
  findById(id: ProductId): Promise<Product | null>;

  /**
   * Buscar productos por categoría
   * @param category - Categoría de productos
   * @param limit - Límite de resultados
   * @param offset - Offset para paginación
   * @returns Lista de productos de la categoría
   */
  findByCategory(category: string, limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Buscar productos disponibles (con stock > 0)
   * @param limit - Límite de resultados
   * @param offset - Offset para paginación
   * @returns Lista de productos disponibles
   */
  findAvailable(limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Buscar productos por texto (nombre o descripción)
   * @param searchTerm - Término de búsqueda
   * @param limit - Límite de resultados
   * @param offset - Offset para paginación
   * @returns Lista de productos que coinciden con la búsqueda
   */
  search(searchTerm: string, limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Obtener todos los productos con paginación
   * @param limit - Número máximo de productos a retornar
   * @param offset - Número de productos a saltar
   * @returns Lista paginada de productos
   */
  findAll(limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Guardar producto (crear o actualizar)
   * @param product - Producto a guardar
   * @returns Producto guardado
   */
  save(product: Product): Promise<Product>;

  /**
   * Eliminar producto por ID
   * @param id - Identificador del producto a eliminar
   * @returns true si se eliminó, false si no existía
   */
  deleteById(id: ProductId): Promise<boolean>;

  /**
   * Actualizar stock de un producto
   * @param id - ID del producto
   * @param newStock - Nuevo valor de stock
   * @returns Producto actualizado
   */
  updateStock(id: ProductId, newStock: number): Promise<Product>;

  /**
   * Contar total de productos en el sistema
   * @returns Número total de productos
   */
  count(): Promise<number>;
}