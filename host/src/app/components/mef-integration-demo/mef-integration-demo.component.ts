import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MefBackendClientService, MefUsuarioDto, MefPaginatedResponse } from '@mef-frontend-arquetipo/adapters';

/**
 * Componente DEMO de integración con el backend MEF
 * NO MODIFICA CÓDIGO EXISTENTE - Es completamente independiente
 */

@Component({
  selector: 'app-mef-integration-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mef-integration-container">
      <!-- Header -->
      <div class="mef-header">
        <h1>🏛️ Demo Integración Backend MEF</h1>
        <p class="subtitle">Conexión en vivo con el backend Java Spring Boot</p>
        <div class="connection-status">
          <div class="status-indicator" [class.connected]="isConnected()" [class.disconnected]="!isConnected()">
            <span class="indicator-dot"></span>
            {{ isConnected() ? '🟢 Conectado' : '🔴 Desconectado' }} al backend MEF
          </div>
          @if (!isConnected()) {
            <div class="connection-help">
              <p>⚠️ Para probar la integración, asegúrate de que el backend esté ejecutándose:</p>
              <code>cd C:\\dev\\mef\\arquetipo-back && ./gradlew bootRun</code>
            </div>
          }
        </div>
      </div>

      <!-- Test de Conectividad -->
      <section class="test-section">
        <h2>🔍 Prueba de Conectividad</h2>
        <div class="test-controls">
          <button (click)="testConnection()" 
                  [disabled]="testingConnection()"
                  class="btn-test">
            @if (testingConnection()) {
              <div class="spinner"></div> Probando...
            } @else {
              🔄 Probar Conexión
            }
          </button>
          
          @if (connectionResult()) {
            <div class="test-result" [class.success]="connectionResult()!.success" [class.error]="!connectionResult()!.success">
              <strong>{{ connectionResult()!.success ? '✅ Éxito' : '❌ Error' }}</strong>
              <p>{{ connectionResult()!.message }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Usuarios del Backend MEF -->
      <section class="users-section">
        <div class="section-header">
          <h2>👥 Usuarios Backend MEF</h2>
          <div class="section-controls">
            <button (click)="loadUsuarios()" 
                    [disabled]="loadingUsuarios()"
                    class="btn-load">
              @if (loadingUsuarios()) {
                <div class="spinner"></div>
              }
              🔄 Cargar Usuarios
            </button>
            
            <span class="user-count">
              Total: {{ mefUsuarios()?.totalCount || 0 }} usuarios
            </span>
          </div>
        </div>

        @if (loadingUsuarios()) {
          <div class="loading-state">
            <div class="spinner large"></div>
            <p>Cargando usuarios desde backend MEF...</p>
          </div>
        } @else if (usuarioError()) {
          <div class="error-state">
            <h3>❌ Error de Conexión</h3>
            <p>{{ usuarioError() }}</p>
            <details>
              <summary>Detalles técnicos</summary>
              <pre>{{ usuarioErrorDetails() }}</pre>
            </details>
          </div>
        } @else if (mefUsuarios()?.items && mefUsuarios()!.items.length > 0) {
          <div class="users-grid">
            @for (usuario of mefUsuarios()!.items; track usuario.id) {
              <div class="user-card">
                <div class="user-info">
                  <h3>{{ getFullName(usuario) }}</h3>
                  <p class="user-email">📧 {{ usuario.correoElectronico }}</p>
                  <div class="user-details">
                    <p><strong>ID:</strong> {{ usuario.id }}</p>
                    <p><strong>Documento:</strong> {{ usuario.documento || 'No especificado' }}</p>
                    <p><strong>ID Usuario:</strong> {{ usuario.idUsuario || 'No especificado' }}</p>
                    <span class="status-badge" [class.active]="usuario.activo" [class.inactive]="!usuario.activo">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <h3>📭 Sin Datos</h3>
            <p>No se encontraron usuarios en el backend MEF</p>
            <p><small>Esto puede significar que la base de datos está vacía</small></p>
          </div>
        }
      </section>

      <!-- Formulario para Crear Usuario -->
      <section class="create-section">
        <h2>➕ Crear Usuario MEF</h2>
        <form [formGroup]="userForm" (ngSubmit)="createUsuario()">
          <div class="form-grid">
            <div class="form-field">
              <label>Documento *</label>
              <input formControlName="documento" 
                     placeholder="DNI, CE, Pasaporte..." 
                     maxlength="12">
              @if (userForm.get('documento')?.invalid && userForm.get('documento')?.touched) {
                <div class="field-error">Documento es requerido</div>
              }
            </div>

            <div class="form-field">
              <label>Nombre *</label>
              <input formControlName="nombre" 
                     placeholder="Primer nombre">
              @if (userForm.get('nombre')?.invalid && userForm.get('nombre')?.touched) {
                <div class="field-error">Nombre es requerido</div>
              }
            </div>

            <div class="form-field">
              <label>Apellido Paterno *</label>
              <input formControlName="apellido" 
                     placeholder="Apellido paterno">
            </div>

            <div class="form-field">
              <label>Apellido Materno</label>
              <input formControlName="segundoApellido" 
                     placeholder="Apellido materno (opcional)">
            </div>

            <div class="form-field">
              <label>Correo Electrónico *</label>
              <input formControlName="correoElectronico" 
                     type="email"
                     placeholder="usuario@mef.gob.pe">
              @if (userForm.get('correoElectronico')?.invalid && userForm.get('correoElectronico')?.touched) {
                <div class="field-error">Email válido es requerido</div>
              }
            </div>

            <div class="form-field">
              <label>ID Usuario</label>
              <input formControlName="idUsuario" 
                     placeholder="Identificador único (opcional)">
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" 
                    [disabled]="userForm.invalid || creatingUser()"
                    class="btn-create">
              @if (creatingUser()) {
                <div class="spinner"></div> Creando Usuario...
              } @else {
                ➕ Crear Usuario en Backend MEF
              }
            </button>
          </div>
        </form>

        @if (createResult()) {
          <div class="create-result" [class.success]="createResult()!.success" [class.error]="!createResult()!.success">
            <strong>{{ createResult()!.success ? '✅ Usuario Creado' : '❌ Error' }}</strong>
            <p>{{ createResult()!.message }}</p>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .mef-integration-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .mef-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .mef-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
    }

    .subtitle {
      margin: 0;
      opacity: 0.9;
    }

    .connection-status {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      text-align: center;
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      transition: all 0.3s;
    }

    .status-indicator.connected {
      background: rgba(34, 197, 94, 0.2);
      border: 2px solid rgba(34, 197, 94, 0.5);
    }

    .status-indicator.disconnected {
      background: rgba(239, 68, 68, 0.2);
      border: 2px solid rgba(239, 68, 68, 0.5);
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .connection-help {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(251, 191, 36, 0.2);
      border: 1px solid rgba(251, 191, 36, 0.5);
      border-radius: 0.5rem;
      text-align: left;
    }

    .connection-help code {
      display: block;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
    }

    .test-section, .users-section, .create-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-count {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .btn-test, .btn-load, .btn-create {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-test {
      background: #8b5cf6;
      color: white;
    }

    .btn-test:hover:not(:disabled) {
      background: #7c3aed;
    }

    .btn-load {
      background: #10b981;
      color: white;
    }

    .btn-load:hover:not(:disabled) {
      background: #059669;
    }

    .btn-create {
      background: #3b82f6;
      color: white;
    }

    .btn-create:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-test:disabled, .btn-load:disabled, .btn-create:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .test-result, .create-result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .test-result.success, .create-result.success {
      background: #d1fae5;
      border: 1px solid #10b981;
      color: #065f46;
    }

    .test-result.error, .create-result.error {
      background: #fee2e2;
      border: 1px solid #ef4444;
      color: #991b1b;
    }

    .loading-state, .empty-state, .error-state {
      text-align: center;
      padding: 3rem 1rem;
    }

    .error-state details {
      margin-top: 1rem;
      text-align: left;
    }

    .error-state pre {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      overflow-x: auto;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1rem;
    }

    .user-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      background: #fafafa;
      transition: box-shadow 0.2s;
    }

    .user-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .user-info h3 {
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    .user-email {
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    .user-details p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .form-field label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-field input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-field input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .field-error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      text-align: center;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner.large {
      width: 32px;
      height: 32px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .mef-integration-container {
        padding: 1rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .users-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MefIntegrationDemoComponent implements OnInit {
  private mefClient = inject(MefBackendClientService);
  private fb = inject(FormBuilder);

  // Signals para estado reactivo
  isConnected = signal(false);
  testingConnection = signal(false);
  connectionResult = signal<{success: boolean, message: string} | null>(null);
  
  loadingUsuarios = signal(false);
  mefUsuarios = signal<MefPaginatedResponse<MefUsuarioDto> | null | undefined>(null);
  usuarioError = signal<string | null>(null);
  usuarioErrorDetails = signal<string | null>(null);
  
  creatingUser = signal(false);
  createResult = signal<{success: boolean, message: string} | null>(null);

  // Formulario reactivo
  userForm = this.fb.group({
    documento: ['', [Validators.required, Validators.maxLength(12)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    segundoApellido: ['', Validators.maxLength(100)],
    correoElectronico: ['', [Validators.required, Validators.email]],
    idUsuario: ['', Validators.maxLength(50)]
  });

  ngOnInit() {
    this.testConnection();
    this.loadUsuarios();
  }

  async testConnection() {
    this.testingConnection.set(true);
    this.connectionResult.set(null);
    
    try {
      await this.mefClient.checkConnection().toPromise();
      this.isConnected.set(true);
      this.connectionResult.set({
        success: true,
        message: 'Conexión exitosa al backend MEF en http://localhost:8080'
      });
    } catch (error) {
      this.isConnected.set(false);
      this.connectionResult.set({
        success: false,
        message: 'No se pudo conectar al backend MEF. Verifique que esté ejecutándose.'
      });
    } finally {
      this.testingConnection.set(false);
    }
  }

  async loadUsuarios() {
    this.loadingUsuarios.set(true);
    this.usuarioError.set(null);
    this.usuarioErrorDetails.set(null);
    
    try {
      const usuarios = await this.mefClient.getUsuariosPaginados({
        max_result_count: 20,
        skip_count: 0
      }).toPromise();
      
      this.mefUsuarios.set(usuarios);
      this.isConnected.set(true);
      
    } catch (error: any) {
      this.usuarioError.set('Error cargando usuarios del backend MEF');
      this.usuarioErrorDetails.set(JSON.stringify(error, null, 2));
      this.isConnected.set(false);
    } finally {
      this.loadingUsuarios.set(false);
    }
  }

  async createUsuario() {
    if (this.userForm.invalid) return;

    this.creatingUser.set(true);
    this.createResult.set(null);

    try {
      const formValue = this.userForm.value;
      const usuarioData: MefUsuarioDto = {
        documento: formValue.documento!,
        nombre: formValue.nombre!,
        apellido: formValue.apellido!,
        segundoApellido: formValue.segundoApellido || undefined,
        correoElectronico: formValue.correoElectronico!,
        idUsuario: formValue.idUsuario || undefined,
        activo: false // Nuevo usuario inactivo por defecto
      };

      const newUser = await this.mefClient.crearUsuario(usuarioData).toPromise();
      
      if (newUser) {
        this.createResult.set({
          success: true,
          message: `Usuario "${this.getFullName(newUser)}" creado exitosamente con ID ${newUser.id}`
        });
      } else {
        this.createResult.set({
          success: false,
          message: 'Error: No se pudo crear el usuario'
        });
      }
      
      // Limpiar formulario y recargar usuarios
      this.userForm.reset();
      this.loadUsuarios();
      
    } catch (error: any) {
      this.createResult.set({
        success: false,
        message: `Error creando usuario: ${error.message || error}`
      });
    } finally {
      this.creatingUser.set(false);
    }
  }

  getFullName(usuario: MefUsuarioDto): string {
    const parts = [
      usuario.nombre,
      usuario.apellido,
      usuario.segundoApellido
    ].filter(Boolean);
    return parts.join(' ') || 'Sin nombre';
  }
}