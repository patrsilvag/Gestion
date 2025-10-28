import FormMetaInfo from "@/components/shared/FormMetaInfo";
// src/pages/Dashboard.tsx
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import {
	compromisosSeed,
	recepcionesSeed,
	documentosSeed,
	zcSeed,
	EstadoCompromiso,
	weekOrder,
} from "@/modules/compromisos/data";
import { Package, Truck, FileText, AlertCircle, Gauge } from "lucide-react";

// ---------- Helpers ----------
const fmt = new Intl.NumberFormat("es-CL");

function kpis(compromisos = compromisosSeed) {
	const consider = compromisos.filter((c) => !c.excluye_kpi);
	const plan = consider.reduce((s, c) => s + c.cantidad, 0);
	const recv = consider.reduce((s, c) => s + c.cantidad_recibida, 0);
	const fill = plan === 0 ? 0 : Math.round((recv / plan) * 100);
	const byEstado = consider.reduce<Record<EstadoCompromiso, number>>(
		(acc, c) => {
			acc[c.estado] = (acc[c.estado] ?? 0) + 1;
			return acc;
		},
		{} as any
	);
	return { plan, recv, fill, byEstado };
}

function weeklySeries() {
	const map: Record<string, { semana: string; plan: number; recv: number }> =
		{};
	compromisosSeed.forEach((c) => {
		if (!map[c.semana]) map[c.semana] = { semana: c.semana, plan: 0, recv: 0 };
		map[c.semana].plan += c.cantidad;
		map[c.semana].recv += c.cantidad_recibida;
	});
	return Object.values(map).sort(
		(a, b) => weekOrder(a.semana) - weekOrder(b.semana)
	);
}

function topProveedores(limit = 5) {
	const acc = new Map<
		string,
		{ proveedor: string; plan: number; recv: number }
	>();
	for (const c of compromisosSeed) {
		const r = acc.get(c.proveedor) ?? {
			proveedor: c.proveedor,
			plan: 0,
			recv: 0,
		};
		r.plan += c.cantidad;
		r.recv += c.cantidad_recibida;
		acc.set(c.proveedor, r);
	}
	return Array.from(acc.values())
		.sort((a, b) => b.plan - a.plan)
		.slice(0, limit)
		.map((r) => ({
			...r,
			fill: r.plan === 0 ? 0 : Math.round((r.recv / r.plan) * 100),
		}));
}

const ESTADO_COLORS: Record<EstadoCompromiso, string> = {
	PENDIENTE: "#F59E0B", // amber-500
	CONFIRMADO: "#3B82F6", // blue-500
	REPROGRAMADO: "#D97706", // amber-600
	VENCIDO: "#EF4444", // red-500
	CUMPLIDO: "#10B981", // emerald-500
	CANCELADO: "#64748B", // slate-500
};

