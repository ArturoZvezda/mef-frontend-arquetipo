import { 
  Product, 
  ProductId, 
  UserId, 
  ProductNotFoundError, 
  ProductNotAvailableError 
} from '@mef-frontend-arquetipo/domain';
import { 
  ProductRepositoryPort, 
  UserRepositoryPort, 
  NotificationPort,
  LoggingPort, 
  EventBusPort,
  ProductReservedEvent 
} from '../../ports';
import { ReserveProductStockCommand, ProductReservationDto } from '../../dtos';

/**
 * Caso de uso: Reservar stock de un producto
 * 
 * Este es un caso de uso crítico que debe manejar:
 * - Concurrencia (múltiples usuarios intentando reservar)
 * - Validación de stock disponible
 * - Reglas de negocio de reserva
 */
export class ReserveProductStockUseCase {
  private logger: LoggingPort;

  constructor(
    private productRepository: ProductRepositoryPort,
    private userRepository: UserRepositoryPort,
    private notification: NotificationPort,
    private eventBus: EventBusPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('ReserveProductStockUseCase');
  }

  /**
   * Ejecuta el caso de uso de reserva de stock
   * @param command - Datos de la reserva (producto, cantidad, usuario)
   * @returns Promise con los datos de la reserva
   * @throws ProductNotFoundError si el producto no existe
   * @throws ProductNotAvailableError si no hay stock suficiente
   */
  async execute(command: ReserveProductStockCommand): Promise<ProductReservationDto> {
    this.logger.info('Starting product stock reservation', {
      productId: command.productId,
      quantity: command.quantity,
      userId: command.userId
    });

    try {
      // 1. Validar datos de entrada
      if (command.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const productId = ProductId.fromString(command.productId);
      const userId = UserId.fromString(command.userId);

      // 2. Verificar que el usuario existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(`User with id ${command.userId} not found`);
      }

      // 3. Obtener producto
      const product = await this.productRepository.findById(productId);
      if (!product) {
        this.logger.warn('Product not found for reservation', { 
          productId: command.productId 
        });
        throw new ProductNotFoundError(command.productId);
      }

      // 4. Intentar reservar stock (aquí se aplican las reglas de negocio)
      const stockBeforeReservation = product.getStock();
      
      try {
        product.reserveStock(command.quantity);
      } catch (error) {
        this.logger.warn('Stock reservation failed', {
          productId: command.productId,
          requestedQuantity: command.quantity,
          availableStock: stockBeforeReservation
        });
        throw error;
      }

      // 5. Persistir cambios del producto
      const updatedProduct = await this.productRepository.save(product);

      // 6. Crear datos de la reserva
      const reservation: ProductReservationDto = {
        id: `reservation-${Date.now()}`,
        productId: command.productId,
        quantity: command.quantity,
        userId: command.userId,
        reservedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        status: 'active'
      };

      // 7. Publicar evento de dominio
      const productReservedEvent: ProductReservedEvent = {
        type: 'PRODUCT_RESERVED',
        occurredOn: new Date(),
        aggregateId: command.productId,
        payload: {
          productId: command.productId,
          quantity: command.quantity,
          userId: command.userId
        }
      };

      await this.eventBus.publish(productReservedEvent);

      // 8. Enviar notificación de confirmación (no bloqueante)
      this.notification.sendReservationConfirmation(
        user, 
        updatedProduct, 
        command.quantity
      ).catch(notificationError => {
        this.logger.error('Failed to send reservation confirmation', notificationError as Error, {
          userId: command.userId,
          productId: command.productId
        });
      });

      // 9. Verificar si quedó stock bajo y notificar
      const lowStockThreshold = 5; // Podría venir de configuración
      if (updatedProduct.getStock() <= lowStockThreshold && updatedProduct.getStock() > 0) {
        this.notification.sendLowStockAlert(
          updatedProduct,
          updatedProduct.getStock(),
          lowStockThreshold
        ).catch(alertError => {
          this.logger.error('Failed to send low stock alert', alertError as Error, {
            productId: command.productId
          });
        });
      }

      this.logger.info('Product stock reserved successfully', {
        productId: command.productId,
        quantity: command.quantity,
        userId: command.userId,
        newStock: updatedProduct.getStock(),
        previousStock: stockBeforeReservation
      });

      return reservation;

    } catch (error) {
      this.logger.error('Failed to reserve product stock', error as Error, { command });
      throw error;
    }
  }
}