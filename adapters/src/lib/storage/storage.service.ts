import { Injectable } from '@angular/core';

/**
 * Servicio wrapper para localStorage/sessionStorage
 * Proporciona funcionalidad adicional como compresión, TTL, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  /**
   * Guardar dato en localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage key: ${key}`, error);
    }
  }

  /**
   * Obtener dato de localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key: ${key}`, error);
      return null;
    }
  }

  /**
   * Eliminar dato de localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key: ${key}`, error);
    }
  }

  /**
   * Limpiar todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  /**
   * Verificar si existe una clave
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Obtener todas las claves que coincidan con un patrón
   */
  getKeys(pattern?: string): string[] {
    const keys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!pattern || key.includes(pattern))) {
        keys.push(key);
      }
    }
    
    return keys;
  }

  /**
   * Guardar con TTL (Time To Live)
   */
  setItemWithTTL<T>(key: string, value: T, ttlMinutes: number): void {
    const now = new Date();
    const expiryTime = now.getTime() + (ttlMinutes * 60 * 1000);
    
    const itemWithTTL = {
      value,
      expiry: expiryTime
    };
    
    this.setItem(key, itemWithTTL);
  }

  /**
   * Obtener item con verificación de TTL
   */
  getItemWithTTL<T>(key: string): T | null {
    const itemWithTTL = this.getItem<{value: T, expiry: number}>(key);
    
    if (!itemWithTTL) {
      return null;
    }
    
    const now = new Date();
    
    if (now.getTime() > itemWithTTL.expiry) {
      // Item expirado, eliminarlo
      this.removeItem(key);
      return null;
    }
    
    return itemWithTTL.value;
  }

  /**
   * Limpiar items expirados
   */
  clearExpiredItems(): void {
    const keys = this.getKeys();
    
    keys.forEach(key => {
      const item = this.getItem<{value: any, expiry: number}>(key);
      
      if (item && item.expiry && new Date().getTime() > item.expiry) {
        this.removeItem(key);
      }
    });
  }
}