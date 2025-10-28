// src/modules/dashboard/OperationalDashboard.tsx
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { useFetchDashboardData } from '@/hooks/demoHooks';

export default function OperationalDashboard() {
  // Lógica BE-10: Hook para obtener KPIs, Alertas y Umbrales
  const { kpis, alerts } = useFetchDashboardData();

  return (
    <div className="space-y-8">
      {/* Panel de Alertas Accionables (HU7) */}
      <Card className="border-destructive">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            <AlertTriangle className="mr-2 h-4 w-4 inline" /> ALERTAS CRÍTICAS
          </CardTitle>
          <Badge variant="destructive">{alerts.critical.length} Pendientes</Badge>
        </CardHeader>
        <CardContent className="overflow-visible"><ul className="list-disc pl-5">
            {alerts.critical.map((alert: {id: string; message: string; slaDays: number}) => (
              <li key={alert.id} className="text-sm text-destructive hover:underline cursor-pointer">
                {alert.message} ({alert.slaDays} días sin resolver)
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Separator />

      {/* Tarjetas de KPIs (HU7) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>KPI Alfa Semanal</CardHeader>
          <CardContent className="text-2xl font-bold text-primary overflow-visible">{kpis.alfa}%</CardContent>
        </Card>
        <Card>
          <CardHeader>Promedio OTIF</CardHeader>
          <CardContent className="text-2xl font-bold overflow-visible">{kpis.otif}%</CardContent>
        </Card>
        <Card>
          <CardHeader>% No Conformes (NC)</CardHeader>
          <CardContent className="text-2xl font-bold text-destructive overflow-visible">{kpis.ncRate}%</CardContent>
        </Card>
        <Card>
          <CardHeader>Aging Atrasos</CardHeader>
          <CardContent className="text-2xl font-bold overflow-visible">{kpis.agingDays} días</CardContent>
        </Card>
      </div>
      
      {/* Lógica BE-10: APIs de Dashboard y Alertas */}
    </div>
  );
}