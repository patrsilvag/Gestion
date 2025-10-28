// src/layouts/AppLayout.tsx
import { UserNav } from '@/components/user-nav'; // Componente Shadcn para el avatar/menú
import { MainNav } from '@/components/main-nav'; // Navegación

import React, { ReactNode } from 'react';
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      {/* Header con el color Azul Principal de Unilever */}
      <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Gestión OC | Do Better</h1>
          <MainNav className="mx-6" /> 
          <UserNav /> {/* Aquí se aplica el SSO/OIDC+MFA (INF-07, BE-01) */}
        </div>
      </header>
      
      {/* Contenido principal */}
      <main className="flex-grow overflow-auto p-4 md:p-8 bg-white">
        {children}
      </main>
      
      {/* Lógica BE-01: Gestión de Auth (SSO, RBAC) */}
    </div>
  );
}