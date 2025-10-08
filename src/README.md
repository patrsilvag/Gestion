# HU7 — Tablero Operativo — Gestión de OC (sin BD)

Componente de **frontend-only** (sin base de datos) con datos en memoria para demo del anexo híbrido.

## Archivos
- `src/components/TableroOperativo.tsx`
- `src/components/index.ts`

## Dependencias de UI
- Tailwind CSS
- `shadcn/ui` (ej. `@/components/ui/card`, `@/components/ui/button`, etc.)
- `lucide-react`
- `recharts`

## Uso (Next.js App Router)

```tsx
// app/(demo)/tablero/page.tsx
import { TableroOperativo } from "@/tablero_operativo_gestion_oc_sin_bd/src/components";

export default function Page() { return <TableroOperativo />; }
```

## Uso (Vite/CRA)

```tsx
import { TableroOperativo } from "./src/components";
function App(){ return <TableroOperativo />; }
export default App;
```

> **Nota**: El botón "Exportar CSV" es un placeholder; si lo deseas, integro la exportación inmediata y edición inline.
