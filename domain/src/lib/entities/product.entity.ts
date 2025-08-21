import { ProductId } from '../value-objects/product-id.vo';
import { Money } from '../value-objects/money.vo';
import { ProductNotAvailableError } from '../domain-errors/product.errors';

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
}

export class Product {
  constructor(
    private readonly id: ProductId,
    private readonly name: string,
    private readonly description: string,
    private readonly price: Money,
    private stock: number
  ) {}

  getId(): ProductId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): Money {
    return this.price;
  }

  getStock(): number {
    return this.stock;
  }

  // Regla de negocio: Reservar stock
  reserveStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    if (this.stock < quantity) {
      throw new ProductNotAvailableError(
        `Not enough stock. Available: ${this.stock}, Requested: ${quantity}`
      );
    }

    this.stock -= quantity;
  }

  // Regla de negocio: Verificar disponibilidad
  isAvailable(): boolean {
    return this.stock > 0;
  }

  static fromData(data: ProductData): Product {
    return new Product(
      ProductId.fromString(data.id),
      data.name,
      data.description,
      Money.create(data.price, data.currency),
      data.stock
    );
  }
}