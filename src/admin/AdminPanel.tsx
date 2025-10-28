// src/modules/admin/AdminPanel.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table'; // Para gestión de usuarios
import { Settings } from 'lucide-react';
import { useFetchUsers, useFetchScoringWeights } from '@/hooks/demoHooks';

export default function AdminPanel() {
  // Lógica BE-01: Hook para obtener usuarios y roles (RBAC)
  const { users } = useFetchUsers();
  // Lógica BE-09: Hook para obtener la tabla de pesos de Scoring
  const { scoringWeights } = useFetchScoringWeights();

  return (
    <Tabs defaultValue="users">
      <TabsList>
        <TabsTrigger value="users">Gestión de Usuarios/Roles</TabsTrigger>
        <TabsTrigger value="catalogs">Catálogos Operativos</TabsTrigger>
        <TabsTrigger value="scoring">Pesos de Scoring</TabsTrigger>
      </TabsList>
      
      {/* Pestaña: Gestión de Usuarios/Roles */}
      <TabsContent value="users">
        <Table>
          {/* ... Columnas: Usuario, Rol, MFA Activo, Empresa */}
          {/* Lógica BE-01: CRUD para usuarios, asignación de roles/permisos */}
        </Table>
      </TabsContent>
      
      {/* Pestaña: Pesos de Scoring */}
      <TabsContent value="scoring">
        <p className="mb-4">Tabla de Pesos para el Motor Scoring (HU5 - RN: penalizaciones).</p>
        <Table>
          {/* ... Columnas: Evento (ZC, Reprogramación, Diferencia), Peso de Penalización */}
          {/* Lógica BE-09: CRUD para la tabla de pesos parametrizable */}
        </Table>
      </TabsContent>
      {/* Lógica MAN-04: Manual Administrador */}
    </Tabs>
  );
}