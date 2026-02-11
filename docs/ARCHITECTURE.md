# 🏗️ Simple Dashboard 3D - Architecture Documentation

## 📋 Project Overview

Enterprise-grade React application with 3D visualization capabilities, implementing **Clean Architecture**, **Domain-Driven Design (DDD)**, and **SOLID principles**. Built with modern tech stack focusing on scalability, maintainability, and testability.

---

## 🎯 Core Architecture Principles

### 1. **Layered Architecture**
```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components, Pages, Hooks)             │
├─────────────────────────────────────────┤
│         Application Layer               │
│  (Services, State Management)           │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│  (Entities, Business Logic)             │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │
│  (API, Storage, External Services)      │
└─────────────────────────────────────────┘
```

### 2. **Design Patterns Applied**
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Factory Pattern** - Object creation
- ✅ **Observer Pattern** - State management (React Query)
- ✅ **Strategy Pattern** - Storage strategies (API/Mock/LocalStorage)
- ✅ **Dependency Injection** - Loose coupling
- ✅ **Composition Over Inheritance** - React components
- ✅ **Custom Hooks Pattern** - Business logic encapsulation
- ✅ **Adapter Pattern** - Appwrite integration

---

## 📦 Technology Stack

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    
    "# State Management & Data Fetching": "",
    "@tanstack/react-query": "^5.28.0",
    "zustand": "^4.5.0",
    
    "# Backend": "",
    "appwrite": "^14.0.1",
    
    "# 3D Graphics": "",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.96.0",
    "three": "^0.161.0",
    
    "# Form Management & Validation": "",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    
    "# UI Components": "",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    
    "# Utils": "",
    "date-fns": "^3.3.1",
    "nanoid": "^5.0.5"
  },
  
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.161.0",
    
    "# Build Tools": "",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "vite": "^5.1.0",
    
    "# Code Quality": "",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "prettier": "^3.2.5",
    
    "# Testing": "",
    "vitest": "^1.3.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.2",
    
    "# CSS": "",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── providers/              # App-level providers
│   │   ├── AppProvider.tsx     # Main provider wrapper
│   │   ├── QueryProvider.tsx   # React Query setup
│   │   └── RouterProvider.tsx  # Router configuration
│   ├── routes/                 # Route definitions
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── routes.config.ts
│   └── App.tsx
│
├── features/                   # Feature-based modules
│   ├── designers/
│   │   ├── api/               # API calls
│   │   │   ├── designers.api.ts
│   │   │   └── designers.queries.ts
│   │   ├── components/        # Feature components
│   │   │   ├── DesignerCard.tsx
│   │   │   ├── DesignerForm.tsx
│   │   │   ├── DesignerList.tsx
│   │   │   └── index.ts
│   │   ├── hooks/             # Feature hooks
│   │   │   ├── useDesigners.ts
│   │   │   ├── useCreateDesigner.ts
│   │   │   └── index.ts
│   │   ├── schemas/           # Validation schemas
│   │   │   └── designer.schema.ts
│   │   ├── types/             # Feature types
│   │   │   └── designer.types.ts
│   │   ├── utils/             # Feature utilities
│   │   │   └── designer.utils.ts
│   │   └── index.ts           # Public API
│   │
│   ├── editor/
│   │   ├── api/
│   │   │   ├── objects.api.ts
│   │   │   └── objects.queries.ts
│   │   ├── components/
│   │   │   ├── Scene3D/
│   │   │   │   ├── Scene3D.tsx
│   │   │   │   ├── SceneObject.tsx
│   │   │   │   ├── Controls.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ObjectForm.tsx
│   │   │   ├── ObjectProperties.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useObjects.ts
│   │   │   ├── useSceneInteraction.ts
│   │   │   └── index.ts
│   │   ├── store/             # Feature-specific state
│   │   │   └── editorStore.ts
│   │   ├── schemas/
│   │   │   └── object.schema.ts
│   │   ├── types/
│   │   │   └── object.types.ts
│   │   └── index.ts
│   │
│   └── shared/                # Shared across features
│       ├── components/
│       │   ├── ui/            # Base UI components
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Modal.tsx
│       │   │   └── index.ts
│       │   └── layout/
│       │       ├── Header.tsx
│       │       ├── Navigation.tsx
│       │       └── index.ts
│       ├── hooks/             # Global hooks
│       │   ├── useLocalStorage.ts
│       │   └── index.ts
│       └── utils/
│           ├── cn.ts          # Class name utility
│           └── index.ts
│
├── core/                      # Core business logic
│   ├── domain/               # Domain models & entities
│   │   ├── models/
│   │   │   ├── Designer.ts
│   │   │   ├── Object3D.ts
│   │   │   └── index.ts
│   │   ├── interfaces/       # Domain interfaces
│   │   │   ├── IDesignerRepository.ts
│   │   │   ├── IObjectRepository.ts
│   │   │   └── index.ts
│   │   └── valueObjects/     # Value objects
│   │       ├── Position.ts
│   │       ├── Size.ts
│   │       └── index.ts
│   │
│   ├── infrastructure/       # External services
│   │   ├── api/
│   │   │   ├── appwrite/
│   │   │   │   ├── appwrite.client.ts
│   │   │   │   ├── appwrite.config.ts
│   │   │   │   └── index.ts
│   │   │   └── mock/
│   │   │       ├── mockApi.ts
│   │   │       └── mockData.ts
│   │   ├── repositories/     # Repository implementations
│   │   │   ├── DesignerRepository.ts
│   │   │   ├── ObjectRepository.ts
│   │   │   └── index.ts
│   │   └── storage/
│   │       ├── LocalStorageService.ts
│   │       └── index.ts
│   │
│   └── services/             # Application services
│       ├── DesignerService.ts
│       ├── ObjectService.ts
│       └── index.ts
│
├── config/                   # Configuration files
│   ├── env.ts               # Environment variables
│   ├── constants.ts         # App constants
│   └── theme.ts             # Theme configuration
│
├── lib/                     # Third-party integrations
│   ├── appwrite.ts
│   ├── queryClient.ts
│   └── index.ts
│
├── types/                   # Global TypeScript types
│   ├── global.d.ts
│   └── env.d.ts
│
├── pages/                   # Page components
│   ├── DesignersPage.tsx
│   ├── EditorPage.tsx
│   ├── NotFoundPage.tsx
│   └── index.ts
│
├── main.tsx                 # App entry point
├── vite-env.d.ts
└── index.css
```

---

## 🔧 Implementation Steps

### **Phase 1: Project Setup (30 min)**
```bash
# 1. Initialize Vite project
npm create vite@latest simple-dashboard-3d -- --template react-swc-ts

