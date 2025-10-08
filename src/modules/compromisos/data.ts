// src/modules/compromisos/data.ts

export type Modelo = "ALFA" | "TIF" | "HIBRIDO" | "MAQUILA";
export type EstadoCompromiso =
	| "PENDIENTE"
	| "CONFIRMADO"
	| "REPROGRAMADO"
	| "VENCIDO"
	| "CUMPLIDO"
	| "CANCELADO";
export type CalidadEstado = "CONFORME" | "NO_CONFORME";

export interface Compromiso {
	id: string;
	oc: string;
	linea: string;
	proveedor: string;
	modelo: Modelo;
	fecha: string; // YYYY-MM-DD
	semana: string; // YYYY-Www
	cantidad: number;
	cantidad_recibida: number;
	estado: EstadoCompromiso;
	excluye_kpi?: boolean;
}

export interface Recepcion {
	id: string;
	compromiso_id: string;
	fecha: string; // ISO datetime
	cantidad: number;
	calidad: CalidadEstado;
	guia: string;
}

export interface ZC {
	id: string;
	oc: string;
	linea: string;
	proveedor: string;
	motivo: string;
	estado: "ABIERTA" | "EN_ANALISIS" | "RESUELTA" | "CERRADA";
	creada: string; // YYYY-MM-DD
}

export interface Documento {
	id: string;
	tipo: "GUIA" | "NC" | "EVIDENCIA";
	oc?: string;
	linea?: string;
	proveedor?: string;
	folio?: string;
	fecha?: string; // YYYY-MM-DD
	url?: string;
	estado?: "VALIDO" | "OBSERVADO" | "RECHAZADO";
}

export const compromisosSeed: Compromiso[] = [
	{
		id: "c1",
		oc: "OC-1001",
		linea: "1",
		proveedor: "Proveedor A",
		modelo: "HIBRIDO",
		fecha: "2025-10-10",
		semana: "2025-W41",
		cantidad: 1200,
		cantidad_recibida: 900,
		estado: "CONFIRMADO",
	},
	{
		id: "c2",
		oc: "OC-1001",
		linea: "2",
		proveedor: "Proveedor A",
		modelo: "HIBRIDO",
		fecha: "2025-10-12",
		semana: "2025-W41",
		cantidad: 800,
		cantidad_recibida: 800,
		estado: "CUMPLIDO",
	},
	{
		id: "c3",
		oc: "OC-1002",
		linea: "1",
		proveedor: "Proveedor B",
		modelo: "ALFA",
		fecha: "2025-10-05",
		semana: "2025-W40",
		cantidad: 500,
		cantidad_recibida: 0,
		estado: "VENCIDO",
	},
	{
		id: "c4",
		oc: "OC-1003",
		linea: "3",
		proveedor: "Proveedor C",
		modelo: "TIF",
		fecha: "2025-10-15",
		semana: "2025-W42",
		cantidad: 300,
		cantidad_recibida: 0,
		estado: "PENDIENTE",
	},
	{
		id: "c5",
		oc: "OC-1004",
		linea: "1",
		proveedor: "Proveedor B",
		modelo: "HIBRIDO",
		fecha: "2025-10-18",
		semana: "2025-W42",
		cantidad: 1000,
		cantidad_recibida: 100,
		estado: "REPROGRAMADO",
	},
];

export const recepcionesSeed: Recepcion[] = [
	{
		id: "r1",
		compromiso_id: "c1",
		fecha: "2025-10-08T10:00:00Z",
		cantidad: 600,
		calidad: "CONFORME",
		guia: "G-7788",
	},
	{
		id: "r2",
		compromiso_id: "c1",
		fecha: "2025-10-09T15:30:00Z",
		cantidad: 300,
		calidad: "CONFORME",
		guia: "G-7799",
	},
	{
		id: "r3",
		compromiso_id: "c2",
		fecha: "2025-10-07T09:00:00Z",
		cantidad: 800,
		calidad: "CONFORME",
		guia: "G-7800",
	},
	{
		id: "r4",
		compromiso_id: "c5",
		fecha: "2025-10-06T12:00:00Z",
		cantidad: 100,
		calidad: "NO_CONFORME",
		guia: "G-7810",
	},
];

export const zcSeed: ZC[] = [
	{
		id: "zc1",
		oc: "OC-1004",
		linea: "1",
		proveedor: "Proveedor B",
		motivo: "Diferencia de calidad",
		estado: "EN_ANALISIS",
		creada: "2025-10-06",
	},
];

export const documentosSeed: Documento[] = [
	{
		id: "d1",
		tipo: "GUIA",
		oc: "OC-1001",
		linea: "1",
		proveedor: "Proveedor A",
		folio: "G-7788",
		fecha: "2025-10-08",
		estado: "VALIDO",
		url: "https://example.com/G-7788.pdf",
	},
	{
		id: "d2",
		tipo: "GUIA",
		oc: "OC-1001",
		linea: "1",
		proveedor: "Proveedor A",
		folio: "G-7799",
		fecha: "2025-10-09",
		estado: "VALIDO",
		url: "https://example.com/G-7799.pdf",
	},
	{
		id: "d3",
		tipo: "GUIA",
		oc: "OC-1001",
		linea: "2",
		proveedor: "Proveedor A",
		folio: "G-7800",
		fecha: "2025-10-07",
		estado: "VALIDO",
		url: "https://example.com/G-7800.pdf",
	},
	{
		id: "d4",
		tipo: "NC",
		oc: "OC-1004",
		linea: "1",
		proveedor: "Proveedor B",
		folio: "NC-123",
		fecha: "2025-10-06",
		estado: "OBSERVADO",
		url: "https://example.com/NC-123.pdf",
	},
];

export const fmtCLP0 = new Intl.NumberFormat("es-CL", {
	style: "currency",
	currency: "CLP",
	maximumFractionDigits: 0,
});

export const weekOrder = (w: string) => Number(w.replace("-W", ""));
export const hoy = new Date();
export const diasAtraso = (iso: string) => {
	const d = new Date(iso);
	return Math.max(
		0,
		Math.ceil((hoy.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
	);
};
export const avancePct = (plan: number, recv: number) =>
	plan === 0 ? 0 : Math.round((recv / plan) * 100);
export const saldo = (plan: number, recv: number) => Math.max(0, plan - recv);

export function proveedoresUnicos(data: Compromiso[]) {
	return Array.from(new Set(data.map((c) => c.proveedor)));
}
export function semanasUnicas(data: Compromiso[]) {
	return Array.from(new Set(data.map((c) => c.semana))).sort(
		(a, b) => weekOrder(a) - weekOrder(b)
	);
}
