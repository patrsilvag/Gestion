// src/lib/otif.ts
// Utilidades para cálculo de OTIF y remanentes

export type OTIFStatus = "CUMPLE" | "FUERA_DE_FECHA" | "INCOMPLETO" | "NO_ENTREGADO";

export interface CompromisoBase {
  id: string;
  fechaObjetivo: string; // YYYY-MM-DD
  cantidad: number;
  tipo?: "ALFA" | "EXTRA";
}

export interface RecepcionBase {
  compromisoId: string;
  fechaRecepcion: string; // YYYY-MM-DD
  cantidad: number;
}

export interface OTIFDetalle {
  compromisoId: string;
  otif: OTIFStatus;
  enPlazo: boolean;
  enCantidad: boolean;
  remanente: number;
  tipo?: "ALFA" | "EXTRA";
}

export function calcularOTIF(compromisos: CompromisoBase[], recepciones: RecepcionBase[]): OTIFDetalle[] {
  const mapRec = new Map<string, RecepcionBase[]>();
  recepciones.forEach(r => {
    const arr = mapRec.get(r.compromisoId) || [];
    arr.push(r);
    mapRec.set(r.compromisoId, arr);
  });

  const det: OTIFDetalle[] = [];
  for (const c of compromisos) {
    const recs = mapRec.get(c.id) || [];
    const cantRecibida = recs.reduce((s, r) => s + r.cantidad, 0);
    const enCantidad = cantRecibida >= c.cantidad;
    const anyLate = recs.some(r => new Date(r.fechaRecepcion) > new Date(c.fechaObjetivo));
    const enPlazo = !anyLate && recs.length > 0;

    let otif: OTIFStatus;
    if (cantRecibida === 0) otif = "NO_ENTREGADO";
    else if (enCantidad && enPlazo) otif = "CUMPLE";
    else if (!enCantidad && enPlazo) otif = "INCOMPLETO";
    else otif = "FUERA_DE_FECHA";

    det.push({
      compromisoId: c.id,
      otif,
      enPlazo,
      enCantidad,
      remanente: Math.max(0, c.cantidad - cantRecibida),
      tipo: c.tipo
    });
  }
  return det;
}

// helper para generar alertas por remanente
export function alertasRemanente(otifs: OTIFDetalle[], umbral = 0) {
  return otifs.filter(o => o.remanente > umbral);
}
