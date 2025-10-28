import React, { useState } from "react";
import FormMetaInfo from "@/components/shared/FormMetaInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

type OcLine = {
  id: string | number;
  saldo: number;
};

type CommitmentFormProps = {
  ocLine: OcLine;
};

export default function CommitmentForm({ ocLine }: CommitmentFormProps) {
  const [cantidad, setCantidad] = useState<number>(0);
  const [fecha, setFecha] = useState<string>("");
  const [evidencia, setEvidencia] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Validar cantidad <= ocLine.saldo y que fecha esté en la ventana permitida
    // TODO: Integrar con BE-07 (crear compromiso) y BE-05 (subir evidencia)
    alert("Compromiso enviado (demo)");
  };

  const handleReprogram = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO: Integrar flujo de Reprogramación (BE-08)
    alert("Ir a Reprogramar (demo)");
  };

  return (
    <div className="space-y-6">
      <FormMetaInfo menu="/commitmentform" fuentes="UI" carga="Formulario / Consulta" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">OC/Línea</label>
          <Input value={String(ocLine?.id ?? "")} disabled />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Cantidad a Comprometer</label>
          <Input
            type="number"
            max={ocLine?.saldo as number}
            value={cantidad}
            onChange={(ev) => setCantidad(Number(ev.target.value))}
            required
          />
          <p className="text-xs text-muted-foreground">Saldo disponible: {ocLine?.saldo}</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Fecha de Entrega (Semana Vigente)</label>
          <DatePicker
            value={fecha}
            onChange={(ev) => setFecha(ev.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Adjuntar Evidencia (Correo/PDF)</label>
          <input
            type="file"
            onChange={(ev) => setEvidencia(ev.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Confirmar Compromiso
          </Button>
          <Button variant="outline" onClick={handleReprogram}>
            Reprogramar (Inserto/Adelanto)
          </Button>
        </div>
        {/* Lógica BE-07/BE-08: APIs de Compromisos y Reprogramaciones */}
      </form>
    </div>
  );
}
