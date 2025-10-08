// src/modules/oc/data.ts

export type OCEstado = "Abierta" | "Parcial" | "Cerrada";

export interface OC {
	oc: string;
	proveedor: string;
	fecha: string; // ISO: YYYY-MM-DD
	monto: number; // CLP
	saldo: number; // CLP
	estado: OCEstado;
}

export const ocSeed: OC[] = [
	{
		oc: "OC-1001",
		proveedor: "Proveedor A",
		fecha: "2025-09-19",
		monto: 12000000,
		saldo: 4500000,
		estado: "Parcial",
	},
	{
		oc: "OC-1002",
		proveedor: "Proveedor B",
		fecha: "2025-09-24",
		monto: 5600000,
		saldo: 0,
		estado: "Cerrada",
	},
	{
		oc: "OC-1003",
		proveedor: "Proveedor C",
		fecha: "2025-09-30",
		monto: 8500000,
		saldo: 8500000,
		estado: "Abierta",
	},
];

export const fmtCLP = new Intl.NumberFormat("es-CL", {
	style: "currency",
	currency: "CLP",
	maximumFractionDigits: 0,
});

export function fmtFechaDDMMYYYY(iso: string) {
	const d = new Date(iso);
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yyyy = d.getFullYear();
	return `${dd}-${mm}-${yyyy}`;
}
