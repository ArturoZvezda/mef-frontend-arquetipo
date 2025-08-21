import { Product, ProductId, Money } from '@mef-frontend-arquetipo/domain';
import { ProductRepositoryPort, LoggingPort, EventBusPort } from '../../ports';
import { CreateProductCommand, ProductDto } from '../../dtos';

/**
 * Caso de uso: Crear un nuevo producto en el sistema
 */
export class CreateProductUseCase {
  private logger: LoggingPort;

  constructor(
    private productRepository: ProductRepositoryPort,
    private eventBus: EventBusPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('CreateProductUseCase');
  }

  /**
   * Ejecuta el caso de uso de creación de producto
   * @param command - Datos del producto a crear
   * @returns Promise con el DTO del producto creado
   */
  async execute(command: CreateProductCommand): Promise<ProductDto> {
    this.logger.info('Starting product creation process', {
      name: command.name,
      price: command.price,
      currency: command.currency,
      stock: command.stock,
      category: command.category
    });

    try {
      // 1. Validar y crear value objects
      const productId = ProductId.generate();
      const price = Money.create(command.price, command.currency);

      // 2. Validar datos de entrada
      if (command.stock < 0) {
        throw new Error('Stock cannot be negative');
      }

      if (command.name.trim().length === 0) {
        throw new Error('Product name cannot be empty');
      }

      // 3. Crear entidad de dominio
      const product = new Product(
        productId,
        command.name.trim(),
        command.description.trim(),
        price,
        command.stock
      );

      this.logger.debug('Product entity created', {
        productId: productId.getValue(),
        name: command.name
      });

      // 4. Persistir producto
      const savedProduct = await this.productRepository.save(product);

      // 5. Publicar evento de dominio (si se requiere)
      // TODO: Crear ProductCreatedEvent si es necesario

      const productDto = this.mapToDto(savedProduct);

      this.logger.info('Product created successfully', {
        productId: productDto.id,
        name: productDto.name
      });

      return productDto;

    } catch (error) {
      this.logger.error('Failed to create product', error as Error, { command });
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