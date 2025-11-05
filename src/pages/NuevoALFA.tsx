import React, { useMemo, useState } from 'react';

type Row = { sku:string; descripcion:string; semana:string; sugerido:number; cantidad:number };

const NuevoALFA: React.FC = () => {
  const [proveedor, setProveedor] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [rows, setRows] = useState<Row[]>([
    { sku:'MAT-001', descripcion:'Material 001', semana:'2025-45', sugerido:120, cantidad:120 },
    { sku:'MAT-002', descripcion:'Material 002', semana:'2025-45', sugerido:80, cantidad:80 },
  ]);
  const total = useMemo(()=>rows.reduce((a,r)=>a+(Number(r.cantidad)||0),0),[rows]);
  const actualizar=(i:number, f:keyof Row, v:any)=>{ const c=[...rows]; (c[i] as any)[f]= f==='cantidad'||f==='sugerido'?Number(v):v; setRows(c); };
  const enviar=()=>{
    if(!proveedor||!desde||!hasta) return alert('Selecciona proveedor y rango de semanas.');
    alert('ALFA enviado (simulado).');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Nuevo ALFA</h1>
      <div className="grid sm:grid-cols-3 gap-3 max-w-4xl">
        <input className="border rounded p-2" placeholder="Proveedor" value={proveedor} onChange={e=>setProveedor(e.target.value)} />
        <input className="border rounded p-2" type="week" value={desde} onChange={e=>setDesde(e.target.value)} />
        <input className="border rounded p-2" type="week" value={hasta} onChange={e=>setHasta(e.target.value)} />
      </div>
      <div className="overflow-auto">
        <table className="min-w-[720px] w-full text-sm border">
          <thead className="bg-gray-100">
            <tr><th className="p-2 border">SKU</th><th className="p-2 border">Descripción</th><th className="p-2 border">Semana</th><th className="p-2 border">Sugerido</th><th className="p-2 border">Cantidad</th></tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td className="border p-1">{r.sku}</td>
                <td className="border p-1">{r.descripcion}</td>
                <td className="border p-1">{r.semana}</td>
                <td className="border p-1">{r.sugerido}</td>
                <td className="border p-1"><input type="number" className="w-28 border rounded p-1" value={r.cantidad} onChange={e=>actualizar(i,'cantidad',e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td className="p-2 border font-medium" colSpan={4}>Total</td><td className="p-2 border font-semibold">{total}</td></tr></tfoot>
        </table>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={()=>alert('ALFA guardado (borrador).')}>Guardar borrador</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={enviar}>Guardar y enviar</button>
      </div>
      <p className="text-xs text-gray-500">* Conecta tus endpoints para persistir y notificar.</p>
    </div>
  );
};

export default NuevoALFA;
