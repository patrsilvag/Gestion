import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import FormMetaInfo from "@/components/shared/FormMetaInfo";
import UploadExcelButton from "@/components/shared/UploadExcelButton";

type EstadoActa = "Borrador" | "Aprobada";
type Row = { codigo: string; descripcion: string; cantidad: number; unidad: string; tipo: "Ingreso"|"Consumo"|"Producido"|"Merma" };

export default function MaquilaActas() {
  const storageKey = "maquila_actas_rows";
  const [periodo, setPeriodo] = useState<string>("");
  const [estado, setEstado] = useState<EstadoActa>("Borrador");
  const [rows, setRows] = useState<Row[]>([]);
  const [observaciones, setObservaciones] = useState<string>("");

  useEffect(()=>{
    try{
      const saved = localStorage.getItem(storageKey);
      if(saved) setRows(JSON.parse(saved));
    }catch{}
  },[]);
  useEffect(()=>{ localStorage.setItem(storageKey, JSON.stringify(rows)); },[rows]);

  const resumen = useMemo(()=>{
    const tot = {Ingreso:0, Consumo:0, Producido:0, Merma:0} as Record<Row["tipo"], number>;
    rows.forEach(r => { tot[r.tipo] += Number(r.cantidad||0); });
    return tot;
  },[rows]);

  const onAddRow = ()=> setRows(d=>[...d, {codigo:"", descripcion:"", cantidad:0, unidad:"u", tipo:"Ingreso"}]);
  const onDelete = (idx:number)=> setRows(d=>d.filter((_,i)=>i!==idx));
  const onChange = (idx:number, patch: Partial<Row>) => setRows(d=>d.map((r,i)=> i===idx ? {...r, ...patch} : r));

  const handleFiles = (files: FileList) => {
    // Placeholder: solo muestra nombres, integrar parser a futuro (SheetJS / PapaParse)
    const names = Array.from(files).map(f=>f.name).join(", ");
    alert("Archivos seleccionados: " + names + "\n(Parsing pendiente)");
  };

  const generarActa = ()=>{
    if(!periodo) { alert("Selecciona un período (mes)."); return; }
    alert("Acta generada en estado Borrador para período " + periodo);
    setEstado("Borrador");
  };
  const aprobarActa = ()=>{
    if(rows.length===0){ alert("No hay movimientos para aprobar."); return; }
    setEstado("Aprobada");
    alert("Acta aprobada.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Conciliación de Maquila — Actas</CardTitle></CardHeader>
        <CardContent className="overflow-visible">
          <FormMetaInfo
            menu="/maquila/actas"
            fuentes="Excel/CSV (movimientos del período) + UI"
            carga="Importar CSV/XLSX + Formulario"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Período (AAAA-MM)</label>
              <Input type="month" value={periodo} onChange={(e)=>setPeriodo(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Estado del Acta</label>
              <Select value={estado} onValueChange={(v:EstadoActa)=>setEstado(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                <SelectContent className="z-[9999]" position="popper" side="bottom" sideOffset={6}>
                  <SelectItem value="Borrador">Borrador</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <UploadExcelButton onFiles={handleFiles} />
              <Button type="button" onClick={onAddRow}>Agregar fila</Button>
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-28">Cantidad</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r,idx)=>(
                  <TableRow key={idx}>
                    <TableCell>
                      <Select value={r.tipo} onValueChange={(v:Row["tipo"])=>onChange(idx,{tipo:v})}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent className="z-[9999]" position="popper" side="bottom" sideOffset={6}>
                          <SelectItem value="Ingreso">Ingreso</SelectItem>
                          <SelectItem value="Consumo">Consumo</SelectItem>
                          <SelectItem value="Producido">Producido</SelectItem>
                          <SelectItem value="Merma">Merma</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input value={r.codigo} onChange={e=>onChange(idx,{codigo:e.target.value})}/></TableCell>
                    <TableCell><Input value={r.descripcion} onChange={e=>onChange(idx,{descripcion:e.target.value})}/></TableCell>
                    <TableCell><Input type="number" value={r.cantidad} onChange={e=>onChange(idx,{cantidad: Number(e.target.value)})}/></TableCell>
                    <TableCell><Input value={r.unidad} onChange={e=>onChange(idx,{unidad:e.target.value})}/></TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="destructive" onClick={()=>onDelete(idx)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length===0 && (<TableRow><TableCell colSpan={6}>Sin movimientos</TableCell></TableRow>)}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded border p-2"><div className="text-xs text-muted-foreground">Ingresos</div><div className="font-semibold">{resumen.Ingreso}</div></div>
            <div className="rounded border p-2"><div className="text-xs text-muted-foreground">Consumos</div><div className="font-semibold">{resumen.Consumo}</div></div>
            <div className="rounded border p-2"><div className="text-xs text-muted-foreground">Producidos</div><div className="font-semibold">{resumen.Producido}</div></div>
            <div className="rounded border p-2"><div className="text-xs text-muted-foreground">Mermas</div><div className="font-semibold">{resumen.Merma}</div></div>
          </div>

          <div className="mt-4">
            <label className="text-xs text-muted-foreground">Observaciones</label>
            <Input value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={generarActa}>Generar acta</Button>
            <Button variant="secondary" onClick={aprobarActa}>Aprobar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
