import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SimpleQueryService,
  UiStateService,
  NotificationService,
  NavigationStateService,
  FormStateService
} from '@mef-frontend-arquetipo/shared';
import { 
  CreateUserCommand, 
  CreateProductCommand 
} from '@mef-frontend-arquetipo/application';

/**
 * Dashboard Component - Ejemplo completo de uso del arquetipo
 * Demuestra integración de:
 * - TanStack Query para server state
 * - Angular Signals para local state
 * - DDD + Hexagonal Architecture
 * - Reactive Forms con Signals
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <!-- 🏠 Header -->
      <header class="dashboard-header">
        <h1>MEF Frontend Arquetipo - Dashboard</h1>
        <div class="header-actions">
          <button 
            (click)="toggleTheme()"
            [class.dark]="isDarkMode()">
            🌙 {{ isDarkMode() ? 'Light' : 'Dark' }} Mode
          </button>
          <button (click)="refreshAllData()">
            🔄 Refresh
          </button>
          <div class="notifications-badge" *ngIf="unreadNotifications() > 0">
            🔔 {{ unreadNotifications() }}
          </div>
        </div>
      </header>

      <!-- 📊 Stats Cards -->
      <section class="stats-grid" *ngIf="dashboardData()">
        <div class="stat-card">
          <h3>👥 Users</h3>
          <div class="stat-value">{{ dashboardData()?.userCount || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>📦 Products</h3>
          <div class="stat-value">{{ dashboardData()?.productCount || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>✅ Available</h3>
          <div class="stat-value">{{ dashboardData()?.availableProducts || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>💾 Cache</h3>
          <div class="stat-value">{{ cacheStats().totalQueries }}</div>
          <div class="stat-subtitle">{{ cacheStats().memoryUsage }}</div>
        </div>
      </section>

      <!-- 🔍 Search -->
      <section class="search-section">
        <h2>🔍 Universal Search</h2>
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="onSearchInput($event)"
            placeholder="Search users and products..."
            class="search-input">
          <div *ngIf="isSearching()" class="search-loading">Searching...</div>
        </div>
        
        <div *ngIf="searchResults() && searchResults()!.total > 0" class="search-results">
          <h3>Results ({{ searchResults()!.total }})</h3>
          
          <div *ngIf="searchResults()!.users.length > 0" class="results-section">
            <h4>👥 Users ({{ searchResults()!.users.length }})</h4>
            <div class="results-list">
              <div *ngFor="let user of searchResults()!.users" class="result-item">
                {{ user.name }} - {{ user.email }}
              </div>
            </div>
          </div>
          
          <div *ngIf="searchResults()!.products.length > 0" class="results-section">
            <h4>📦 Products ({{ searchResults()!.products.length }})</h4>
            <div class="results-list">
              <div *ngFor="let product of searchResults()!.products" class="result-item">
                {{ product.name }} - ${{ product.price }} (Stock: {{ product.stock }})
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ➕ Quick Actions -->
      <section class="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div class="actions-grid">
          <button 
            (click)="openUserModal()"
            [disabled]="isLoading('user-create')"
            class="action-button">
            ➕ Add User
          </button>
          <button 
            (click)="openProductModal()"
            [disabled]="isLoading('product-create')"
            class="action-button">
            ➕ Add Product
          </button>
          <button (click)="simulateStockReservation()" class="action-button">
            🛒 Reserve Stock
          </button>
          <button (click)="clearCache()" class="action-button danger">
            🗑️ Clear Cache
          </button>
        </div>
      </section>

      <!-- 📋 Recent Data -->
      <section class="recent-data" *ngIf="dashboardData()">
        <div class="data-section">
          <h3>👥 Recent Users</h3>
          <div class="data-list">
            <div 
              *ngFor="let user of dashboardData()?.recentUsers" 
              class="data-item">
              <strong>{{ user.name }}</strong>
              <small>{{ user.email }}</small>
            </div>
          </div>
        </div>
        
        <div class="data-section">
          <h3>⭐ Featured Products</h3>
          <div class="data-list">
            <div 
              *ngFor="let product of dashboardData()?.featuredProducts" 
              class="data-item">
              <strong>{{ product.name }}</strong>
              <small>${{ product.price }} - Stock: {{ product.stock }}</small>
            </div>
          </div>
        </div>
      </section>

      <!-- 🏠 Modal para Usuario -->
      <div *ngIf="isModalOpen('user')" class="modal-overlay" (click)="closeModal('user')">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>➕ Create User</h3>
          <form (ngSubmit)="createUser()" #userForm="ngForm">
            <div class="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                [(ngModel)]="userFormData.name"
                name="name"
                required
                class="form-input">
              <div *ngIf="getFieldErrors('name').length > 0" class="field-errors">
                <div *ngFor="let error of getFieldErrors('name')" class="error">
                  {{ error }}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                [(ngModel)]="userFormData.email"
                name="email"
                required
                class="form-input">
              <div *ngIf="getFieldErrors('email').length > 0" class="field-errors">
                <div *ngFor="let error of getFieldErrors('email')" class="error">
                  {{ error }}
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" (click)="closeModal('user')">Cancel</button>
              <button 
                type="submit" 
                [disabled]="!isFormValid() || isLoading('user-create')">
                {{ isLoading('user-create') ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 🎯 Loading Overlay -->
      <div *ngIf="isAnyLoading()" class="loading-overlay">
        <div class="loading-spinner">⏳ Loading...</div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: system-ui, sans-serif;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #2563eb;
    }

    .search-section, .quick-actions, .recent-data {
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .search-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .action-button {
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      background: #2563eb;
      color: white;
      cursor: pointer;
      transition: background 0.2s;
    }

    .action-button:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .action-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .action-button.danger {
      background: #dc2626;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 30px;
      border-radius: 8px;
      min-width: 400px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .field-errors {
      margin-top: 5px;
    }

    .error {
      color: #dc2626;
      font-size: 14px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }

    .recent-data {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .data-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .data-item {
      padding: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  // 🏗️ Service Injection
  private readonly queryService = inject(SimpleQueryService);
  private readonly uiState = inject(UiStateService);
  private readonly notifications = inject(NotificationService);
  private readonly navigation = inject(NavigationStateService);
  private readonly formState = inject(FormStateService);

  // 📊 Component State
  searchTerm = '';
  private searchTermSignal = signal('');
  
  userFormData = {
    name: '',
    email: ''
  };

  // 🎯 Computed States
  readonly isDarkMode = this.uiState.getDarkMode();
  readonly unreadNotifications = this.notifications.unreadCount;
  readonly isAnyLoading = this.uiState.isAnyLoading;
  
  // Dashboard data
  readonly dashboardData = signal<any>(null);
  readonly searchResults = signal<any>(null);
  readonly isSearching = computed(() => this.uiState.isLoading('universal-search'));

  // Cache stats
  readonly cacheStats = computed(() => this.queryService.getCacheStats());

  // Form validation
  readonly isFormValid = this.formState.isFormValid;

  ngOnInit(): void {
    // Inicializar navegación
    this.navigation.setCurrentRoute('/dashboard');
    this.navigation.generateBreadcrumbsFromRoute('/dashboard');
    
    // Inicializar formulario
    this.formState.initForm({
      name: { required: true, minLength: 2, maxLength: 50 },
      email: { required: true, email: true }
    });

    // Cargar datos del dashboard
    this.loadDashboardData();
  }

  // 📊 DATA LOADING

  private async loadDashboardData(): Promise<void> {
    try {
      const data = await this.queryService.getDashboardData();
      this.dashboardData.set(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // 🔍 SEARCH

  async onSearchInput(event: any): Promise<void> {
    const term = event.target.value.trim();
    this.searchTermSignal.set(term);
    
    if (term.length >= 2) {
      const results = await this.queryService.universalSearch(term);
      this.searchResults.set(results);
    } else {
      this.searchResults.set(null);
    }
  }

  // 🎨 UI ACTIONS

  toggleTheme(): void {
    this.uiState.toggleDarkMode();
  }

  async refreshAllData(): Promise<void> {
    await this.loadDashboardData();
    this.notifications.success('Data refreshed successfully');
  }

  clearCache(): void {
    this.notifications.info('Cache cleared');
    this.loadDashboardData();
  }

  // 🏠 MODAL MANAGEMENT

  openUserModal(): void {
    this.uiState.openModal('user');
  }

  openProductModal(): void {
    this.uiState.openModal('product');
  }

  closeModal(modalId: string): void {
    this.uiState.closeModal(modalId);
    this.resetUserForm();
  }

  isModalOpen(modalId: string): boolean {
    return this.uiState.isModalOpen(modalId);
  }

  // 📝 FORM MANAGEMENT

  getFieldErrors(fieldName: string): string[] {
    const fieldState = this.formState.getFieldState(fieldName);
    return fieldState()?.errors || [];
  }

  private resetUserForm(): void {
    this.userFormData = { name: '', email: '' };
    this.formState.resetForm();
  }

  // 🎯 CRUD OPERATIONS

  async createUser(): Promise<void> {
    if (!this.isFormValid()) return;

    const createUserMutation = this.queryService.createUser();
    
    const command: CreateUserCommand = {
      name: this.userFormData.name,
      email: this.userFormData.email
    };

    try {
      await createUserMutation.mutateAsync(command);
      this.closeModal('user');
      this.loadDashboardData(); // Refresh data
      this.notifications.success('User created successfully!');
    } catch (error) {
      this.notifications.error('Failed to create user');
    }
  }

  async simulateStockReservation(): Promise<void> {
    // Simular reserva de stock del primer producto disponible
    const dashData = this.dashboardData();
    if (dashData?.featuredProducts?.length > 0) {
      const product = dashData.featuredProducts[0];
      try {
        const success = await this.queryService.reserveStock(
          'user-1', // Usuario simulado
          product.id,
          1 // Cantidad
        );
        
        if (success) {
          this.notifications.success('Stock reserved successfully!');
          this.loadDashboardData(); // Refresh data
        }
      } catch (error) {
        this.notifications.error('Failed to reserve stock');
      }
    } else {
      this.notifications.warning('No products available for reservation');
    }
  }

  // 🔧 UTILITY METHODS

  isLoading(key: string): boolean {
    return this.uiState.isLoading(key);
  }
}