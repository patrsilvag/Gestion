// src/pages/Documentos.tsx
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
import { FileText, Filter, Download } from "lucide-react";

import {
	documentosSeed,
	compromisosSeed,
	proveedoresUnicos,
} from "@/modules/compromisos/data";

type TipoDoc = "Todos" | "GUIA" | "NC" | "EVIDENCIA";
type EstadoDoc = "Todos" | "VALIDO" | "OBSERVADO" | "RECHAZADO";
type SortKey =
	| "tipo"
	| "oc"
	| "linea"
	| "proveedor"
	| "folio"
	| "fecha"
	| "estado";
type SortDir = "asc" | "desc";

type Row = {
	id: string;
	tipo: "GUIA" | "NC" | "EVIDENCIA";
	oc?: string;
	linea?: string;
	proveedor?: string;
	folio?: string;
	fecha?: string; // YYYY-MM-DD
	estado?: "VALIDO" | "OBSERVADO" | "RECHAZADO";
	url?: string;
};

function estadoClase(e?: Row["estado"]) {
	switch (e) {
		case "VALIDO":
			return "bg-emerald-100 text-emerald-800";
		case "OBSERVADO":
			return "bg-amber-100 text-amber-800";
		case "RECHAZADO":
			return "bg-red-100 text-red-800";
		default:
			return "bg-slate-100 text-slate-800";
	}
}

