// src/modules/documentos/DocumentManager.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUp, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';

export default function DocumentManager() {
  const [activeTab, setActiveTab] = useState('search');

  const handleUpload = (fileData: { file: File | null }) => {
    // 1. Validaciones: formato, tamaño, metadatos (OC, proveedor)
    // 2. Lógica BE-05: Detección de duplicados (hash+folio) y almacenamiento (S3/Cloud Storage)
    alert('Documento cargado y vinculado a OC.');
  };

  const handleSearch = (filters: { q?: string }) => {
    // Lógica BE-05: API de búsqueda con filtros (filtros por OC/Proveedor/Tipo)
    // Retención y Legal Hold (RN) se gestionan en Backend.
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload"><FileUp className="mr-2 h-4 w-4" /> Carga de Documentos</TabsTrigger>
        <TabsTrigger value="search"><Search className="mr-2 h-4 w-4" /> Búsqueda y Auditoría</TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        {/* Componente de carga de archivo con clasificación (Guía, NC, Evidencia) */}
        <DocumentUploadForm onSubmit={handleUpload} />
      </TabsContent>

      <TabsContent value="search">
        {/* Componente con filtros avanzados y tabla de resultados */}
        <DocumentSearchTable onSearch={handleSearch} />
      </TabsContent>
      {/* Lógica BE-05: API Gestión Documental */}
    </Tabs>
  );
}

type UploadFormProps = { onSubmit: (fileData: any) => void };
function DocumentUploadForm({ onSubmit }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ file }); }} className="space-y-3">
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button type="submit"><FileUp className="mr-2 h-4 w-4" /> Subir</Button>
    </form>
  );
}

type SearchTableProps = { onSearch: (filters: any) => void };
function DocumentSearchTable({ onSearch }: SearchTableProps) {
  const [query, setQuery] = useState<string>("");
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input placeholder="Buscar por OC / Proveedor" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={() => onSearch({ q: query })}><Search className="mr-2 h-4 w-4" /> Buscar</Button>
      </div>
      <Table>{/* Tabla de resultados (mock) */}</Table>
    </div>
  );
}
