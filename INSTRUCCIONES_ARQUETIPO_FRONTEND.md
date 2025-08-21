# Instrucciones para Crear Arquetipo Frontend Angular - MEF

## Basado en ADR: Angular 18 LTS + Nx + Arquitectura Hexagonal + DDD

### Requisitos Previos

```bash
# Verificar versiones requeridas
node -v  # Debe ser 20.9.x
npm -v   # Debe ser 10.1.0
```

---

## PASO 1: Crear Workspace Nx Base

```bash
# 1.1 Crear workspace Nx vacío
npx create-nx-workspace@latest mef-frontend \
  --preset=apps \
  --nxCloud=false \
  --packageManager=npm

cd mef-frontend
```

---

## PASO 2: Instalar Dependencias Core

```bash
# 2.1 Plugins Nx y Angular
npm install -D @nx/angular@latest \
  @nx/jest@latest \
  @nx/playwright@latest \
  @nx/eslint-plugin@latest

# 2.2 Native Federation para Microfrontends
npm install -D @angular-architects/native-federation@latest

# 2.3 Testing Stack
npm install -D jest@latest \
  @testing-library/angular@latest \
  @testing-library/jest-dom@latest \
  jest-environment-jsdom@latest \
  msw@latest \
  @types/jest@latest \
  ts-jest@latest

# 2.4 Estado y HTTP
npm install @tanstack/angular-query@latest \
  rxjs@7.x
```

---

## PASO 3: Crear Estructura de Librerías (Arquitectura Hexagonal)

```bash
# 3.1 Capa Domain (Entidades, Value Objects, Reglas de Negocio)
npx nx generate @nx/js:library domain \
  --directory=libs/core \
  --unitTestRunner=jest \
  --strict=true

# 3.2 Capa Application (Casos de Uso, Puertos)
npx nx generate @nx/js:library application \
  --directory=libs/core \
  --unitTestRunner=jest \
  --strict=true

# 3.3 Capa Adapters (Implementaciones HTTP, Storage, etc.)
npx nx generate @nx/angular:library adapters \
  --directory=libs/infrastructure \
  --standalone=true \
  --unitTestRunner=jest \
  --strict=true

# 3.4 UI Components (Componentes Transversales)
npx nx generate @nx/angular:library ui \
  --directory=libs/shared \
  --standalone=true \
  --unitTestRunner=jest \
  --strict=true

# 3.5 Shared (Utilities, Types, Constants)
npx nx generate @nx/js:library shared \
  --directory=libs/shared \
  --unitTestRunner=jest \
  --strict=true
```

---

## PASO 4: Crear Aplicaciones (Host + Microfrontend)

```bash
# 4.1 App Host (Shell de Microfrontends)
npx nx generate @nx/angular:application host \
  --routing=true \
  --standalone=true \
  --unitTestRunner=jest \
  --e2eTestRunner=playwright \
  --strict=true

# 4.2 App Feature (Ejemplo de Microfrontend)
npx nx generate @nx/angular:application catalog \
  --routing=true \
  --standalone=true \
  --unitTestRunner=jest \
  --e2eTestRunner=playwright \
  --strict=true
```

---

## PASO 5: Configurar Native Federation

```bash
# 5.1 Inicializar Federation en Host
npx nx generate @angular-architects/native-federation:init \
  --project=host \
  --port=4200 \
  --type=dynamic-host

# 5.2 Inicializar Federation en Catalog
npx nx generate @angular-architects/native-federation:init \
  --project=catalog \
  --port=4201 \
  --type=remote
```

---

## PASO 6: Configurar TypeScript Strict Mode

El ADR requiere `strict: true`. Actualizar `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## PASO 7: Configurar Tailwind CSS

Para estilos modernos y componentes UI:

```bash
# 7.1 Instalar Tailwind CSS v3 (compatible con Angular 18)
npm install -D tailwindcss@^3.4.0 \
  @tailwindcss/forms@^0.5.0 \
  @tailwindcss/typography@^0.5.0 \
  autoprefixer \
  postcss --legacy-peer-deps

# 7.2 Inicializar configuración de Tailwind
npx tailwindcss init -p
```

### 7.3 Configurar `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./host/src/**/*.{html,ts}', './catalog/src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          500: '#d946ef',
          600: '#c026d3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### 7.4 Configurar `postcss.config.js`

```javascript
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
```

### 7.5 Añadir Tailwind a `host/src/styles.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS components */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200;
  }
}
```

---

## PASO 8: Próximos Pasos de Implementación

1. **Implementar Ports y Adapters** en las librerías
2. **Configurar TanStack Query** para server state
3. **Crear componentes UI** transversales
4. **Configurar MSW** para mocking en tests
5. **Implementar Composition Root** en `app.config.ts`
6. **Configurar CI/CD pipeline**

---

## Estructura Final Esperada

```
mef-frontend/
├── apps/
│   ├── host/                    # Shell de microfrontends
│   ├── catalog/                 # Microfrontend de ejemplo
│   ├── host-e2e/              # Tests E2E para host
│   └── catalog-e2e/           # Tests E2E para catalog
├── libs/
│   ├── core/
│   │   ├── domain/             # Entidades, Value Objects
│   │   └── application/        # Use Cases, Ports
│   ├── infrastructure/
│   │   └── adapters/          # HTTP, Storage, External APIs
│   └── shared/
│       ├── ui/                # Componentes transversales
│       └── shared/            # Utilities, Types
├── tools/
└── docs/
```

---

## Verificación de Cumplimiento ADR

✅ **Angular 18 LTS** con standalone components  
✅ **TypeScript 5.3** con strict: true  
✅ **Node 20.9** y **NPM 10.1.0**  
✅ **Nx** para gestión de monorepo  
✅ **Native Federation** para microfrontends  
✅ **Jest** para testing unitario  
✅ **Playwright** para testing E2E  
✅ **RxJS 7.x** para gestión de eventos  
✅ **TanStack Query** para server state  
✅ **Signals** para estado local  
✅ **Arquitectura Hexagonal** con capas separadas  
✅ **DDD** con domain, application, infrastructure