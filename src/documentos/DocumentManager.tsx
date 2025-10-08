// src/modules/documentos/DocumentManager.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUp, Search } from 'lucide-react';

export default function DocumentManager() {
  const [activeTab, setActiveTab] = useState('search');

  const handleUpload = (fileData) => {
    // 1. Validaciones: formato, tamaño, metadatos (OC, proveedor)
    // 2. Lógica BE-05: Detección de duplicados (hash+folio) y almacenamiento (S3/Cloud Storage)
    alert('Documento cargado y vinculado a OC.');
  };

  const handleSearch = (filters) => {
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