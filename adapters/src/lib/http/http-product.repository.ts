import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { 
  Product, 
  ProductId, 
  Money,
  ProductNotFoundError 
} from '@mef-frontend-arquetipo/domain';
import { ProductRepositoryPort } from '@mef-frontend-arquetipo/application';
import { HttpClientService, PaginatedApiResponse } from './http-client.service';

/**
 * Estructura de datos del producto en la API
 */
interface ProductApiData {
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
 * Payload para crear producto
 */
interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category?: string;
}

/**
 * Payload para actualizar producto
 */
interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stock?: number;
  category?: string;
}

/**
 * Implementación HTTP del repositorio de productos
 * Se conecta con el backend REST API
 */
@Injectable({
  providedIn: 'root'
})
export class HttpProductRepository implements ProductRepositoryPort {
  private readonly BASE_ENDPOINT = 'products';

  constructor(private httpClient: HttpClientService) {}

  /**
   * Buscar producto por ID
   */
  async findById(id: ProductId): Promise<Product | null> {
    try {
      const productData = await firstValueFrom(
        this.httpClient.get<ProductApiData>(`${this.BASE_ENDPOINT}/${id.getValue()}`)
      );
      
      return this.mapToDomain(productData);
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Buscar productos por categoría
   */
  async findByCategory(category: string, limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<ProductApiData>(`${this.BASE_ENDPOINT}`, {
          category,
          limit,
          offset
        })
      );

      const products = response.data.map(productData => this.mapToDomain(productData));

      return {
        products,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * Buscar productos disponibles (con stock > 0)
   */
  async findAvailable(limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<ProductApiData>(`${this.BASE_ENDPOINT}`, {
          availableOnly: true,
          limit,
          offset
        })
      );

      const products = response.data.map(productData => this.mapToDomain(productData));

      return {
        products,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      };
    } catch (error) {
      console.error('Error fetching available products:', error);
      throw error;
    }
  }

  /**
   * Buscar productos por texto (nombre o descripción)
   */
  async search(searchTerm: string, limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<ProductApiData>(`${this.BASE_ENDPOINT}/search`, {
          q: searchTerm,
          limit,
          offset
        })
      );

      const products = response.data.map(productData => this.mapToDomain(productData));

      return {
        products,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los productos con paginación
   */
  async findAll(limit: number, offset: number): Promise<{
    products: Product[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<ProductApiData>(`${this.BASE_ENDPOINT}`, {
          limit,
          offset
        })
      );

      const products = response.data.map(productData => this.mapToDomain(productData));

      return {
        products,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Guardar producto (crear o actualizar)
   */
  async save(product: Product): Promise<Product> {
    try {
      // Intentar buscar el producto existente
      const existingProduct = await this.findById(product.getId());
      
      if (existingProduct) {
        // Producto existe -> actualizar
        const updatePayload: UpdateProductPayload = {
          name: product.getName(),
          description: product.getDescription(),
          price: product.getPrice().getAmount(),
          currency: product.getPrice().getCurrency(),
          stock: product.getStock()
        };

        const updatedProductData = await firstValueFrom(
          this.httpClient.put<ProductApiData>(
            `${this.BASE_ENDPOINT}/${product.getId().getValue()}`, 
            updatePayload
          )
        );

        return this.mapToDomain(updatedProductData);
      } else {
        // Producto no existe -> crear
        const createPayload: CreateProductPayload = {
          name: product.getName(),
          description: product.getDescription(),
          price: product.getPrice().getAmount(),
          currency: product.getPrice().getCurrency(),
          stock: product.getStock()
        };

        const createdProductData = await firstValueFrom(
          this.httpClient.post<ProductApiData>(`${this.BASE_ENDPOINT}`, createPayload)
        );

        return this.mapToDomain(createdProductData);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  /**
   * Eliminar producto por ID
   */
  async deleteById(id: ProductId): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpClient.delete(`${this.BASE_ENDPOINT}/${id.getValue()}`)
      );
      return true;
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Actualizar stock de un producto
   */
  async updateStock(id: ProductId, newStock: number): Promise<Product> {
    try {
      const updatedProductData = await firstValueFrom(
        this.httpClient.put<ProductApiData>(
          `${this.BASE_ENDPOINT}/${id.getValue()}/stock`, 
          { stock: newStock }
        )
      );

      return this.mapToDomain(updatedProductData);
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        throw new ProductNotFoundError(id.getValue());
      }
      throw error;
    }
  }

  /**
   * Contar total de productos en el sistema
   */
  async count(): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<ProductApiData>(`${this.BASE_ENDPOINT}`, {
          limit: 1,
          offset: 0
        })
      );

      return response.pagination.total;
    } catch (error) {
      console.error('Error counting products:', error);
      throw error;
    }
  }

  /**
   * Mapear datos de la API a entidad de dominio
   */
  private mapToDomain(productData: ProductApiData): Product {
    const productData2 = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      currency: productData.currency,
      stock: productData.stock
    };

    return Product.fromData(productData2);
  }
}