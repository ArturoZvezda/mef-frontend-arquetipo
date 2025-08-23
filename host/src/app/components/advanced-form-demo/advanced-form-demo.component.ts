import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  FormValidationService,
  BasicValidators,
  PeruvianDocumentValidators,
  MEFValidators,
  DateValidators,
  ComparisonValidators,
  FormValidationSchema
} from '@mef-frontend-arquetipo/shared';

@Component({
  selector: 'app-advanced-form-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card animate-fade-in">
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mr-4">
          📝
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Formulario con Validaciones Avanzadas</h3>
          <p class="text-gray-600 dark:text-gray-300">Sistema completo de validación para formularios del MEF</p>
        </div>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Información Personal -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">👤 Información Personal</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                formControlName="name"
                [class]="getInputClasses('name')"
                placeholder="Ingrese su nombre completo"
              >
              @if (shouldShowErrors('name')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('name'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- DNI -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                DNI *
              </label>
              <input
                type="text"
                formControlName="dni"
                [class]="getInputClasses('dni')"
                placeholder="12345678"
                maxlength="8"
              >
              @if (shouldShowErrors('dni')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('dni'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Email Gubernamental -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Institucional *
              </label>
              <input
                type="email"
                formControlName="email"
                [class]="getInputClasses('email')"
                placeholder="usuario@mef.gob.pe"
              >
              @if (shouldShowErrors('email')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('email'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                formControlName="phone"
                [class]="getInputClasses('phone')"
                placeholder="987654321"
              >
              @if (shouldShowErrors('phone')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('phone'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Información Presupuestal -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">💰 Información Presupuestal</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Código Presupuestal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código Presupuestal *
              </label>
              <input
                type="text"
                formControlName="budgetCode"
                [class]="getInputClasses('budgetCode')"
                placeholder="001-002-003"
              >
              @if (shouldShowErrors('budgetCode')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('budgetCode'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Año Fiscal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Año Fiscal *
              </label>
              <input
                type="number"
                formControlName="fiscalYear"
                [class]="getInputClasses('fiscalYear')"
                placeholder="2024"
                min="2000"
                max="2030"
              >
              @if (shouldShowErrors('fiscalYear')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('fiscalYear'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Monto Presupuestal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto (S/) *
              </label>
              <input
                type="number"
                formControlName="budgetAmount"
                [class]="getInputClasses('budgetAmount')"
                placeholder="100000.00"
                min="0"
                step="0.01"
              >
              @if (shouldShowErrors('budgetAmount')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('budgetAmount'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Fechas del Proyecto -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📅 Fechas del Proyecto</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Fecha de Inicio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                formControlName="startDate"
                [class]="getInputClasses('startDate')"
              >
              @if (shouldShowErrors('startDate')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('startDate'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Fecha de Fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                formControlName="endDate"
                [class]="getInputClasses('endDate')"
              >
              @if (shouldShowErrors('endDate')) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @for (error of getErrors('endDate'); track error) {
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      {{ error }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Estado del Formulario -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Estado de Validación</h4>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div [class]="userForm.valid ? 'text-2xl font-bold text-green-600' : 'text-2xl font-bold text-red-600'">
                {{ userForm.valid ? '✅' : '❌' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Formulario</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">
                {{ getValidFieldsCount() }}/{{ getTotalFieldsCount() }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Campos Válidos</div>
            </div>
            <div>
              <div [class]="userForm.dirty ? 'text-2xl font-bold text-orange-600' : 'text-2xl font-bold text-gray-400'">
                {{ userForm.dirty ? '📝' : '📄' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ userForm.dirty ? 'Modificado' : 'Sin cambios' }}</div>
            </div>
            <div>
              <div [class]="userForm.touched ? 'text-2xl font-bold text-purple-600' : 'text-2xl font-bold text-gray-400'">
                {{ userForm.touched ? '👆' : '🚫' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ userForm.touched ? 'Interactuado' : 'Sin tocar' }}</div>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            [disabled]="userForm.invalid || isSubmitting"
            [class]="userForm.valid ? 'btn-primary flex-1' : 'btn-primary flex-1 opacity-50 cursor-not-allowed'"
          >
            @if (isSubmitting) {
              <div class="loading-spinner mr-2"></div>
            }
            {{ isSubmitting ? 'Validando...' : 'Validar y Enviar' }}
          </button>

          <button
            type="button"
            (click)="resetForm()"
            class="btn-secondary flex-1"
          >
            🔄 Limpiar Formulario
          </button>

          <button
            type="button"
            (click)="fillExampleData()"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex-1"
          >
            🎯 Llenar Ejemplo
          </button>
        </div>

        <!-- Resultado JSON (Debug) -->
        @if (submissionResult) {
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h5 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">✅ Formulario Válido</h5>
            <pre class="text-sm text-green-700 dark:text-green-300 font-mono bg-green-100 dark:bg-green-900/40 p-3 rounded overflow-x-auto">{{ submissionResult | json }}</pre>
          </div>
        }

      </form>
    </div>
  `
})
export class AdvancedFormDemoComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;
  submissionResult: any = null;

  private validationSchema: FormValidationSchema = {
    name: {
      validators: [
        BasicValidators.required,
        BasicValidators.minLength(2),
        BasicValidators.maxLength(100)
      ]
    },
    dni: {
      validators: [
        BasicValidators.required,
        PeruvianDocumentValidators.dni
      ]
    },
    email: {
      validators: [
        BasicValidators.required,
        MEFValidators.governmentEmail
      ]
    },
    phone: {
      validators: [
        PeruvianDocumentValidators.phoneNumber
      ]
    },
    budgetCode: {
      validators: [
        BasicValidators.required,
        MEFValidators.budgetCode
      ]
    },
    fiscalYear: {
      validators: [
        BasicValidators.required,
        MEFValidators.fiscalYear
      ]
    },
    budgetAmount: {
      validators: [
        BasicValidators.required,
        MEFValidators.budgetAmount
      ]
    },
    startDate: {
      validators: [
        BasicValidators.required,
        DateValidators.futureDate
      ]
    },
    endDate: {
      validators: [
        BasicValidators.required,
        DateValidators.dateRange('startDate', 'endDate')
      ]
    }
  };

  constructor(
    private fb: FormBuilder,
    private validationService: FormValidationService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.setupValidation();
  }

  private initializeForm() {
    this.userForm = this.fb.group({
      name: [''],
      dni: [''],
      email: [''],
      phone: [''],
      budgetCode: [''],
      fiscalYear: [new Date().getFullYear()],
      budgetAmount: [0],
      startDate: [''],
      endDate: ['']
    });
  }

  private setupValidation() {
    this.validationService.setupFormValidation(this.userForm, this.validationSchema);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      
      // Simular envío
      setTimeout(() => {
        this.submissionResult = {
          ...this.userForm.value,
          submittedAt: new Date(),
          status: 'success'
        };
        this.isSubmitting = false;
      }, 1500);
    } else {
      this.validationService.markFormGroupTouched(this.userForm);
    }
  }

  resetForm() {
    this.userForm.reset({
      fiscalYear: new Date().getFullYear(),
      budgetAmount: 0
    });
    this.submissionResult = null;
  }

  fillExampleData() {
    this.userForm.patchValue({
      name: 'María González Pérez',
      dni: '12345678',
      email: 'maria.gonzalez@mef.gob.pe',
      phone: '987654321',
      budgetCode: '001-002-003',
      fiscalYear: 2024,
      budgetAmount: 150000,
      startDate: '2024-06-01',
      endDate: '2024-12-31'
    });
  }

  // Helper methods para el template
  shouldShowErrors(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return control ? this.validationService.shouldShowErrors(control) : false;
  }

  getErrors(fieldName: string): string[] {
    const control = this.userForm.get(fieldName);
    return control ? this.validationService.getErrorMessages(control) : [];
  }

  getInputClasses(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (!control) return 'input-field';

    const hasError = this.shouldShowErrors(fieldName);
    const isValid = control.valid && control.touched;

    let classes = 'input-field transition-all duration-200';
    
    if (hasError) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (isValid) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    }

    return classes;
  }

  getValidFieldsCount(): number {
    return Object.values(this.userForm.controls).filter(control => control.valid).length;
  }

  getTotalFieldsCount(): number {
    return Object.keys(this.userForm.controls).length;
  }
}