# 2. Install all dependencies
npm install react-router-dom @tanstack/react-query zustand appwrite
npm install @react-three/fiber @react-three/drei three
npm install react-hook-form zod @hookform/resolvers
npm install clsx tailwind-merge date-fns nanoid

# 3. Install dev dependencies
npm install -D @types/three vitest @testing-library/react @testing-library/jest-dom
npm install -D tailwindcss autoprefixer postcss
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

# 4. Initialize Tailwind
npx tailwindcss init -p
```

### **Phase 2: Core Infrastructure (45 min)**

**2.1 Setup Appwrite Client**
```typescript
// src/lib/appwrite.ts
import { Client, Databases, Account } from 'appwrite';

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);
```

**2.2 Create Repository Interfaces**
```typescript
// src/core/domain/interfaces/IDesignerRepository.ts
export interface IDesignerRepository {
  getAll(): Promise<Designer[]>;
  getById(id: string): Promise<Designer>;
  create(data: CreateDesignerDTO): Promise<Designer>;
  update(id: string, data: UpdateDesignerDTO): Promise<Designer>;
  delete(id: string): Promise<void>;
}
```

**2.3 Implement Repository Pattern**
```typescript
// src/core/infrastructure/repositories/DesignerRepository.ts
export class DesignerRepository implements IDesignerRepository {
  constructor(
    private readonly database: Databases,
    private readonly fallbackStorage: Storage
  ) {}
  
  async getAll(): Promise<Designer[]> {
    try {
      const response = await this.database.listDocuments(/*...*/);
      return response.documents.map(DesignerMapper.toDomain);
    } catch (error) {
      return this.fallbackStorage.getDesigners();
    }
  }
}
```

### **Phase 3: Domain Layer (30 min)**

**3.1 Define Domain Models**
```typescript
// src/core/domain/models/Designer.ts
export class Designer {
  constructor(
    public readonly id: string,
    public fullName: string,
    public workingHours: number,
    public attachedObjectsCount: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.workingHours < 0 || this.workingHours > 40) {
      throw new Error('Invalid working hours');
    }
  }

  canAttachMoreObjects(max: number = 10): boolean {
    return this.attachedObjectsCount < max;
  }
}
```

**3.2 Create Value Objects**
```typescript
// src/core/domain/valueObjects/Position.ts
export class Position {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {}

  static zero(): Position {
    return new Position(0, 0, 0);
  }

  distanceTo(other: Position): number {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) +
      Math.pow(this.y - other.y, 2) +
      Math.pow(this.z - other.z, 2)
    );
  }
}
```

### **Phase 4: Features Implementation (120 min)**

**4.1 Setup React Query**
```typescript
// src/features/designers/api/designers.queries.ts
export const designerQueries = {
  all: () => ['designers'] as const,
  lists: () => [...designerQueries.all(), 'list'] as const,
  list: (filters: DesignerFilters) => 
    [...designerQueries.lists(), filters] as const,
  details: () => [...designerQueries.all(), 'detail'] as const,
  detail: (id: string) => [...designerQueries.details(), id] as const,
};

