import FormMetaInfo from "@/components/shared/FormMetaInfo";
import { Portal as SelectPortal } from "@radix-ui/react-select";
// src/pages/Alertas.tsx
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
import { AlertTriangle, Filter, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
	compromisosSeed,
	proveedoresUnicos,
	semanasUnicas,
	Modelo,
	EstadoCompromiso,
	avancePct,
	saldo as calcSaldo,
	diasAtraso,
} from "@/modules/compromisos/data";

// ---- Tipos ----
type AlertaTipo = "VENCIDO" | "LOW_FILL" | "REPROGRAMADO";
type Severidad = "ALTA" | "MEDIA" | "BAJA";

type Row = {
	id: string;
	tipo: AlertaTipo;
	severidad: Severidad;
	oc: string;
	linea: string;
	proveedor: string;
	modelo: Modelo;
	fecha: string; // YYYY-MM-DD
	semana: string; // YYYY-Wxx
	avance: number; // 0..100
	saldo: number; // unidades pendientes
	diasAtraso: number; // si aplica
	estado: EstadoCompromiso;
};

// ---- Helpers ----
function sevBadgeClass(s: Severidad) {
	switch (s) {
		case "ALTA":
			return "bg-red-100 text-red-800";
		case "MEDIA":
			return "bg-amber-100 text-amber-800";
		case "BAJA":
			return "bg-blue-100 text-blue-800";
	}
}

function estadoBadge(estado: EstadoCompromiso) {
	const map: Record<EstadoCompromiso, string> = {
		PENDIENTE: "bg-yellow-100 text-yellow-800",
		CONFIRMADO: "bg-blue-100 text-blue-800",
		REPROGRAMADO: "bg-amber-100 text-amber-800",
		VENCIDO: "bg-red-100 text-red-800",
		CUMPLIDO: "bg-emerald-100 text-emerald-800",
		CANCELADO: "bg-slate-100 text-slate-800",
	};
	return map[estado];
}

