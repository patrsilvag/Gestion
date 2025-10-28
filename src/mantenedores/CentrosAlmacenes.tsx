import FormMetaInfo from "@/components/shared/FormMetaInfo";
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function CentrosAlmacenes() {
  const storageKey = "mant_centrosalmacenes";
  const [data, setData] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number|null>(null);
  const [form, setForm] = useState<any>({ 'codigo': '', 'centro': '', 'almacen': '', 'direccion': '', 'estado': '' });
  useEffect(()=>{try{const saved=localStorage.getItem(storageKey); if(saved) setData(JSON.parse(saved));}catch(_e){}},[]);
  useEffect(()=>{localStorage.setItem(storageKey, JSON.stringify(data));},[data]);

  const resetForm = ()=>setForm({ 'codigo': '', 'centro': '', 'almacen': '', 'direccion': '', 'estado': '' });
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
        <CardHeader><CardTitle>CentrosAlmacenes — Formulario</CardTitle></CardHeader>
        <CardContent className="overflow-visible"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Código</label>
  <Input type="text" value={form['codigo']} onChange={(e)=>setForm((s: any) =>({...s, 'codigo': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Centro</label>
  <Input type="text" value={form['centro']} onChange={(e)=>setForm((s: any) =>({...s, 'centro': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Almacén</label>
  <Input type="text" value={form['almacen']} onChange={(e)=>setForm((s: any) =>({...s, 'almacen': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Dirección</label>
  <Input type="text" value={form['direccion']} onChange={(e)=>setForm((s: any) =>({...s, 'direccion': e.target.value}))} />
</div>


            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Estado</label>
              <Select value={form['estado']} onValueChange={(v)=>setForm((s: any) =>({...s, 'estado': v}))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                <SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
                  <SelectItem value="activo">Activo</SelectItem>
<SelectItem value="inactivo">Inactivo</SelectItem>
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
        <CardHeader><CardTitle>CentrosAlmacenes — Listado</CardTitle></CardHeader>
        <CardContent className="overflow-visible"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
<TableHead>Centro</TableHead>
<TableHead>Almacén</TableHead>
<TableHead>Dirección</TableHead>
<TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx)=> (
                <TableRow key={idx}>
                  <TableCell>{row['codigo']}</TableCell>
<TableCell>{row['centro']}</TableCell>
<TableCell>{row['almacen']}</TableCell>
<TableCell>{row['direccion']}</TableCell>
<TableCell>{row['estado']}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={()=>onEdit(idx)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={()=>onDelete(idx)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length===0 && (
                <TableRow><TableCell colSpan={6}>Sin registros</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
