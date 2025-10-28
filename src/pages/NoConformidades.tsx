import FormMetaInfo from "@/components/shared/FormMetaInfo";
import { Portal as SelectPortal } from "@radix-ui/react-select";
// src/pages/NoConformidades.tsx
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableFooter,
} from "@/components/ui/table";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Filter } from "lucide-react";

import {
	zcSeed,
	compromisosSeed,
	proveedoresUnicos,
} from "@/modules/compromisos/data";

type ZCEstado = "Todos" | "ABIERTA" | "EN_ANALISIS" | "RESUELTA" | "CERRADA";
type SortKey = "oc" | "linea" | "proveedor" | "motivo" | "estado" | "creada";
type SortDir = "asc" | "desc";

type Row = {
	id: string;
	oc: string;
	linea: string;
	proveedor: string;
	motivo: string;
	estado: Exclude<ZCEstado, "Todos">;
	creada: string; // YYYY-MM-DD
};

function estadoClase(estado: Row["estado"]) {
	switch (estado) {
		case "ABIERTA":
			return "bg-red-100 text-red-800";
		case "EN_ANALISIS":
			return "bg-amber-100 text-amber-800";
		case "RESUELTA":
			return "bg-blue-100 text-blue-800";
		case "CERRADA":
			return "bg-emerald-100 text-emerald-800";
		default:
			return "bg-slate-100 text-slate-800";
	}
}

