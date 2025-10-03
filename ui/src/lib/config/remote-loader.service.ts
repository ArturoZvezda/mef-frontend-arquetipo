// remote-loader.service.ts
import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Injectable({ providedIn: 'root' })
export class RemoteLoaderService {
  loadByName(params: { remoteName: string; exposedModule: string }) {
    return loadRemoteModule({
      remoteName: params.remoteName,   // resuelto vía manifest
      exposedModule: params.exposedModule,
    });
  }

  // Opción alternativa SIN manifest: pasar remoteEntry directo
  loadByEntry(params: { remoteEntry: string; exposedModule: string }) {
    return loadRemoteModule({
      remoteEntry: params.remoteEntry,
      exposedModule: params.exposedModule,
    });
  }
}
