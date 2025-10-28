import FormMetaInfo from "@/components/shared/FormMetaInfo";
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function Scoring() {
  const storageKey = "mant_scoring";
  const [data, setData] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number|null>(null);
  const [form, setForm] = useState<any>({ 'version': '', 'desde': '', 'hasta': '', 'peso_alfa': '', 'peso_otif': '', 'estado': '' });
  useEffect(()=>{try{const saved=localStorage.getItem(storageKey); if(saved) setData(JSON.parse(saved));}catch(_e){}},[]);
  useEffect(()=>{localStorage.setItem(storageKey, JSON.stringify(data));},[data]);

  const resetForm = ()=>setForm({ 'version': '', 'desde': '', 'hasta': '', 'peso_alfa': '', 'peso_otif': '', 'estado': '' });
  const onAdd = ()=>{ setData(d=>[...d, form]); resetForm(); };
  const onUpdate = ()=>{
    if(editingIndex===null) return;
    setData(d=>d.map((x,i)=> i===editingIndex ? form : x));
    setEditingIndex(null); resetForm();
  };
  const onEdit = (idx:number)=>{ setEditingIndex(idx); setForm(data[idx]); };
  const onDelete = (idx:number)=> setData(d=>d.filter((_,i)=>i!==idx));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Scoring — Formulario</CardTitle></CardHeader>
        <CardContent className="overflow-visible"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Versión</label>
  <Input type="text" value={form['version']} onChange={(e)=>setForm((s: any) =>({...s, 'version': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Vigencia Desde</label>
  <Input type="date" value={form['desde']} onChange={(e)=>setForm((s: any) =>({...s, 'desde': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Vigencia Hasta</label>
  <Input type="date" value={form['hasta']} onChange={(e)=>setForm((s: any) =>({...s, 'hasta': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Peso Alfa %</label>
  <Input type="number" value={form['peso_alfa']} onChange={(e)=>setForm((s: any) =>({...s, 'peso_alfa': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Peso OTIF %</label>
  <Input type="number" value={form['peso_otif']} onChange={(e)=>setForm((s: any) =>({...s, 'peso_otif': e.target.value}))} />
</div>


            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Estado</label>
              <Select value={form['estado']} onValueChange={(v)=>setForm((s: any) =>({...s, 'estado': v}))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                <SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
                  <SelectItem value="borrador">Borrador</SelectItem>
<SelectItem value="vigente">Vigente</SelectItem>
<SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
          <div className="mt-4 flex gap-2">
            {editingIndex===null ? (
              <Button onClick={onAdd}>Agregar</Button>
            ) : (
              <>
                <Button onClick={onUpdate}>Guardar</Button>
                <Button variant="secondary" onClick={()=>{setEditingIndex(null); resetForm();}}>Cancelar</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Scoring — Listado</CardTitle></CardHeader>
        <CardContent className="overflow-visible"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Versión</TableHead>
<TableHead>Desde</TableHead>
<TableHead>Hasta</TableHead>
<TableHead>Peso Alfa %</TableHead>
<TableHead>Peso OTIF %</TableHead>
<TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx)=> (
                <TableRow key={idx}>
                  <TableCell>{row['version']}</TableCell>
<TableCell>{row['desde']}</TableCell>
<TableCell>{row['hasta']}</TableCell>
<TableCell>{row['peso_alfa']}</TableCell>
<TableCell>{row['peso_otif']}</TableCell>
<TableCell>{row['estado']}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={()=>onEdit(idx)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={()=>onDelete(idx)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length===0 && (
                <TableRow><TableCell colSpan={7}>Sin registros</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
