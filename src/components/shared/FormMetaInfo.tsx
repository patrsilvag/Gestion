import React from "react";
type Props = { menu: string; fuentes: string; carga: string };
export default function FormMetaInfo({ menu, fuentes, carga }: Props) {
  return (
    <div className="mb-4 rounded-lg border bg-slate-50 p-3 text-sm text-slate-700">
      <div className="grid gap-1 md:grid-cols-3">
        <div><div className="font-semibold">Menú (ruta)</div><div>{menu}</div></div>
        <div><div className="font-semibold">Fuentes de datos</div><div>{fuentes}</div></div>
        <div><div className="font-semibold">Punto de carga en la app</div><div>{carga}</div></div>
      </div>
    </div>
  );
}
