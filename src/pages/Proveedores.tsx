import FormMetaInfo from "@/components/shared/FormMetaInfo";
import { Portal as SelectPortal } from "@radix-ui/react-select";
// src/pages/Proveedores.tsx
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
import { Filter, Download } from "lucide-react";

import {
	compromisosSeed,
	proveedoresUnicos,
	EstadoCompromiso,
} from "@/modules/compromisos/data";

type SortKey =
	| "proveedor"
	| "plan"
	| "recibido"
	| "saldo"
	| "fillRate"
	| "abiertos"
	| "vencidos"
	| "reprogramados";
type SortDir = "asc" | "desc";

type Row = {
	proveedor: string;
	plan: number;
	recibido: number;
	saldo: number;
	fillRate: number; // 0..100
	abiertos: number; // estados PENDIENTE/CONFIRMADO
	vencidos: number; // estado VENCIDO
	reprogramados: number; // estado REPROGRAMADO
	cumplidos: number; // estado CUMPLIDO
};

function estadoGrupo(e: EstadoCompromiso) {
	if (e === "PENDIENTE" || e === "CONFIRMADO") return "abiertos";
	if (e === "VENCIDO") return "vencidos";
	if (e === "REPROGRAMADO") return "reprogramados";
	if (e === "CUMPLIDO") return "cumplidos";
	return "otros";
}