// ---- Componente ----
export default function Alertas() {
	// Reglas parametrizables
	const [diasVencido, setDiasVencido] = useState<number>(2); // Vencido > X días
	const [fillMin, setFillMin] = useState<number>(80); // Fill rate < Y%
	const [reprogMin, setReprogMin] = useState<number>(1); // Reprogramado >= N veces (simulado: estado REPROGRAMADO cuenta como 1)

	// Filtros
	const [q, setQ] = useState<string>("");
	const [proveedor, setProveedor] = useState<string>("Todos");
	const [modelo, setModelo] = useState<"Todos" | Modelo>("Todos");
	const [semana, setSemana] = useState<"Todas" | string>("Todas");
	const proveedores = useMemo(
		() => ["Todos", ...proveedoresUnicos(compromisosSeed)],
		[]
	);
	const semanas = useMemo(
		() => ["Todas", ...semanasUnicas(compromisosSeed)],
		[]
	);

	// Generar alertas desde compromisos
	const base: Row[] = useMemo(() => {
		const out: Row[] = [];
		for (const c of compromisosSeed) {
			// ignoro cumplidos/cancelados para ciertas reglas
			const avance = avancePct(c.cantidad, c.cantidad_recibida);
			const sd = calcSaldo(c.cantidad, c.cantidad_recibida);
			const atraso = c.estado === "VENCIDO" ? diasAtraso(c.fecha) : 0;

			// 1) VENCIDO > X días
			if (c.estado === "VENCIDO" && atraso > diasVencido) {
				const severidad: Severidad =
					atraso > diasVencido + 3 ? "ALTA" : "MEDIA";
				out.push({
					id: `${c.id}-v`,
					tipo: "VENCIDO",
					severidad,
					oc: c.oc,
					linea: c.linea,
					proveedor: c.proveedor,
					modelo: c.modelo,
					fecha: c.fecha,
					semana: c.semana,
					avance,
					saldo: sd,
					diasAtraso: atraso,
					estado: c.estado,
				});
			}

			// 2) Fill rate bajo (< Y%) con saldo pendiente (no mostrar si CUMPLIDO/CANCELADO)
			if (
				c.estado !== "CUMPLIDO" &&
				c.estado !== "CANCELADO" &&
				avance < fillMin &&
				sd > 0
			) {
				const gap = fillMin - avance;
				const severidad: Severidad =
					gap >= 20 ? "ALTA" : gap >= 10 ? "MEDIA" : "BAJA";
				out.push({
					id: `${c.id}-f`,
					tipo: "LOW_FILL",
					severidad,
					oc: c.oc,
					linea: c.linea,
					proveedor: c.proveedor,
					modelo: c.modelo,
					fecha: c.fecha,
					semana: c.semana,
					avance,
					saldo: sd,
					diasAtraso: atraso,
					estado: c.estado,
				});
			}

			// 3) Reprogramado N veces (simulación: estado REPROGRAMADO = 1 vez)
			if (c.estado === "REPROGRAMADO" && 1 >= reprogMin) {
				const severidad: Severidad = reprogMin >= 2 ? "MEDIA" : "BAJA";
				out.push({
					id: `${c.id}-r`,
					tipo: "REPROGRAMADO",
					severidad,
					oc: c.oc,
					linea: c.linea,
					proveedor: c.proveedor,
					modelo: c.modelo,
					fecha: c.fecha,
					semana: c.semana,
					avance,
					saldo: sd,
					diasAtraso: atraso,
					estado: c.estado,
				});
			}
		}
		return out;
	}, [diasVencido, fillMin, reprogMin]);

	// Filtro UI
	const filtered = useMemo(() => {
		const text = q.trim().toLowerCase();
		return base.filter((r) => {
			const hitText =
				!text ||
				`${r.oc} ${r.linea} ${r.proveedor}`.toLowerCase().includes(text);
			const hitProv = proveedor === "Todos" ? true : r.proveedor === proveedor;
			const hitModelo = modelo === "Todos" ? true : r.modelo === modelo;
			const hitSemana = semana === "Todas" ? true : r.semana === semana;
			return hitText && hitProv && hitModelo && hitSemana;
		});
	}, [base, q, proveedor, modelo, semana]);

	// Totales por tipo / severidad
	const totals = useMemo(() => {
		const total = filtered.length;
		const porTipo = filtered.reduce<Record<AlertaTipo, number>>((acc, r) => {
			acc[r.tipo] = (acc[r.tipo] ?? 0) + 1;
			return acc;
		}, {} as any);
		const porSev = filtered.reduce<Record<Severidad, number>>((acc, r) => {
			acc[r.severidad] = (acc[r.severidad] ?? 0) + 1;
			return acc;
		}, {} as any);
		return { total, porTipo, porSev };
	}, [filtered]);

	// Export CSV
	function exportCSV() {
		const header = [
			"tipo",
			"severidad",
			"oc",
			"linea",
			"proveedor",
			"modelo",
			"fecha",
			"semana",
			"avance",
			"saldo",
			"diasAtraso",
			"estado",
		];
		const rows = filtered.map((r) => [
			r.tipo,
			r.severidad,
			r.oc,
			r.linea,
			r.proveedor,
			r.modelo,
			r.fecha,
			r.semana,
			`${r.avance}%`,
			r.saldo,
			r.diasAtraso,
			r.estado,
		]);
		const csv = [header, ...rows]
			.map((row) =>
				row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
			)
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `alertas_${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Alertas operativas</h1>
					<p className="text-sm text-muted-foreground">
						Reglas en memoria con filtros y links al detalle.
					</p>
				</div>
				<Button variant="outline" onClick={exportCSV}>
					<Download className="w-4 h-4 mr-2" />
					Exportar CSV
				</Button>
			</div>

			{/* Reglas (parámetros) */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<AlertTriangle className="w-4 h-4" /> Reglas
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-visible">
					<div>
						<div className="text-xs text-muted-foreground mb-1">
							Vencido &gt; X días
						</div>
						<Input
							type="number"
							min={0}
							value={diasVencido}
							onChange={(e) => setDiasVencido(Number(e.target.value) || 0)}
						/>
					</div>
					<div>
						<div className="text-xs text-muted-foreground mb-1">
							Fill Rate mínimo (%)
						</div>
						<Input
							type="number"
							min={0}
							max={100}
							value={fillMin}
							onChange={(e) =>
								setFillMin(
									Math.max(0, Math.min(100, Number(e.target.value) || 0))
								)
							}
						/>
					</div>
					<div>
						<div className="text-xs text-muted-foreground mb-1">
							Reprogramado ≥ N
						</div>
						<Input
							type="number"
							min={1}
							value={reprogMin}
							onChange={(e) => setReprogMin(Number(e.target.value) || 1)}
						/>
					</div>

					{/* Filtros UI */}
					<div>
						<div className="text-xs text-muted-foreground mb-1">Proveedor</div>
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
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<div className="text-xs text-muted-foreground mb-1">Modelo</div>
							<Select value={modelo} onValueChange={(v) => setModelo(v as any)}>
								<SelectTrigger>
									<SelectValue placeholder="Modelo" />
								</SelectTrigger>
								<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
									{(
										["Todos", "ALFA", "TIF", "HIBRIDO", "MAQUILA"] as const
									).map((m) => (
										<SelectItem key={m} value={m}>
											{m}
										</SelectItem>
									))}
								</SelectContent></SelectPortal>
							</Select>
						</div>
						<div>
							<div className="text-xs text-muted-foreground mb-1">Semana</div>
							<Select value={semana} onValueChange={(v) => setSemana(v as any)}>
								<SelectTrigger>
									<SelectValue placeholder="Semana" />
								</SelectTrigger>
								<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
									{semanas.map((w) => (
										<SelectItem key={w} value={w}>
											{w}
										</SelectItem>
									))}
								</SelectContent></SelectPortal>
							</Select>
						</div>
					</div>

					<div className="md:col-span-5">
						<Input
							placeholder="Buscar por OC / línea / proveedor"
							value={q}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setQ(e.target.value)
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* KPIs de alertas */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Total alertas</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">{totals.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Por tipo</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2 text-sm overflow-visible">
						<Badge variant="outline">
							Vencido: {totals.porTipo.VENCIDO ?? 0}
						</Badge>
						<Badge variant="outline">
							Bajo Fill: {totals.porTipo.LOW_FILL ?? 0}
						</Badge>
						<Badge variant="outline">
							Reprog.: {totals.porTipo.REPROGRAMADO ?? 0}
						</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Severidad</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2 text-sm overflow-visible">
						<Badge className={sevBadgeClass("ALTA")}>
							Alta: {totals.porSev.ALTA ?? 0}
						</Badge>
						<Badge className={sevBadgeClass("MEDIA")}>
							Media: {totals.porSev.MEDIA ?? 0}
						</Badge>
						<Badge className={sevBadgeClass("BAJA")}>
							Baja: {totals.porSev.BAJA ?? 0}
						</Badge>
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
				<CardContent className="overflow-visible"><Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tipo</TableHead>
								<TableHead>Severidad</TableHead>
								<TableHead>OC</TableHead>
								<TableHead>Línea</TableHead>
								<TableHead>Proveedor</TableHead>
								<TableHead>Modelo</TableHead>
								<TableHead>Fecha</TableHead>
								<TableHead>Semana</TableHead>
								<TableHead className="text-right">% Avance</TableHead>
								<TableHead className="text-right">Saldo</TableHead>
								<TableHead className="text-right">Días atraso</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Acción</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((r) => (
								<TableRow key={r.id} className="hover:bg-muted/50">
									<TableCell>
										<Badge variant="outline">
											{r.tipo === "VENCIDO"
												? "Vencido"
												: r.tipo === "LOW_FILL"
												? "Bajo Fill"
												: "Reprogramado"}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge className={sevBadgeClass(r.severidad)}>
											{r.severidad}
										</Badge>
									</TableCell>
									<TableCell>{r.oc}</TableCell>
									<TableCell>{r.linea}</TableCell>
									<TableCell>{r.proveedor}</TableCell>
									<TableCell>
										<Badge variant="outline">{r.modelo}</Badge>
									</TableCell>
									<TableCell>{r.fecha}</TableCell>
									<TableCell>{r.semana}</TableCell>
									<TableCell className="text-right">{r.avance}%</TableCell>
									<TableCell className="text-right">
										{r.saldo.toLocaleString("es-CL")}
									</TableCell>
									<TableCell className="text-right">{r.diasAtraso}</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded text-xs ${estadoBadge(
												r.estado
											)}`}
										>
											{r.estado}
										</span>
									</TableCell>
									<TableCell>
										<Link
											className="inline-flex items-center text-blue-600 underline"
											to={`/compromisos?q=${encodeURIComponent(
												r.oc
											)}&proveedor=${encodeURIComponent(r.proveedor)}`}
										>
											Ver detalle <ArrowRight className="w-4 h-4 ml-1" />
										</Link>
									</TableCell>
								</TableRow>
							))}
							{filtered.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={13}
										className="text-sm text-muted-foreground"
									>
										Sin alertas según los parámetros actuales.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell
									colSpan={13}
									className="text-sm text-muted-foreground"
								>
									Mostrando {filtered.length} alerta(s)
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Tip: sube el fill mínimo para detectar compromisos con recepción lenta;
				baja “Vencido &gt; X” para ver riesgos tempranos.
			</div>
		</div>
	);
}
