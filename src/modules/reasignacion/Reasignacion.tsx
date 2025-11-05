// src/modules/reasignacion/Reasignacion.tsx
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export interface Reasignacion {
  oc: string;
  linea: string;
  proveedorOrigen: string;
  proveedorDestino: string;
  cantidad: number;
  motivo: string;
  fecha: string; // YYYY-MM-DD
}

const proveedores = ["PROV-001","PROV-002","PROV-003"];
const ocsDemo = [{oc:"OC-1001", linea:"10", proveedor:"PROV-001", cantidad:100}];

export default function ReasignacionPage(){
  const [selOC, setSelOC] = useState<string>(ocsDemo[0].oc);
  const [dest, setDest] = useState<string>(proveedores[1]);
  const [rows, setRows] = useState<Reasignacion[]>([]);

  function agregar(){
    const item = {
      oc: selOC,
      linea: "10",
      proveedorOrigen: ocsDemo[0].proveedor,
      proveedorDestino: dest,
      cantidad: 50,
      motivo: "Contingencia de abastecimiento",
      fecha: new Date().toISOString().substring(0,10)
    };
    setRows([...rows, item]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reasignación de proveedor (trazabilidad)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <Select value={selOC} onValueChange={setSelOC}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Selecciona OC"/></SelectTrigger>
            <SelectContent>
              {ocsDemo.map(o => <SelectItem key={o.oc} value={o.oc}>{o.oc}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dest} onValueChange={setDest}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Proveedor destino"/></SelectTrigger>
            <SelectContent>
              {proveedores.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={agregar}>Agregar reasignación</Button>
        </div>

        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>OC</TableHead>
              <TableHead>Línea</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r,i)=>(
              <TableRow key={i}>
                <TableCell>{r.oc}</TableCell>
                <TableCell>{r.linea}</TableCell>
                <TableCell>{r.proveedorOrigen}</TableCell>
                <TableCell>{r.proveedorDestino}</TableCell>
                <TableCell>{r.cantidad}</TableCell>
                <TableCell>{r.motivo}</TableCell>
                <TableCell>{r.fecha}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
