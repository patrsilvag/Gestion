import React, { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function Usuarios() {
  const storageKey = "mant_usuarios";
  const [data, setData] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number|null>(null);
  const [form, setForm] = useState<any>({ 'usuario': '', 'nombre': '', 'correo': '', 'rol': '', 'empresa': '', 'estado': '' });
  useEffect(()=>{try{const saved=localStorage.getItem(storageKey); if(saved) setData(JSON.parse(saved));}catch(_e){}},[]);
  useEffect(()=>{localStorage.setItem(storageKey, JSON.stringify(data));},[data]);

  const resetForm = ()=>setForm({ 'usuario': '', 'nombre': '', 'correo': '', 'rol': '', 'empresa': '', 'estado': '' });
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
        <CardHeader><CardTitle>Usuarios — Formulario</CardTitle></CardHeader>
        <CardContent className="overflow-visible"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Usuario</label>
  <Input type="text" value={form['usuario']} onChange={(e)=>setForm(s=>({...s, 'usuario': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Nombre</label>
  <Input type="text" value={form['nombre']} onChange={(e)=>setForm(s=>({...s, 'nombre': e.target.value}))} />
</div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Correo</label>
  <Input type="email" value={form['correo']} onChange={(e)=>setForm(s=>({...s, 'correo': e.target.value}))} />
</div>


            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Rol</label>
              <Select value={form['rol']} onValueChange={(v)=>setForm(s=>({...s, 'rol': v}))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                <SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
                  <SelectItem value="planificacin">Planificación</SelectItem>
<SelectItem value="programacin">Programación</SelectItem>
<SelectItem value="bodega">Bodega</SelectItem>
<SelectItem value="calidad">Calidad</SelectItem>
<SelectItem value="compras">Compras</SelectItem>
<SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>


<div className="flex flex-col gap-1">
  <label className="text-xs text-muted-foreground">Empresa/Proveedor</label>
  <Input type="text" value={form['empresa']} onChange={(e)=>setForm(s=>({...s, 'empresa': e.target.value}))} />
</div>


            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Estado</label>
              <Select value={form['estado']} onValueChange={(v)=>setForm(s=>({...s, 'estado': v}))}>
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
        <CardHeader><CardTitle>Usuarios — Listado</CardTitle></CardHeader>
        <CardContent className="overflow-visible"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
<TableHead>Nombre</TableHead>
<TableHead>Correo</TableHead>
<TableHead>Rol</TableHead>
<TableHead>Empresa</TableHead>
<TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx)=> (
                <TableRow key={idx}>
                  <TableCell>{row['usuario']}</TableCell>
<TableCell>{row['nombre']}</TableCell>
<TableCell>{row['correo']}</TableCell>
<TableCell>{row['rol']}</TableCell>
<TableCell>{row['empresa']}</TableCell>
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
