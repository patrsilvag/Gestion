import { Portal as SelectPortal } from "@radix-ui/react-select";
// src/pages/Recepciones.tsx
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
import { Truck, Filter } from "lucide-react";

import {
	recepcionesSeed,
	compromisosSeed,
	proveedoresUnicos,
} from "@/modules/compromisos/data";

type Calidad = "Todos" | "CONFORME" | "NO_CONFORME";
type SortKey = "fecha" | "guia" | "cantidad" | "calidad" | "proveedor" | "oc";
type SortDir = "asc" | "desc";

type Row = {
	id: string;
	guia: string;
	fecha: string; // ISO
	cantidad: number;
	calidad: "CONFORME" | "NO_CONFORME";
	compromiso_id: string;
	oc: string;
	linea: string;
	proveedor: string;
};

function calidadBadgeClass(calidad: Row["calidad"]) {
	return calidad === "CONFORME"
		? "bg-emerald-100 text-emerald-800"
		: "bg-red-100 text-red-800";
}

export default function Recepciones() {
	// Join para mostrar proveedor/oc/linea
	const compromisosById = useMemo(() => {
		const m = new Map<
			string,
			{ oc: string; linea: string; proveedor: string }
		>();
		for (const c of compromisosSeed)
			m.set(c.id, { oc: c.oc, linea: c.linea, proveedor: c.proveedor });
		return m;
	}, []);

	const base: Row[] = useMemo(() => {
		return recepcionesSeed.map((r) => {
			const c = compromisosById.get(r.compromiso_id);
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
	}, [compromisosById]);

	// Filtros
	const [q, setQ] = useState<string>("");
	const [proveedor, setProveedor] = useState<string>("Todos");
	const [calidad, setCalidad] = useState<Calidad>("Todos");
	const [desde, setDesde] = useState<string>(""); // YYYY-MM-DD
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

	const filtered = useMemo(() => {
		const text = q.trim().toLowerCase();
		return base.filter((r: Row) => {
			const hitText =
				!text ||
				`${r.guia} ${r.oc} ${r.proveedor}`.toLowerCase().includes(text);
			const hitProv = proveedor === "Todos" ? true : r.proveedor === proveedor;
			const hitCal = calidad === "Todos" ? true : r.calidad === calidad;
			const d = r.fecha.slice(0, 10);
			const hitDesde = !desde || d >= desde;
			const hitHasta = !hasta || d <= hasta;
			return hitText && hitProv && hitCal && hitDesde && hitHasta;
		});
	}, [base, q, proveedor, calidad, desde, hasta]);

	const sorted = useMemo(() => {
		const arr = [...filtered];
		arr.sort((a: Row, b: Row) => {
			let A: number | string, B: number | string;
			switch (sortBy) {
				case "fecha":
					A = new Date(a.fecha).getTime();
					B = new Date(b.fecha).getTime();
					break;
				case "cantidad":
					A = a.cantidad;
					B = b.cantidad;
					break;
				case "guia":
					A = a.guia;
					B = b.guia;
					break;
				case "calidad":
					A = a.calidad;
					B = b.calidad;
					break;
				case "proveedor":
					A = a.proveedor;
					B = b.proveedor;
					break;
				case "oc":
					A = a.oc;
					B = b.oc;
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

	const totals = useMemo(() => {
		const total = sorted.reduce((s: number, r: Row) => s + r.cantidad, 0);
		const conformes = sorted
			.filter((r) => r.calidad === "CONFORME")
			.reduce((s, r) => s + r.cantidad, 0);
		const noConformes = total - conformes;
		return { total, conformes, noConformes };
	}, [sorted]);

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Recepciones</h1>
				<p className="text-sm text-muted-foreground">
					Listado de recepciones con filtros, totales y estado de calidad.
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
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{proveedores.map((p) => (
								<SelectItem key={p} value={p}>
									{p}
								</SelectItem>
							))}
						</SelectContent></SelectPortal>
					</Select>

					<Select
						value={calidad}
						onValueChange={(v) => setCalidad(v as Calidad)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Calidad" />
						</SelectTrigger>
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{(["Todos", "CONFORME", "NO_CONFORME"] as const).map((c) => (
								<SelectItem key={c} value={c}>
									{c}
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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Cantidad total</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{totals.total.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Conforme</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{totals.conformes.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">No Conforme</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{totals.noConformes.toLocaleString("es-CL")}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabla */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<Truck className="w-4 h-4" /> Listado ({sorted.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("guia")}
									>
										Guía{sortIndicator("guia")}
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
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("cantidad")}
									>
										Cantidad{sortIndicator("cantidad")}
									</button>
								</TableHead>
								<TableHead>
									<button
										className="underline"
										onClick={() => toggleSort("calidad")}
									>
										Calidad{sortIndicator("calidad")}
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
							</TableRow>
						</TableHeader>
						<TableBody>
							{sorted.map((r) => (
								<TableRow key={r.id} className="hover:bg-muted/50">
									<TableCell>{r.guia}</TableCell>
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
									<TableCell>{r.oc}</TableCell>
									<TableCell>{r.linea}</TableCell>
									<TableCell>{r.proveedor}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={2} className="font-medium">
									Totales
								</TableCell>
								<TableCell className="text-right font-semibold">
									{totals.total.toLocaleString("es-CL")}
								</TableCell>
								<TableCell colSpan={4} />
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Tip: puedes cambiar el rango de fechas para ver la evolución por
				semana/mes (todo en memoria).
			</div>
		</div>
	);
}
