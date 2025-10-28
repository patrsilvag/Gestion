import FormMetaInfo from "@/components/shared/FormMetaInfo";
import React from "react";
export default function OrdenLineaDetalle() {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Detalle de Línea de OC</h2>
      <div className="text-sm text-muted-foreground">Ruta: /oc/:ocId/linea/:lineId</div>
    </div>
  );
}