export default function Documentos() {
	const base: Row[] = documentosSeed;

	// Filtros
	const [q, setQ] = useState<string>("");
	const [tipo, setTipo] = useState<TipoDoc>("Todos");
	const [estado, setEstado] = useState<EstadoDoc>("Todos");
	const [proveedor, setProveedor] = useState<string>("Todos");
	const [desde, setDesde] = useState<string>("");
	const [hasta, setHasta] = useState<string>("");

	const proveedores = useMemo(
		() => ["Todos", ...proveedoresUnicos(compromisosSeed)],
		[]
	);

	// Orden
	const [sortBy, setSortBy] = useState<SortKey>("fecha");
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
		return base.filter((d: Row) => {
			const hitText =
				!text ||
				`${d.tipo} ${d.oc ?? ""} ${d.folio ?? ""} ${d.proveedor ?? ""}`
					.toLowerCase()
					.includes(text);
			const hitTipo = tipo === "Todos" ? true : d.tipo === tipo;
			const hitEstado = estado === "Todos" ? true : d.estado === estado;
			const hitProv = proveedor === "Todos" ? true : d.proveedor === proveedor;
			const f = d.fecha ?? ""; // YYYY-MM-DD
			const hitDesde = !desde || f >= desde;
			const hitHasta = !hasta || f <= hasta;
			return hitText && hitTipo && hitEstado && hitProv && hitDesde && hitHasta;
		});
	}, [base, q, tipo, estado, proveedor, desde, hasta]);

	// Orden
	const sorted = useMemo(() => {
		const arr = [...filtered];
		arr.sort((a: Row, b: Row) => {
			let A: number | string, B: number | string;
			switch (sortBy) {
				case "fecha":
					A = a.fecha ?? "";
					B = b.fecha ?? "";
					break;
				case "tipo":
					A = a.tipo;
					B = b.tipo;
					break;
				case "oc":
					A = a.oc ?? "";
					B = b.oc ?? "";
					break;
				case "linea":
					A = a.linea ?? "";
					B = b.linea ?? "";
					break;
				case "proveedor":
					A = a.proveedor ?? "";
					B = b.proveedor ?? "";
					break;
				case "folio":
					A = a.folio ?? "";
					B = b.folio ?? "";
					break;
				case "estado":
					A = a.estado ?? "";
					B = b.estado ?? "";
					break;
				default:
					A = "";
					B = "";
			}
			const s = A === B ? 0 : A > B ? 1 : -1;
			return sortDir === "asc" ? s : -s;
		});
		return arr;
	}, [filtered, sortBy, sortDir]);

	// Totales por tipo/estado
	const totals = useMemo(() => {
		const total = sorted.length;
		const porTipo = sorted.reduce<Record<string, number>>((acc, r) => {
			acc[r.tipo] = (acc[r.tipo] ?? 0) + 1;
			return acc;
		}, {});
		const porEstado = sorted.reduce<Record<string, number>>((acc, r) => {
			const k = r.estado ?? "SIN_ESTADO";
			acc[k] = (acc[k] ?? 0) + 1;
			return acc;
		}, {});
		return { total, porTipo, porEstado };
	}, [sorted]);

	// Exportar CSV (filtrado actual)
	function exportCSV() {
		const header = [
			"tipo",
			"oc",
			"linea",
			"proveedor",
			"folio",
			"fecha",
			"estado",
			"url",
		];
		const rows = sorted.map((d) => [
			d.tipo,
			d.oc ?? "",
			d.linea ?? "",
			d.proveedor ?? "",
			d.folio ?? "",
			d.fecha ?? "",
			d.estado ?? "",
			d.url ?? "",
		]);
		const csv = [header, ...rows]
			.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `documentos_${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Documentos</h1>
					<p className="text-sm text-muted-foreground">
						Gestión de documentos (Guías, NC, Evidencias) con filtros y
						exportación — datos en memoria.
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
						placeholder="Buscar por OC / Folio / Proveedor"
						value={q}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setQ(e.target.value)
						}
					/>

					<Select value={tipo} onValueChange={(v) => setTipo(v as TipoDoc)}>
						<SelectTrigger>
							<SelectValue placeholder="Tipo" />
						</SelectTrigger>
						<SelectContent>
							{(["Todos", "GUIA", "NC", "EVIDENCIA"] as const).map((t) => (
								<SelectItem key={t} value={t}>
									{t}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={estado}
						onValueChange={(v) => setEstado(v as EstadoDoc)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent>
							{(["Todos", "VALIDO", "OBSERVADO", "RECHAZADO"] as const).map(
								(e) => (
									<SelectItem key={e} value={e}>
										{e}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>

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
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Total</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totals.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Por Tipo</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{Object.entries(totals.porTipo).map(([k, v]) => (
							<Badge key={k} variant="outline">
								{k}: {v}
							</Badge>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Por Estado</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{Object.entries(totals.porEstado).map(([k, v]) => (
							<Badge key={k} className={estadoClase(k as Row["estado"])}>
								{k}: {v}
							</Badge>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Tabla */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<FileText className="w-4 h-4" /> Listado ({sorted.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("tipo")}
									>
										Tipo{sortIndicator("tipo")}
									</button>
								</TableHead>
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
										onClick={() => toggleSort("folio")}
									>
										Folio{sortIndicator("folio")}
									</button>
								</TableHead>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("fecha")}
									>
										Fecha{sortIndicator("fecha")}
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
								<TableHead>URL</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sorted.map((d: Row) => (
								<TableRow key={d.id} className="hover:bg-muted/50">
									<TableCell>
										<Badge variant="outline">{d.tipo}</Badge>
									</TableCell>
									<TableCell>{d.oc ?? "—"}</TableCell>
									<TableCell>{d.linea ?? "—"}</TableCell>
									<TableCell>{d.proveedor ?? "—"}</TableCell>
									<TableCell>{d.folio ?? "—"}</TableCell>
									<TableCell>{d.fecha ?? "—"}</TableCell>
									<TableCell>
										<Badge className={estadoClase(d.estado)}>
											{d.estado ?? "—"}
										</Badge>
									</TableCell>
									<TableCell>
										{d.url ? (
											<a
												className="text-blue-600 underline"
												href={d.url}
												target="_blank"
											>
												Abrir
											</a>
										) : (
											"—"
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell
									colSpan={8}
									className="text-sm text-muted-foreground"
								>
									Mostrando {sorted.length} documento(s)
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Tip: usa los rangos de fecha + tipo para controlar periodos de recepción
				y NC.
			</div>
		</div>
	);
}
