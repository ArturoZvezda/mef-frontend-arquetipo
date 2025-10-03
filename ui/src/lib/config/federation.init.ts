import { APP_INITIALIZER, FactoryProvider, inject } from '@angular/core';
import { initFederation } from '@angular-architects/native-federation';
import { MEF_WRAPPERS_OPTIONS } from './federation.config';

async function startFederation() {
  const opts = inject(MEF_WRAPPERS_OPTIONS, { optional: true });

  // Usa SIEMPRE manifestUrl. Si no te pasan uno, define un default en assets.
  const url = opts?.manifestUrl ?? '/assets/federation.manifest.json';
  await initFederation(url);
}

export const FEDERATION_INITIALIZER: FactoryProvider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: () => startFederation,
};