export default function NoConformidades() {
	// Base (ya viene lista desde zcSeed)
	const base: Row[] = useMemo(() => {
		return zcSeed.map((z) => ({
			id: z.id,
			oc: z.oc,
			linea: z.linea,
			proveedor: z.proveedor,
			motivo: z.motivo,
			estado: z.estado,
			creada: z.creada,
		}));
	}, []);

	// Filtros
	const [q, setQ] = useState<string>("");
	const [proveedor, setProveedor] = useState<string>("Todos");
	const [estado, setEstado] = useState<ZCEstado>("Todos");
	const [desde, setDesde] = useState<string>(""); // YYYY-MM-DD
	const [hasta, setHasta] = useState<string>("");

	const proveedores = useMemo(
		() => ["Todos", ...proveedoresUnicos(compromisosSeed)],
		[]
	);

	// Orden
	const [sortBy, setSortBy] = useState<SortKey>("creada");
	const [sortDir, setSortDir] = useState<SortDir>("desc");
	const toggleSort = (col: SortKey) => {
		if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortBy(col);
			setSortDir("asc");
		}
	};
	const sortIndicator = (col: SortKey) =>
		sortBy === col ? (sortDir === "asc" ? " ▲" : " ▼") : "";

	// Filtrado
	const filtered = useMemo(() => {
		const text = q.trim().toLowerCase();
		return base.filter((r: Row) => {
			const hitText =
				!text ||
				`${r.oc} ${r.linea} ${r.proveedor} ${r.motivo}`
					.toLowerCase()
					.includes(text);
			const hitProv = proveedor === "Todos" ? true : r.proveedor === proveedor;
			const hitEst = estado === "Todos" ? true : r.estado === estado;
			const d = r.creada; // YYYY-MM-DD
			const hitDesde = !desde || d >= desde;
			const hitHasta = !hasta || d <= hasta;
			return hitText && hitProv && hitEst && hitDesde && hitHasta;
		});
	}, [base, q, proveedor, estado, desde, hasta]);

	// Orden
	const sorted = useMemo(() => {
		const arr = [...filtered];
		arr.sort((a: Row, b: Row) => {
			let A: number | string, B: number | string;
			switch (sortBy) {
				case "creada":
					A = a.creada;
					B = b.creada;
					break;
				case "oc":
					A = a.oc;
					B = b.oc;
					break;
				case "linea":
					A = a.linea;
					B = b.linea;
					break;
				case "proveedor":
					A = a.proveedor;
					B = b.proveedor;
					break;
				case "motivo":
					A = a.motivo;
					B = b.motivo;
					break;
				case "estado":
					A = a.estado;
					B = b.estado;
					break;
				default:
					A = 0;
					B = 0;
			}
			const s = A === B ? 0 : A > B ? 1 : -1;
			return sortDir === "asc" ? s : -s;
		});
		return arr;
	}, [filtered, sortBy, sortDir]);

	// Totales por estado
	const totals = useMemo(() => {
		const total = sorted.length;
		const abiertas = sorted.filter((r) => r.estado === "ABIERTA").length;
		const analisis = sorted.filter((r) => r.estado === "EN_ANALISIS").length;
		const resueltas = sorted.filter((r) => r.estado === "RESUELTA").length;
		const cerradas = sorted.filter((r) => r.estado === "CERRADA").length;
		return { total, abiertas, analisis, resueltas, cerradas };
	}, [sorted]);

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">No Conformidades</h1>
				<p className="text-sm text-muted-foreground">
					Seguimiento de ZC por OC/Línea, con filtros, estados y fechas (en
					memoria).
				</p>
			</div>

			{/* Filtros */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<Filter className="w-4 h-4" /> Filtros
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-visible">
					<Input
						placeholder="Buscar por OC / línea / proveedor / motivo"
						value={q}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setQ(e.target.value)
						}
					/>

					<Select value={proveedor} onValueChange={(v) => setProveedor(v)}>
						<SelectTrigger>
							<SelectValue placeholder="Proveedor" />
						</SelectTrigger>
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{proveedores.map((p) => (
								<SelectItem key={p} value={p}>
									{p}
								</SelectItem>
							))}
						</SelectContent></SelectPortal>
					</Select>

					<Select
						value={estado}
						onValueChange={(v) => setEstado(v as ZCEstado)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{(
								[
									"Todos",
									"ABIERTA",
									"EN_ANALISIS",
									"RESUELTA",
									"CERRADA",
								] as const
							).map((e) => (
								<SelectItem key={e} value={e}>
									{e}
								</SelectItem>
							))}
						</SelectContent></SelectPortal>
					</Select>

					<Input
						type="date"
						value={desde}
						onChange={(e) => setDesde(e.target.value)}
					/>
					<Input
						type="date"
						value={hasta}
						onChange={(e) => setHasta(e.target.value)}
					/>
				</CardContent>
			</Card>

			{/* KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Total</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">{totals.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Abiertas</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><Badge className={estadoClase("ABIERTA")}>{totals.abiertas}</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">En análisis</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><Badge className={estadoClase("EN_ANALISIS")}>
							{totals.analisis}
						</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Resueltas</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><Badge className={estadoClase("RESUELTA")}>
							{totals.resueltas}
						</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Cerradas</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><Badge className={estadoClase("CERRADA")}>{totals.cerradas}</Badge>
					</CardContent>
				</Card>
			</div>

			{/* Tabla */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<AlertCircle className="w-4 h-4" /> Listado ({sorted.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("oc")}
									>
										OC{sortIndicator("oc")}
									</button>
								</TableHead>
								<TableHead>Línea</TableHead>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("proveedor")}
									>
										Proveedor{sortIndicator("proveedor")}
									</button>
								</TableHead>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("motivo")}
									>
										Motivo{sortIndicator("motivo")}
									</button>
								</TableHead>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("estado")}
									>
										Estado{sortIndicator("estado")}
									</button>
								</TableHead>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("creada")}
									>
										Creada{sortIndicator("creada")}
									</button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sorted.map((r: Row) => (
								<TableRow key={r.id} className="hover:bg-muted/50">
									<TableCell>{r.oc}</TableCell>
									<TableCell>{r.linea}</TableCell>
									<TableCell>{r.proveedor}</TableCell>
									<TableCell>{r.motivo}</TableCell>
									<TableCell>
										<Badge className={estadoClase(r.estado)}>{r.estado}</Badge>
									</TableCell>
									<TableCell>{r.creada}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-sm text-muted-foreground"
								>
									Mostrando {sorted.length} registro(s)
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Tip: filtra por rango de fechas y estado para priorizar cierres.
			</div>
		</div>
	);
}