// ---------- Component ----------
export default function Dashboard() {
	const { plan, recv, fill, byEstado } = useMemo(() => kpis(), []);
	const series = useMemo(() => weeklySeries(), []);
	const proveedores = useMemo(() => topProveedores(5), []);
	const ultimasRecep = useMemo(
		() =>
			[...recepcionesSeed]
				.sort((a, b) => (a.fecha > b.fecha ? -1 : 1))
				.slice(0, 6),
		[]
	);

	// Pie data por estado
	const pieData = useMemo(() => {
		const estados: EstadoCompromiso[] = [
			"PENDIENTE",
			"CONFIRMADO",
			"REPROGRAMADO",
			"VENCIDO",
			"CUMPLIDO",
			"CANCELADO",
		];
		return estados
			.map((e) => ({
				name: e,
				value: byEstado[e] ?? 0,
				color: ESTADO_COLORS[e],
			}))
			.filter((x) => x.value > 0);
	}, [byEstado]);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						Resumen operativo — datos en memoria (sin BD).
					</p>
				</div>
				<div className="flex gap-2">
					<Link to="/compromisos">
						<Button variant="outline">
							<Package className="w-4 h-4 mr-2" />
							Compromisos
						</Button>
					</Link>
					<Link to="/recepciones">
						<Button variant="outline">
							<Truck className="w-4 h-4 mr-2" />
							Recepciones
						</Button>
					</Link>
					<Link to="/zc">
						<Button variant="outline">
							<AlertCircle className="w-4 h-4 mr-2" />
							No Conformidades
						</Button>
					</Link>
					<Link to="/documentos">
						<Button variant="outline">
							<FileText className="w-4 h-4 mr-2" />
							Documentos
						</Button>
					</Link>
				</div>
			</div>

			{/* KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Planificado</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">{fmt.format(plan)}</div>
						<div className="text-xs text-muted-foreground">Unidades</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Recepcionado</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">{fmt.format(recv)}</div>
						<div className="text-xs text-muted-foreground">Unidades</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Fill Rate</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center gap-2 overflow-visible">
						<Gauge className="w-5 h-5" />
						<div className="text-2xl font-bold">{fill}%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">ZC activas</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">{zcSeed.length}</div>
						<div className="text-xs text-muted-foreground">
							No conformidades
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Gráficos */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{/* Plan vs Recepción por semana */}
				<Card className="col-span-1 lg:col-span-2">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">
							Plan vs Recepción por Semana
						</CardTitle>
					</CardHeader>
					<CardContent className="h-64 overflow-visible">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={series}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="semana" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="plan" name="Plan" />
								<Bar dataKey="recv" name="Recepción" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Distribución por estado (Pie) */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Distribución por Estado</CardTitle>
					</CardHeader>
					<CardContent className="h-64 overflow-visible">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={pieData}
									dataKey="value"
									nameKey="name"
									outerRadius={90}
									label
								>
									{pieData.map((entry, idx) => (
										<Cell key={`c-${idx}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Top proveedores */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">
						Top 5 Proveedores por Plan
					</CardTitle>
				</CardHeader>
				<CardContent className="h-64 overflow-visible">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={proveedores}
							layout="vertical"
							margin={{ left: 40, right: 20, top: 5, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" />
							<YAxis type="category" dataKey="proveedor" />
							<Tooltip />
							<Legend />
							<Bar dataKey="plan" name="Plan" />
							<Bar dataKey="recv" name="Recepción" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Actividad reciente */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center gap-2">
							<Truck className="w-4 h-4" /> Últimas recepciones
						</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><Table>
							<TableHeader>
								<TableRow>
									<TableHead>Guía</TableHead>
									<TableHead>Compromiso</TableHead>
									<TableHead>Fecha</TableHead>
									<TableHead className="text-right">Cantidad</TableHead>
									<TableHead>Calidad</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{ultimasRecep.map((r) => (
									<TableRow key={r.id}>
										<TableCell>{r.guia}</TableCell>
										<TableCell>{r.compromiso_id}</TableCell>
										<TableCell>
											{r.fecha.replace("T", " ").slice(0, 16)}
										</TableCell>
										<TableCell className="text-right">
											{fmt.format(r.cantidad)}
										</TableCell>
										<TableCell>
											<Badge
												className={
													r.calidad === "CONFORME"
														? "bg-emerald-100 text-emerald-800"
														: "bg-red-100 text-red-800"
												}
											>
												{r.calidad === "CONFORME" ? "Conforme" : "No Conforme"}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center gap-2">
							<FileText className="w-4 h-4" /> Documentos recientes
						</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tipo</TableHead>
									<TableHead>OC</TableHead>
									<TableHead>Folio</TableHead>
									<TableHead>Fecha</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[...documentosSeed]
									.sort((a, b) => (String(a.fecha) > String(b.fecha) ? -1 : 1))
									.slice(0, 6)
									.map((d) => (
										<TableRow key={d.id}>
											<TableCell>
												<Badge variant="outline">{d.tipo}</Badge>
											</TableCell>
											<TableCell>{d.oc ?? "—"}</TableCell>
											<TableCell>{d.folio ?? "—"}</TableCell>
											<TableCell>{d.fecha ?? "—"}</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<Separator />
			<div className="text-xs text-muted-foreground">
				Sugerencias: atajos a “riesgos” (vencidos/reprogramados), y widgets de
				“semanas críticas”.
			</div>
		</div>
	);
}
