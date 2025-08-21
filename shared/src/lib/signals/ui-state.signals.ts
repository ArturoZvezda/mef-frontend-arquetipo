import { Injectable, signal, computed } from '@angular/core';

/**
 * Estado de carga
 */
export interface LoadingState {
  [key: string]: boolean;
}

/**
 * Estado de modales
 */
export interface ModalState {
  [modalId: string]: {
    isOpen: boolean;
    data?: any;
  };
}

/**
 * Estado de sidebars/drawers
 */
export interface SidebarState {
  isOpen: boolean;
  currentSection?: string;
}

/**
 * Service para manejo de estado UI con Angular Signals
 * Según ADR: Estado local/feature con Signals
 */
@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  // 🔄 Loading States
  private loadingState = signal<LoadingState>({});
  
  // 🏠 Modal States  
  private modalState = signal<ModalState>({});
  
  // 📱 Sidebar State
  private sidebarState = signal<SidebarState>({ isOpen: false });
  
  // 🎨 Theme State
  private isDarkMode = signal<boolean>(false);
  
  // 📱 Mobile State
  private isMobile = signal<boolean>(false);

  // 📊 Computed States
  readonly isAnyLoading = computed(() => 
    Object.values(this.loadingState()).some(loading => loading)
  );
  
  readonly openModalsCount = computed(() => 
    Object.values(this.modalState()).filter(modal => modal.isOpen).length
  );
  
  readonly hasOpenModals = computed(() => this.openModalsCount() > 0);

  // 🔄 Loading Management
  /**
   * Establecer estado de carga para una clave específica
   */
  setLoading(key: string, isLoading: boolean): void {
    this.loadingState.update(state => ({
      ...state,
      [key]: isLoading
    }));
  }

  /**
   * Obtener estado de carga para una clave
   */
  isLoading(key: string): boolean {
    return this.loadingState()[key] || false;
  }

  /**
   * Limpiar estado de carga para una clave
   */
  clearLoading(key: string): void {
    this.loadingState.update(state => {
      const newState = { ...state };
      delete newState[key];
      return newState;
    });
  }

  /**
   * Limpiar todos los estados de carga
   */
  clearAllLoading(): void {
    this.loadingState.set({});
  }

  // 🏠 Modal Management
  /**
   * Abrir modal con datos opcionales
   */
  openModal(modalId: string, data?: any): void {
    this.modalState.update(state => ({
      ...state,
      [modalId]: {
        isOpen: true,
        data
      }
    }));
  }

  /**
   * Cerrar modal específico
   */
  closeModal(modalId: string): void {
    this.modalState.update(state => ({
      ...state,
      [modalId]: {
        isOpen: false,
        data: undefined
      }
    }));
  }

  /**
   * Cerrar todos los modales
   */
  closeAllModals(): void {
    this.modalState.update(state => {
      const newState = { ...state };
      Object.keys(newState).forEach(key => {
        newState[key] = { isOpen: false, data: undefined };
      });
      return newState;
    });
  }

  /**
   * Obtener estado de modal
   */
  getModalState(modalId: string) {
    return computed(() => this.modalState()[modalId] || { isOpen: false });
  }

  /**
   * Verificar si modal está abierto
   */
  isModalOpen(modalId: string): boolean {
    return this.modalState()[modalId]?.isOpen || false;
  }

  // 📱 Sidebar Management
  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.sidebarState.update(state => ({
      ...state,
      isOpen: !state.isOpen
    }));
  }

  /**
   * Abrir sidebar con sección específica
   */
  openSidebar(section?: string): void {
    this.sidebarState.set({
      isOpen: true,
      currentSection: section
    });
  }

  /**
   * Cerrar sidebar
   */
  closeSidebar(): void {
    this.sidebarState.set({ isOpen: false });
  }

  /**
   * Obtener estado del sidebar
   */
  getSidebarState() {
    return this.sidebarState.asReadonly();
  }

  // 🎨 Theme Management
  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.isDarkMode.update(current => !current);
    this.persistTheme();
  }

  /**
   * Establecer dark mode
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    this.persistTheme();
  }

  /**
   * Obtener estado del tema
   */
  getDarkMode() {
    return this.isDarkMode.asReadonly();
  }

  /**
   * Inicializar tema desde localStorage
   */
  initTheme(): void {
    const savedTheme = localStorage.getItem('mef_theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
  }

  /**
   * Persistir tema en localStorage
   */
  private persistTheme(): void {
    localStorage.setItem('mef_theme', this.isDarkMode() ? 'dark' : 'light');
  }

  // 📱 Mobile Management
  /**
   * Establecer estado mobile
   */
  setMobile(isMobile: boolean): void {
    this.isMobile.set(isMobile);
  }

  /**
   * Obtener estado mobile
   */
  getMobile() {
    return this.isMobile.asReadonly();
  }

  /**
   * Inicializar detección de mobile
   */
  initMobileDetection(): void {
    const checkMobile = () => {
      this.setMobile(window.innerWidth <= 768);
    };

    // Check inicial
    checkMobile();

    // Listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
  }
}