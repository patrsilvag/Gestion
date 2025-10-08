import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Filter, Download, Truck } from "lucide-react";

import {
	recepcionesSeed,
	compromisosSeed,
	proveedoresUnicos,
} from "@/modules/compromisos/data";

// Tipos locales (sin genéricos en JSX)
type CalidadEstado = "CONFORME" | "NO_CONFORME";
type Row = {
	id: string;
	guia: string;
	fecha: string; // ISO
	cantidad: number;
	calidad: CalidadEstado;
	compromiso_id: string;
	oc: string;
	linea: string;
	proveedor: string;
};

function calidadBadgeClass(c: CalidadEstado) {
	return c === "CONFORME"
		? "bg-emerald-100 text-emerald-800"
		: "bg-red-100 text-red-800";
}

export default function ReceptionQualityCheck() {
	// Derivamos rows uniendo recepciones con sus compromisos
	const base: Row[] = useMemo(() => {
		const mapComp = new Map(compromisosSeed.map((c) => [c.id, c]));
		return recepcionesSeed.map((r) => {
			const c = mapComp.get(r.compromiso_id);
			return {
				id: r.id,
				guia: r.guia,
				fecha: r.fecha,
				cantidad: r.cantidad,
				calidad: r.calidad,
				compromiso_id: r.compromiso_id,
				oc: c?.oc ?? "—",
				linea: c?.linea ?? "—",
				proveedor: c?.proveedor ?? "—",
			};
		});
	}, []);

	// Filtros
	const [q, setQ] = useState<string>("");
	const [proveedor, setProveedor] = useState<string>("Todos");
	const [calidad, setCalidad] = useState<"Todas" | CalidadEstado>("Todas");
	const [desde, setDesde] = useState<string>("");
	const [hasta, setHasta] = useState<string>("");

	const proveedores = useMemo(
		() => ["Todos", ...proveedoresUnicos(compromisosSeed)],
		[]
	);

	// Filtrado
	const filtered = useMemo(() => {
		const text = q.trim().toLowerCase();
		return base.filter((r) => {
			const hitText =
				!text ||
				`${r.guia} ${r.oc} ${r.linea} ${r.proveedor}`
					.toLowerCase()
					.includes(text);
			const hitProv = proveedor === "Todos" ? true : r.proveedor === proveedor;
			const hitCal = calidad === "Todas" ? true : r.calidad === calidad;
			const f = r.fecha.slice(0, 10); // YYYY-MM-DD
			const hitDesde = !desde || f >= desde;
			const hitHasta = !hasta || f <= hasta;
			return hitText && hitProv && hitCal && hitDesde && hitHasta;
		});
	}, [base, q, proveedor, calidad, desde, hasta]);

	// KPIs
	const kpis = useMemo(() => {
		const total = filtered.length;
		const conforme = filtered.filter((r) => r.calidad === "CONFORME").length;
		const noConforme = total - conforme;
		const qtyTotal = filtered.reduce((s, r) => s + r.cantidad, 0);
		const pctConforme = total === 0 ? 0 : Math.round((conforme / total) * 100);
		return { total, conforme, noConforme, qtyTotal, pctConforme };
	}, [filtered]);

	// Export CSV (sin tipados en attrs JSX)
	function exportCSV(): void {
		const header = [
			"guia",
			"fecha",
			"oc",
			"linea",
			"proveedor",
			"cantidad",
			"calidad",
			"compromiso_id",
		];
		const rows = filtered.map((r) => [
			r.guia,
			r.fecha,
			r.oc,
			r.linea,
			r.proveedor,
			String(r.cantidad),
			r.calidad,
			r.compromiso_id,
		]);
		const csv = [header, ...rows]
			.map((row) =>
				row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
			)
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `recepciones_${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">
						Control de Calidad — Recepciones
					</h1>
					<p className="text-sm text-muted-foreground">
						Revisión de guías recepcionadas y estado de calidad (datos en
						memoria).
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
				<CardContent className="grid grid-cols-1 md:grid-cols-6 gap-3">
					<Input
						placeholder="Buscar por Guía / OC / Proveedor"
						value={q}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setQ(e.target.value)
						}
					/>

					<Select value={proveedor} onValueChange={(v) => setProveedor(v)}>
						<SelectTrigger>
							<SelectValue placeholder="Proveedor" />
						</SelectTrigger>
						<SelectContent>
							{proveedores.map((p) => (
								<SelectItem key={p} value={p}>
									{p}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={calidad} onValueChange={(v) => setCalidad(v as any)}>
						<SelectTrigger>
							<SelectValue placeholder="Calidad" />
						</SelectTrigger>
						<SelectContent>
							{(["Todas", "CONFORME", "NO_CONFORME"] as const).map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
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

					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Truck className="w-4 h-4" /> Recepciones: {filtered.length}
					</div>
				</CardContent>
			</Card>

			{/* KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Total guías</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{kpis.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Conforme</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{kpis.conforme}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">No conforme</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{kpis.noConforme}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Cantidad total</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{kpis.qtyTotal.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabla */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">
						Listado ({filtered.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Guía</TableHead>
								<TableHead>OC</TableHead>
								<TableHead>Línea</TableHead>
								<TableHead>Proveedor</TableHead>
								<TableHead>Fecha</TableHead>
								<TableHead className="text-right">Cantidad</TableHead>
								<TableHead>Calidad</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((r) => (
								<TableRow key={r.id} className="hover:bg-muted/50">
									<TableCell>{r.guia}</TableCell>
									<TableCell>{r.oc}</TableCell>
									<TableCell>{r.linea}</TableCell>
									<TableCell>{r.proveedor}</TableCell>
									<TableCell>
										{r.fecha.replace("T", " ").slice(0, 16)}
									</TableCell>
									<TableCell className="text-right">
										{r.cantidad.toLocaleString("es-CL")}
									</TableCell>
									<TableCell>
										<Badge className={calidadBadgeClass(r.calidad)}>
											{r.calidad === "CONFORME" ? "Conforme" : "No Conforme"}
										</Badge>
									</TableCell>
								</TableRow>
							))}
							{filtered.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={7}
										className="text-sm text-muted-foreground"
									>
										Sin resultados según los filtros actuales.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-sm text-muted-foreground"
								>
									Mostrando {filtered.length} recepción(es)
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Tip: usa el filtro de fechas para auditorías de periodo.
			</div>
		</div>
	);
}
