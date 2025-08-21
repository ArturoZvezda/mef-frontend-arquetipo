import { Product, ProductId, ProductNotFoundError } from '@mef-frontend-arquetipo/domain';
import { ProductRepositoryPort, LoggingPort } from '../../ports';
import { GetProductByIdQuery, ProductDto } from '../../dtos';

/**
 * Caso de uso: Obtener producto por ID
 */
export class GetProductByIdUseCase {
  private logger: LoggingPort;

  constructor(
    private productRepository: ProductRepositoryPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('GetProductByIdUseCase');
  }

  /**
   * Ejecuta el caso de uso de obtener producto por ID
   * @param query - Query con el ID del producto
   * @returns Promise con el DTO del producto encontrado
   * @throws ProductNotFoundError si el producto no existe
   */
  async execute(query: GetProductByIdQuery): Promise<ProductDto> {
    this.logger.info('Getting product by ID', { productId: query.productId });

    try {
      const productId = ProductId.fromString(query.productId);
      const product = await this.productRepository.findById(productId);

      if (!product) {
        this.logger.warn('Product not found', { productId: query.productId });
        throw new ProductNotFoundError(query.productId);
      }

      const productDto = this.mapToDto(product);
      
      this.logger.debug('Product retrieved successfully', {
        productId: productDto.id,
        name: productDto.name,
        isAvailable: productDto.isAvailable
      });

      return productDto;

    } catch (error) {
      this.logger.error('Failed to get product by ID', error as Error, { query });
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}