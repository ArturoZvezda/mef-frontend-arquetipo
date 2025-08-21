import { Injectable, signal, computed } from '@angular/core';

/**
 * Elemento de breadcrumb
 */
export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
  isActive?: boolean;
}

/**
 * Estado de navegación
 */
export interface NavigationState {
  currentRoute: string;
  previousRoute?: string;
  breadcrumbs: BreadcrumbItem[];
  canGoBack: boolean;
}

/**
 * Service para manejo de estado de navegación con Angular Signals
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // 🧭 Navigation State
  private currentRoute = signal<string>('/');
  private previousRoute = signal<string | undefined>(undefined);
  private breadcrumbs = signal<BreadcrumbItem[]>([]);
  
  // 📊 Computed States
  readonly canGoBack = computed(() => !!this.previousRoute());
  
  readonly navigationState = computed<NavigationState>(() => ({
    currentRoute: this.currentRoute(),
    previousRoute: this.previousRoute(),
    breadcrumbs: this.breadcrumbs(),
    canGoBack: this.canGoBack()
  }));

  // 🧭 NAVIGATION MANAGEMENT

  /**
   * Establecer ruta actual
   */
  setCurrentRoute(route: string): void {
    const current = this.currentRoute();
    this.previousRoute.set(current);
    this.currentRoute.set(route);
  }

  /**
   * Obtener ruta actual
   */
  getCurrentRoute() {
    return this.currentRoute.asReadonly();
  }

  /**
   * Obtener ruta anterior
   */
  getPreviousRoute() {
    return this.previousRoute.asReadonly();
  }

  /**
   * Navegar atrás programáticamente
   */
  goBack(): string | null {
    const previous = this.previousRoute();
    if (previous) {
      this.setCurrentRoute(previous);
      return previous;
    }
    return null;
  }

  // 🍞 BREADCRUMB MANAGEMENT

  /**
   * Establecer breadcrumbs completos
   */
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbs.set(breadcrumbs);
  }

  /**
   * Agregar item a breadcrumbs
   */
  addBreadcrumb(item: BreadcrumbItem): void {
    this.breadcrumbs.update(current => [...current, item]);
  }

  /**
   * Remover último breadcrumb
   */
  removeLastBreadcrumb(): void {
    this.breadcrumbs.update(current => current.slice(0, -1));
  }

  /**
   * Limpiar breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.breadcrumbs.set([]);
  }

  /**
   * Obtener breadcrumbs
   */
  getBreadcrumbs() {
    return this.breadcrumbs.asReadonly();
  }

  /**
   * Generar breadcrumbs automáticamente desde ruta
   */
  generateBreadcrumbsFromRoute(route: string): void {
    const segments = route.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', route: '/', icon: 'home' }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: this.formatSegmentLabel(segment),
        route: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    this.setBreadcrumbs(breadcrumbs);
  }

  /**
   * Formatear etiqueta del segmento de ruta
   */
  private formatSegmentLabel(segment: string): string {
    // Convertir kebab-case a Title Case
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // 🔍 UTILITY METHODS

  /**
   * Verificar si estamos en una ruta específica
   */
  isCurrentRoute(route: string): boolean {
    return this.currentRoute() === route;
  }

  /**
   * Verificar si la ruta actual coincide con un patrón
   */
  matchesRoute(pattern: string): boolean {
    const current = this.currentRoute();
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(current);
  }

  /**
   * Obtener segmentos de la ruta actual
   */
  getCurrentRouteSegments(): string[] {
    return this.currentRoute().split('/').filter(segment => segment);
  }

  /**
   * Verificar si estamos en una subruta
   */
  isSubRoute(parentRoute: string): boolean {
    return this.currentRoute().startsWith(parentRoute);
  }

  // 📊 NAVIGATION HISTORY

  /**
   * Obtener historial de navegación (últimas 10 rutas)
   */
  private navigationHistory = signal<string[]>([]);

  /**
   * Agregar ruta al historial
   */
  private addToHistory(route: string): void {
    this.navigationHistory.update(history => {
      const newHistory = [route, ...history.filter(r => r !== route)];
      return newHistory.slice(0, 10); // Mantener solo las últimas 10
    });
  }

  /**
   * Obtener historial de navegación
   */
  getNavigationHistory() {
    return this.navigationHistory.asReadonly();
  }

  /**
   * Limpiar historial
   */
  clearNavigationHistory(): void {
    this.navigationHistory.set([]);
  }

  // 🎯 ADVANCED FEATURES

  /**
   * Establecer título de página desde ruta
   */
  private pageTitle = signal<string>('');

  /**
   * Establecer título de página
   */
  setPageTitle(title: string): void {
    this.pageTitle.set(title);
    document.title = title;
  }

  /**
   * Obtener título de página
   */
  getPageTitle() {
    return this.pageTitle.asReadonly();
  }

  /**
   * Generar título automáticamente desde breadcrumbs
   */
  generateTitleFromBreadcrumbs(): void {
    const breadcrumbs = this.breadcrumbs();
    if (breadcrumbs.length > 0) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      this.setPageTitle(lastBreadcrumb.label);
    }
  }
}