export default function Proveedores() {
	// base
	const base = compromisosSeed;

	// filtros
	const [q, setQ] = useState<string>("");
	const [top, setTop] = useState<"Todos" | "5" | "10" | "20">("Todos"); // top por plan
	const [modelo, setModelo] = useState<
		"Todos" | "ALFA" | "TIF" | "HIBRIDO" | "MAQUILA"
	>("Todos");

	// agregación por proveedor
	const agregados: Row[] = useMemo(() => {
		const acc = new Map<string, Row>();
		for (const c of base) {
			if (modelo !== "Todos" && c.modelo !== modelo) continue;
			const r = acc.get(c.proveedor) ?? {
				proveedor: c.proveedor,
				plan: 0,
				recibido: 0,
				saldo: 0,
				fillRate: 0,
				abiertos: 0,
				vencidos: 0,
				reprogramados: 0,
				cumplidos: 0,
			};
			r.plan += c.cantidad;
			r.recibido += c.cantidad_recibida;
			r.saldo = Math.max(0, r.plan - r.recibido);
			(r as any)[estadoGrupo(c.estado)] += 1;
			acc.set(c.proveedor, r);
		}
		// fill rate
		const out = Array.from(acc.values()).map((r) => ({
			...r,
			fillRate: r.plan === 0 ? 0 : Math.round((r.recibido / r.plan) * 100),
		}));
		return out;
	}, [base, modelo]);

	// búsqueda + top
	const [sortBy, setSortBy] = useState<SortKey>("plan");
	const [sortDir, setSortDir] = useState<SortDir>("desc");
	const toggleSort = (col: SortKey) => {
		if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortBy(col);
			setSortDir("desc");
		}
	};
	const sortIndicator = (col: SortKey) =>
		sortBy === col ? (sortDir === "asc" ? " ▲" : " ▼") : "";

	const filtered = useMemo(() => {
		const text = q.trim().toLowerCase();
		const f = !text
			? agregados
			: agregados.filter((r) => r.proveedor.toLowerCase().includes(text));
		// top por plan
		let arr = [...f];
		arr.sort((a, b) => b.plan - a.plan);
		if (top !== "Todos") {
			const n = Number(top);
			arr = arr.slice(0, n);
		}
		return arr;
	}, [agregados, q, top]);

	const sorted = useMemo(() => {
		const arr = [...filtered];
		arr.sort((a, b) => {
			let A: number | string, B: number | string;
			switch (sortBy) {
				case "proveedor":
					A = a.proveedor;
					B = b.proveedor;
					break;
				case "plan":
					A = a.plan;
					B = b.plan;
					break;
				case "recibido":
					A = a.recibido;
					B = b.recibido;
					break;
				case "saldo":
					A = a.saldo;
					B = b.saldo;
					break;
				case "fillRate":
					A = a.fillRate;
					B = b.fillRate;
					break;
				case "abiertos":
					A = a.abiertos;
					B = b.abiertos;
					break;
				case "vencidos":
					A = a.vencidos;
					B = b.vencidos;
					break;
				case "reprogramados":
					A = a.reprogramados;
					B = b.reprogramados;
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

	// KPIs globales
	const kpis = useMemo(() => {
		const plan = sorted.reduce((s, r) => s + r.plan, 0);
		const recv = sorted.reduce((s, r) => s + r.recibido, 0);
		const saldo = Math.max(0, plan - recv);
		const fill = plan === 0 ? 0 : Math.round((recv / plan) * 100);
		const venc = sorted.reduce((s, r) => s + r.vencidos, 0);
		const ab = sorted.reduce((s, r) => s + r.abiertos, 0);
		const rep = sorted.reduce((s, r) => s + r.reprogramados, 0);
		return { plan, recv, saldo, fill, venc, ab, rep };
	}, [sorted]);

	// CSV export
	function exportCSV() {
		const header = [
			"proveedor",
			"plan",
			"recibido",
			"saldo",
			"fillRate",
			"abiertos",
			"vencidos",
			"reprogramados",
			"cumplidos",
		];
		const rows = sorted.map((r) => [
			r.proveedor,
			r.plan,
			r.recibido,
			r.saldo,
			`${r.fillRate}%`,
			r.abiertos,
			r.vencidos,
			r.reprogramados,
			r.cumplidos,
		]);
		const csv = [header, ...rows]
			.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `proveedores_${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Proveedores</h1>
					<p className="text-sm text-muted-foreground">
						Resumen de desempeño por proveedor (plan, recepción, fill rate y
						estados).
					</p>
				</div>
				<Button variant="outline" onClick={exportCSV}>
					<Download className="w-4 h-4 mr-2" />
					Exportar CSV
				</Button>
			</div>

			{/* Filtros */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<Filter className="w-4 h-4" /> Filtros
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3 overflow-visible">
					<Input
						placeholder="Buscar proveedor"
						value={q}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setQ(e.target.value)
						}
					/>

					<Select value={top} onValueChange={(v) => setTop(v as typeof top)}>
						<SelectTrigger>
							<SelectValue placeholder="Top N" />
						</SelectTrigger>
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{(["Todos", "5", "10", "20"] as const).map((t) => (
								<SelectItem key={t} value={t}>
									{t === "Todos" ? "Todos" : `Top ${t}`}
								</SelectItem>
							))}
						</SelectContent></SelectPortal>
					</Select>

					<Select
						value={modelo}
						onValueChange={(v) => setModelo(v as typeof modelo)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Modelo" />
						</SelectTrigger>
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{(["Todos", "ALFA", "TIF", "HIBRIDO", "MAQUILA"] as const).map(
								(m) => (
									<SelectItem key={m} value={m}>
										{m}
									</SelectItem>
								)
							)}
						</SelectContent></SelectPortal>
					</Select>
				</CardContent>
			</Card>

			{/* KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Plan</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{kpis.plan.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Recepcionado</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{kpis.recv.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Saldo</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{kpis.saldo.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Fill Rate</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">{kpis.fill}%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Estados</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="flex flex-wrap gap-2 text-sm">
							<Badge className="bg-blue-100 text-blue-800">
								Abiertos {kpis.ab}
							</Badge>
							<Badge className="bg-red-100 text-red-800">
								Vencidos {kpis.venc}
							</Badge>
							<Badge className="bg-amber-100 text-amber-800">
								Reprog. {kpis.rep}
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabla por proveedor */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Listado ({sorted.length})</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("proveedor")}
									>
										Proveedor{sortIndicator("proveedor")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("plan")}
									>
										Plan{sortIndicator("plan")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("recibido")}
									>
										Recepcionado{sortIndicator("recibido")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("saldo")}
									>
										Saldo{sortIndicator("saldo")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("fillRate")}
									>
										Fill Rate{sortIndicator("fillRate")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("abiertos")}
									>
										Abiertos{sortIndicator("abiertos")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("vencidos")}
									>
										Vencidos{sortIndicator("vencidos")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("reprogramados")}
									>
										Reprog.{sortIndicator("reprogramados")}
									</button>
								</TableHead>
								<TableHead className="text-right">Cumplidos</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sorted.map((r) => (
								<TableRow key={r.proveedor} className="hover:bg-muted/50">
									<TableCell>{r.proveedor}</TableCell>
									<TableCell className="text-right">
										{r.plan.toLocaleString("es-CL")}
									</TableCell>
									<TableCell className="text-right">
										{r.recibido.toLocaleString("es-CL")}
									</TableCell>
									<TableCell className="text-right">
										{r.saldo.toLocaleString("es-CL")}
									</TableCell>
									<TableCell className="text-right">{r.fillRate}%</TableCell>
									<TableCell className="text-right">{r.abiertos}</TableCell>
									<TableCell className="text-right">{r.vencidos}</TableCell>
									<TableCell className="text-right">
										{r.reprogramados}
									</TableCell>
									<TableCell className="text-right">{r.cumplidos}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell className="font-medium">Totales</TableCell>
								<TableCell className="text-right font-semibold">
									{sorted
										.reduce((s, r) => s + r.plan, 0)
										.toLocaleString("es-CL")}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{sorted
										.reduce((s, r) => s + r.recibido, 0)
										.toLocaleString("es-CL")}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{sorted
										.reduce((s, r) => s + r.saldo, 0)
										.toLocaleString("es-CL")}
								</TableCell>
								<TableCell />
								<TableCell className="text-right font-semibold">
									{sorted.reduce((s, r) => s + r.abiertos, 0)}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{sorted.reduce((s, r) => s + r.vencidos, 0)}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{sorted.reduce((s, r) => s + r.reprogramados, 0)}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{sorted.reduce((s, r) => s + r.cumplidos, 0)}
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Tip: usa “Top N” para enfocar a proveedores con mayor plan y detectar
				riesgos (vencidos/reprog.).
			</div>
		</div>
	);
}
