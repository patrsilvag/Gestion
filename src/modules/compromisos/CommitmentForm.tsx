// src/modules/compromisos/CommitmentForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker'; // Componente de calendario

export default function CommitmentForm({ ocLine }) {
  // Lógica de estado para Fecha, Cantidad, Evidencia
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar Cantidad <= ocLine.saldo (E2)
    // Validar Fecha en ventana (E1)
    
    // Lógica BE-07: Llamar a la API para crear el compromiso 'Confirmado'
    // Lógica BE-05: Subir el archivo de 'evidencia' (Flujo HU1, paso 5)
    
    alert('Compromiso registrado con éxito. KPIs se recalculan.');
  };
  
  const handleReprogram = () => {
    // Abrir ReprogramModal (Gestiona E4: Inserto/Adelanto y exclusión KPI)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="OC/Línea" value={ocLine.id} disabled />
      <Input label="Cantidad a Comprometer" type="number" max={ocLine.saldo} />
      <DatePicker label="Fecha de Entrega (Semana Vigente)" />
      <Input label="Adjuntar Evidencia (Correo/PDF)" type="file" />
      <Button type="submit" className="bg-primary hover:bg-primary/90">
        Confirmar Compromiso
      </Button>
      <Button variant="outline" onClick={handleReprogram}>
        Reprogramar (Inserto/Adelanto)
      </Button>
      {/* Lógica BE-07/BE-08: APIs de Compromisos y Reprogramaciones */}
    </form>
  );
}