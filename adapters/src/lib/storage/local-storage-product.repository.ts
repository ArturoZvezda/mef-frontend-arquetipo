import { Injectable } from '@angular/core';
import { Product, ProductId, Money } from '@mef-frontend-arquetipo/domain';
import { ProductRepositoryPort } from '@mef-frontend-arquetipo/application';
import { StorageService } from './storage.service';

/**
 * Datos de producto para localStorage
 */
interface ProductStorageData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Implementación de repositorio de productos usando localStorage
 * Útil para desarrollo, testing y funcionalidad offline
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageProductRepository implements ProductRepositoryPort {
  private readonly STORAGE_KEY = 'mef_products';

  constructor(private storage: StorageService) {}

  async findById(id: ProductId): Promise<Product | null> {
    const products = this.getAllProducts();
    const productData = products.find(p => p.id === id.getValue());
    return productData ? this.mapToDomain(productData) : null;
  }

  async findByCategory(category: string, limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    const allProducts = this.getAllProducts();
    const categoryProducts = allProducts.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase()
    );

    return this.paginateResults(categoryProducts, limit, offset);
  }

  async findAvailable(limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    const allProducts = this.getAllProducts();
    const availableProducts = allProducts.filter(p => p.stock > 0);

    return this.paginateResults(availableProducts, limit, offset);
  }

  async search(searchTerm: string, limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    const allProducts = this.getAllProducts();
    const term = searchTerm.toLowerCase();
    
    const matchingProducts = allProducts.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );

    return this.paginateResults(matchingProducts, limit, offset);
  }

  async findAll(limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    const allProducts = this.getAllProducts();
    return this.paginateResults(allProducts, limit, offset);
  }

  async save(product: Product): Promise<Product> {
    const products = this.getAllProducts();
    const existingIndex = products.findIndex(p => p.id === product.getId().getValue());

    const productData: ProductStorageData = {
      id: product.getId().getValue(),
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice().getAmount(),
      currency: product.getPrice().getCurrency(),
      stock: product.getStock(),
      createdAt: existingIndex >= 0 
        ? products[existingIndex].createdAt 
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      // Actualizar producto existente
      products[existingIndex] = productData;
    } else {
      // Agregar nuevo producto
      products.push(productData);
    }

    this.saveAllProducts(products);
    return product;
  }

  async deleteById(id: ProductId): Promise<boolean> {
    const products = this.getAllProducts();
    const initialLength = products.length;
    const filteredProducts = products.filter(p => p.id !== id.getValue());

    if (filteredProducts.length === initialLength) {
      return false; // Producto no encontrado
    }

    this.saveAllProducts(filteredProducts);
    return true;
  }

  async updateStock(id: ProductId, newStock: number): Promise<Product> {
    const products = this.getAllProducts();
    const productIndex = products.findIndex(p => p.id === id.getValue());

    if (productIndex === -1) {
      throw new Error(`Product with id ${id.getValue()} not found`);
    }

    // Actualizar solo el stock
    products[productIndex].stock = newStock;
    products[productIndex].updatedAt = new Date().toISOString();

    this.saveAllProducts(products);
    return this.mapToDomain(products[productIndex]);
  }

  async count(): Promise<number> {
    return this.getAllProducts().length;
  }

  /**
   * Aplicar paginación a una lista de productos
   */
  private paginateResults(products: ProductStorageData[], limit: number, offset: number): {
    products: Product[];
    total: number;
    hasMore: boolean;
  } {
    const total = products.length;
    const paginatedProducts = products.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      products: paginatedProducts.map(productData => this.mapToDomain(productData)),
      total,
      hasMore
    };
  }

  /**
   * Obtener todos los productos del localStorage
   */
  private getAllProducts(): ProductStorageData[] {
    return this.storage.getItem<ProductStorageData[]>(this.STORAGE_KEY) || [];
  }

  /**
   * Guardar todos los productos en localStorage
   */
  private saveAllProducts(products: ProductStorageData[]): void {
    this.storage.setItem(this.STORAGE_KEY, products);
  }

  /**
   * Mapear datos de storage a entidad de dominio
   */
  private mapToDomain(productData: ProductStorageData): Product {
    const domainData = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      currency: productData.currency,
      stock: productData.stock
    };

    return Product.fromData(domainData);
  }

  /**
   * Limpiar todos los datos (útil para testing)
   */
  clear(): void {
    this.storage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Poblar con datos de prueba
   */
  seedWithTestData(): void {
    const testProducts: ProductStorageData[] = [
      {
        id: '1',
        name: 'Laptop Dell XPS 13',
        description: 'High-performance ultrabook with Intel i7 processor',
        price: 1299.99,
        currency: 'USD',
        stock: 15,
        category: 'Electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with USB receiver',
        price: 29.99,
        currency: 'USD',
        stock: 50,
        category: 'Electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Office Desk',
        description: 'Standing desk with adjustable height',
        price: 299.99,
        currency: 'USD',
        stock: 8,
        category: 'Furniture',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Coffee Mug',
        description: 'Ceramic mug with company logo',
        price: 12.99,
        currency: 'USD',
        stock: 0, // Out of stock para testing
        category: 'Office Supplies',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.saveAllProducts(testProducts);
  }
}