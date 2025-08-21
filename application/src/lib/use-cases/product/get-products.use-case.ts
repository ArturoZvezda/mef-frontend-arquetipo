import { Product } from '@mef-frontend-arquetipo/domain';
import { ProductRepositoryPort, LoggingPort } from '../../ports';
import { SearchProductsQuery, PaginatedProductsDto, ProductDto } from '../../dtos';

/**
 * Caso de uso: Obtener lista paginada de productos con filtros
 */
export class GetProductsUseCase {
  private logger: LoggingPort;

  constructor(
    private productRepository: ProductRepositoryPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('GetProductsUseCase');
  }

  /**
   * Ejecuta el caso de uso de búsqueda de productos
   * @param query - Parámetros de búsqueda y filtros
   * @returns Promise con la lista paginada de productos
   */
  async execute(query: SearchProductsQuery): Promise<PaginatedProductsDto> {
    this.logger.info('Searching products', {
      limit: query.limit,
      offset: query.offset,
      category: query.category,
      searchTerm: query.searchTerm,
      availableOnly: query.availableOnly
    });

    try {
      // Validar parámetros
      const limit = Math.min(Math.max(query.limit, 1), 100); // Entre 1 y 100
      const offset = Math.max(query.offset, 0); // Mínimo 0

      let result;

      // Decidir qué tipo de búsqueda hacer según los filtros
      if (query.searchTerm) {
        // Búsqueda por texto
        result = await this.productRepository.search(query.searchTerm, limit, offset);
      } else if (query.category) {
        // Búsqueda por categoría
        result = await this.productRepository.findByCategory(query.category, limit, offset);
      } else if (query.availableOnly) {
        // Solo productos disponibles
        result = await this.productRepository.findAvailable(limit, offset);
      } else {
        // Todos los productos
        result = await this.productRepository.findAll(limit, offset);
      }

      // Mapear entidades a DTOs
      const productDtos = result.products.map(product => this.mapToDto(product));

      // Filtrar por precio si se especifica
      let filteredProducts = productDtos;
      if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        filteredProducts = productDtos.filter(product => {
          const price = product.price.amount;
          const minValid = query.minPrice === undefined || price >= query.minPrice;
          const maxValid = query.maxPrice === undefined || price <= query.maxPrice;
          return minValid && maxValid;
        });
      }

      const paginatedResult: PaginatedProductsDto = {
        products: filteredProducts,
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore
      };

      this.logger.debug('Products retrieved successfully', {
        count: filteredProducts.length,
        total: result.total,
        hasMore: result.hasMore
      });

      return paginatedResult;

    } catch (error) {
      this.logger.error('Failed to get products', error as Error, { query });
      throw error;
    }
  }

  private mapToDto(product: Product): ProductDto {
    const price = product.getPrice();
    
    return {
      id: product.getId().getValue(),
      name: product.getName(),
      description: product.getDescription(),
      price: {
        amount: price.getAmount(),
        currency: price.getCurrency(),
        formatted: price.toFormattedString()
      },
      stock: product.getStock(),
      isAvailable: product.isAvailable(),
      createdAt: new Date().toISOString(), // TODO: Add createdAt to Product entity
      updatedAt: new Date().toISOString()  // TODO: Add updatedAt to Product entity
    };
  }
}