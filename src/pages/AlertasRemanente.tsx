import React from 'react';
import { calcularOTIF, alertasRemanente } from '@/lib/otif';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AlertasRemanente(){
  // Datos demo hasta conectar con backend
  const compromisos=[{id:'C1', fechaObjetivo:'2025-11-10', cantidad:100, tipo:'ALFA'}];
  const recepciones=[{compromisoId:'C1', fechaRecepcion:'2025-11-09', cantidad:50}];
  const otifs = calcularOTIF(compromisos as any, recepciones as any);
  const alertas = alertasRemanente(otifs, 0);

  return (
    <Card>
      <CardHeader><CardTitle>Alertas de Remanente</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Compromiso</TableHead>
              <TableHead>OTIF</TableHead>
              <TableHead>Remanente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertas.map((a)=> (
              <TableRow key={a.compromisoId}>
                <TableCell>{a.compromisoId}</TableCell>
                <TableCell>{a.otif}</TableCell>
                <TableCell>{a.remanente}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
