// src/modules/scoring/SupplierScoring.tsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFetchScoringRanking } from '@/hooks/demoHooks';

export default function SupplierScoring() {
  // Lógica BE-09: Hook para obtener el ranking de scoring
  const { data: ranking, isLoading } = useFetchScoringRanking();

  const handleDrillDown = (supplierId: string) => {
    // Navegar a la vista de detalle para ver los eventos (ZC, Reprogramaciones)
    // que impactaron el score (Flujo HU5)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Scoring y Desempeño de Proveedores</h2>
      
      <Table>
        <TableCaption>Ranking Mensual de Proveedores por Modelo Alfa/OTIF</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Score (Puntaje)</TableHead>
            <TableHead>Cumplimiento Alfa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranking.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.supplierName}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.alfaCompliance}%</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleDrillDown(row.id)}>
                  <BarChart3 className="mr-2 h-4 w-4" /> Drill-Down
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Lógica BE-09: Motor Scoring */}
    </div>
  );
}