export const useDesigners = () => {
  return useQuery({
    queryKey: designerQueries.lists(),
    queryFn: () => designerService.getAll(),
  });
};
```

**4.2 Form with Validation**
```typescript
// src/features/designers/schemas/designer.schema.ts
export const designerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  workingHours: z
    .number()
    .min(0, 'Cannot be negative')
    .max(40, 'Maximum 40 hours/week'),
});

export type DesignerFormData = z.infer<typeof designerSchema>;
```

**4.3 3D Scene Component**
```typescript
// src/features/editor/components/Scene3D/Scene3D.tsx
export const Scene3D: React.FC = () => {
  const { selectedId, setSelectedId } = useEditorStore();
  const { data: objects } = useObjects();

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {objects?.map((obj) => (
        <SceneObject
          key={obj.id}
          object={obj}
          isSelected={selectedId === obj.id}
          onSelect={() => setSelectedId(obj.id)}
        />
      ))}
      
      <OrbitControls />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
};
```

### **Phase 5: State Management (30 min)**

**5.1 Zustand Store**
```typescript
// src/features/editor/store/editorStore.ts
interface EditorState {
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  isAddingObject: boolean;
  setSelectedObjectId: (id: string | null) => void;
  setHoveredObjectId: (id: string | null) => void;
  setIsAddingObject: (isAdding: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedObjectId: null,
  hoveredObjectId: null,
  isAddingObject: false,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  setHoveredObjectId: (id) => set({ hoveredObjectId: id }),
  setIsAddingObject: (isAdding) => set({ isAddingObject: isAdding }),
}));
```

### **Phase 6: Testing Setup (30 min)**

```typescript
// src/features/designers/hooks/__tests__/useDesigners.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useDesigners', () => {
  it('should fetch designers successfully', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useDesigners(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

---

## 🎨 Code Quality Standards

### **TypeScript Strict Mode**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true
  }
}
```

### **ESLint Configuration**
```javascript
module.exports = {
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  }
};
```

### **Naming Conventions**
- **Components**: PascalCase (`DesignerCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useDesigners.ts`)
- **Types/Interfaces**: PascalCase with `I` prefix for interfaces (`IDesigner`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_OBJECTS`)
- **Files**: kebab-case for utilities, PascalCase for components

---

## 🚀 Performance Optimizations

1. **Code Splitting**
```typescript
const DesignersPage = lazy(() => import('@/pages/DesignersPage'));
const EditorPage = lazy(() => import('@/pages/EditorPage'));
```

2. **Memoization**
```typescript
const MemoizedSceneObject = memo(SceneObject, (prev, next) => {
  return prev.object.id === next.object.id && 
         prev.isSelected === next.isSelected;
});
```

3. **React Query Caching**
```typescript
{
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
}
```

---

## 📝 Environment Variables

```bash
# .env.example
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_DESIGNERS_COLLECTION_ID=designers
VITE_APPWRITE_OBJECTS_COLLECTION_ID=objects
VITE_USE_MOCK_API=false
```

---

## 🧪 Testing Strategy

```
Unit Tests (70%)        → Business logic, utilities, hooks
Integration Tests (20%) → Feature workflows, API integration
E2E Tests (10%)         → Critical user paths
```

---

## 📊 Success Metrics

- ✅ **Bundle Size**: < 500KB (gzipped)
- ✅ **Lighthouse Score**: > 90
- ✅ **Test Coverage**: > 80%
- ✅ **TypeScript Strict**: 100%
- ✅ **Zero ESLint Errors**: Required

---

## 🎯 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Vite over CRA** | 10x faster HMR, better DX |
| **React Query** | Server state management, caching, optimistic updates |
| **Zustand** | Lightweight, no boilerplate, great DX |
| **Zod** | Runtime validation, type inference |
| **Repository Pattern** | Easy mock/real API swap, testability |
| **Feature-based folders** | Scalability, co-location |
| **Three.js + R3F** | Best 3D library for React |

---

## 🔐 Security Considerations

- ✅ Input sanitization with Zod
- ✅ Environment variable validation
- ✅ CORS handling via Appwrite
- ✅ XSS prevention via React's default escaping
- ✅ Type-safe API calls

---

## 📚 Further Reading

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

---

**This architecture ensures:**
- 🎯 **Maintainability**: Clear separation of concerns
- 🚀 **Scalability**: Easy to add new features
- 🧪 **Testability**: Dependency injection, mocks
- 📦 **Modularity**: Feature-based structure
- 💪 **Type Safety**: TypeScript strict mode
- ⚡ **Performance**: Code splitting, memoization

**Ready for Cursor AI to implement! 🚀**
