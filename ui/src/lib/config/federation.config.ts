import { InjectionToken } from '@angular/core';

export interface MefWrappersOptions {
  /** Ruta al manifest con el mapa de remotes */
  manifestUrl?: string; // p.ej. '/assets/federation.manifest.json'
}

export const MEF_WRAPPERS_OPTIONS = new InjectionToken<MefWrappersOptions>('MEF_WRAPPERS_OPTIONS');
