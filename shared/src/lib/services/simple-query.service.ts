import { Injectable, inject, signal, computed } from '@angular/core';
import { injectQuery, injectMutation } from '@tanstack/angular-query-experimental';
import { 
  CreateUserCommand, 
  CreateProductCommand,
  UserDto,
  ProductDto
} from '@mef-frontend-arquetipo/application';
import { UiStateService } from '../signals/ui-state.signals';

/**
 * Service simplificado para demostrar TanStack Query + Signals
 * En un proyecto real, esto se conectaría con los adaptadores HTTP
 */
@Injectable({
  providedIn: 'root'
})
export class SimpleQueryService {
  private readonly uiState = inject(UiStateService);

  // 📦 Mock Data
  private mockUsers: UserDto[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      isActive: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
      isActive: true
    }
  ];

  private mockProducts: ProductDto[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop',
      price: { amount: 999, currency: 'USD', formatted: '$999.00' },
      stock: 10,
      category: 'Electronics',
      isAvailable: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Smartphone',
      description: 'Latest smartphone',
      price: { amount: 699, currency: 'USD', formatted: '$699.00' },
      stock: 5,
      category: 'Electronics',
      isAvailable: true,
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z'
    }
  ];

  // 👥 USER QUERIES

  /**
   * Query para obtener todos los usuarios
   */
  getAllUsers() {
    return injectQuery(() => ({
      queryKey: ['users', 'all'],
      queryFn: async (): Promise<UserDto[]> => {
        this.uiState.setLoading('users-list', true);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          return [...this.mockUsers];
        } finally {
          this.uiState.setLoading('users-list', false);
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000 // 10 minutos
    }));
  }

  /**
   * Query para obtener usuario por ID
   */
  getUserById(userId: string) {
    return injectQuery(() => ({
      queryKey: ['users', 'detail', userId],
      queryFn: async (): Promise<UserDto | null> => {
        this.uiState.setLoading(`user-${userId}`, true);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
          const user = this.mockUsers.find(u => u.id === userId);
          return user || null;
        } finally {
          this.uiState.setLoading(`user-${userId}`, false);
        }
      },
      enabled: !!userId
    }));
  }

  /**
   * Mutation para crear usuario
   */
  createUser() {
    return injectMutation(() => ({
      mutationFn: async (command: CreateUserCommand): Promise<UserDto> => {
        this.uiState.setLoading('user-create', true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const newUser: UserDto = {
            id: (this.mockUsers.length + 1).toString(),
            name: command.name,
            email: command.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          };
          
          this.mockUsers.push(newUser);
          return newUser;
        } finally {
          this.uiState.setLoading('user-create', false);
        }
      },
      onSuccess: () => {
        // Invalidar cache de usuarios
        // En implementación real se usaría QueryClient.invalidateQueries
      }
    }));
  }

  // 📦 PRODUCT QUERIES

  /**
   * Query para obtener todos los productos
   */
  getAllProducts() {
    return injectQuery(() => ({
      queryKey: ['products', 'all'],
      queryFn: async (): Promise<ProductDto[]> => {
        this.uiState.setLoading('products-list', true);
        
        await new Promise(resolve => setTimeout(resolve, 700));
        
        try {
          return [...this.mockProducts];
        } finally {
          this.uiState.setLoading('products-list', false);
        }
      },
      staleTime: 3 * 60 * 1000 // 3 minutos para productos
    }));
  }

  /**
   * Query para obtener productos disponibles
   */
  getAvailableProducts() {
    return injectQuery(() => ({
      queryKey: ['products', 'available'],
      queryFn: async (): Promise<ProductDto[]> => {
        this.uiState.setLoading('products-available', true);
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        try {
          return this.mockProducts.filter(p => p.isAvailable && p.stock > 0);
        } finally {
          this.uiState.setLoading('products-available', false);
        }
      }
    }));
  }

  /**
   * Mutation para crear producto
   */
  createProduct() {
    return injectMutation(() => ({
      mutationFn: async (command: CreateProductCommand): Promise<ProductDto> => {
        this.uiState.setLoading('product-create', true);
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        try {
          const newProduct: ProductDto = {
            id: (this.mockProducts.length + 1).toString(),
            name: command.name,
            description: command.description,
            price: { 
              amount: command.price, 
              currency: command.currency || 'USD',
              formatted: `$${command.price.toFixed(2)}`
            },
            stock: command.stock,
            category: command.category,
            isAvailable: command.stock > 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          this.mockProducts.push(newProduct);
          return newProduct;
        } finally {
          this.uiState.setLoading('product-create', false);
        }
      }
    }));
  }

  // 🔍 SEARCH

  /**
   * Búsqueda universal simplificada
   */
  async universalSearch(searchTerm: string): Promise<{
    users: UserDto[];
    products: ProductDto[];
    total: number;
  }> {
    this.uiState.setLoading('universal-search', true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const term = searchTerm.toLowerCase();
      
      const users = this.mockUsers.filter(u => 
        u.name.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
      
      const products = this.mockProducts.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
      );
      
      return {
        users,
        products,
        total: users.length + products.length
      };
    } finally {
      this.uiState.setLoading('universal-search', false);
    }
  }

  // 📊 DASHBOARD DATA

  /**
   * Obtener datos del dashboard
   */
  async getDashboardData(): Promise<{
    userCount: number;
    productCount: number;
    availableProducts: number;
    recentUsers: UserDto[];
    featuredProducts: ProductDto[];
  }> {
    this.uiState.setLoading('dashboard', true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const availableProducts = this.mockProducts.filter(p => p.isAvailable && p.stock > 0);
      
      return {
        userCount: this.mockUsers.length,
        productCount: this.mockProducts.length,
        availableProducts: availableProducts.length,
        recentUsers: this.mockUsers.slice(0, 5),
        featuredProducts: this.mockProducts.slice(0, 6)
      };
    } finally {
      this.uiState.setLoading('dashboard', false);
    }
  }

  // 🛒 STOCK RESERVATION

  /**
   * Simular reserva de stock
   */
  async reserveStock(userId: string, productId: string, quantity: number): Promise<boolean> {
    this.uiState.setLoading(`product-reserve-${productId}`, true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const product = this.mockProducts.find(p => p.id === productId);
      
      if (!product || product.stock < quantity) {
        throw new Error('Insufficient stock');
      }
      
      // Actualizar stock
      product.stock -= quantity;
      product.isAvailable = product.stock > 0;
      product.updatedAt = new Date().toISOString();
      
      return true;
    } catch (error) {
      throw error;
    } finally {
      this.uiState.setLoading(`product-reserve-${productId}`, false);
    }
  }

  // 🔄 CACHE UTILITIES

  /**
   * Estadísticas del cache (simuladas)
   */
  getCacheStats() {
    return {
      totalQueries: 4, // Simulated
      activeQueries: 2,
      staleQueries: 1,
      memoryUsage: '2.5 KB'
    };
  }
}