// src/modules/maquila/MaquilaConciliation.tsx
import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MaquilaConciliation() {
  const [reconciliationData, setReconciliationData] = useState(null);

  const handleImport = (file) => {
    // Lógica BE-11: Importar movimientos del maquilador
    // Procesamiento: Cruce contra stock/guías internas
    
    // Simulación del resultado:
    setReconciliationData({
      differences: 50, // Ejemplo: Diferencia > umbral (E1)
      status: 'Diferencias Detectadas',
      suggestedAdjustment: 'Creación de NC-XXX y ajuste de saldo.',
    });
  };

  const handleGenerateActa = () => {
    // Lógica BE-11: Generar el 'Acta' de conciliación (RN)
    // El acta es un documento que requiere firma/aprobación.
    alert('Acta generada y enviada a aprobación.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conciliación de Inventario y Movimientos de Maquila</CardTitle>
        <CardDescription>Cargar movimientos del período para cruzar contra stock y guías.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-visible">
        <Input type="file" onChange={(e) => handleImport(e.target.files[0])} accept=".csv,.xlsx" />
        <Button onClick={handleImport} variant="outline"><Upload className="mr-2 h-4 w-4" /> Importar Movimientos</Button>

        {reconciliationData && (
          <Alert>
            <AlertTitle className={reconciliationData.differences > 0 ? 'text-destructive' : 'text-primary'}>
              Resultado de la Conciliación
            </AlertTitle>
            <AlertDescription>
              **Estado:** {reconciliationData.status}. **Diferencia Total:** {reconciliationData.differences} unidades.
              <p>Propuesta de Ajuste: {reconciliationData.suggestedAdjustment}</p>
              <Button className="mt-2 bg-primary hover:bg-primary/90" onClick={handleGenerateActa}>
                Generar Acta de Conciliación
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {/* Lógica BE-11: API Conciliación Maquila */}
    </Card>
  );
}