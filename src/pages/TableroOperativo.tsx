import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Download,
	FileText,
	Filter,
	Info,
	RefreshCcw,
	Package,
	Truck,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RTooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

/**
 * HU7 — Tablero Operativo — Gestión de OC (sin BD)
 * Demo 100% frontend con datos en memoria (no persiste).
 * Requisitos: Tailwind + shadcn/ui, lucide-react, recharts.
 */

type Modelo = "ALFA" | "TIF" | "HIBRIDO" | "MAQUILA";
type EstadoCompromiso =
	| "PENDIENTE"
	| "CONFIRMADO"
	| "REPROGRAMADO"
	| "VENCIDO"
	| "CUMPLIDO"
	| "CANCELADO";
type CalidadEstado = "CONFORME" | "NO_CONFORME";

type Compromiso = {
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
};

type Recepcion = {
	id: string;
	compromiso_id: string;
	fecha: string; // ISO datetime
	cantidad: number;
	calidad: CalidadEstado;
	guia: string;
};

type ZC = {
	id: string;
	oc: string;
	linea: string;
	proveedor: string;
	motivo: string;
	estado: "ABIERTA" | "EN_ANALISIS" | "RESUELTA" | "CERRADA";
	creada: string;
};

type Documento = {
	id: string;
	tipo: "GUIA" | "NC" | "EVIDENCIA";
	oc?: string;
	linea?: string;
	proveedor?: string;
	folio?: string;
	fecha?: string;
	url?: string;
	estado?: "VALIDO" | "OBSERVADO" | "RECHAZADO";
};

const compromisosSeed: Compromiso[] = [
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

const recepcionesSeed: Recepcion[] = [
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

const zcSeed: ZC[] = [
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

const documentosSeed: Documento[] = [
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

const fmt = new Intl.NumberFormat("es-CL");
const weekOrder = (w: string) => Number(w.replace("-W", ""));

function kpis(compromisos: Compromiso[]) {
	const consider = compromisos.filter((c) => !c.excluye_kpi);
	const plan = consider.reduce((s, c) => s + c.cantidad, 0);
	const recv = consider.reduce((s, c) => s + c.cantidad_recibida, 0);
	const fillRate = plan === 0 ? 0 : Math.round((recv / plan) * 100);
	const vencidos = consider.filter((c) => c.estado === "VENCIDO").length;
	const pendientes = consider.filter((c) => c.estado === "PENDIENTE").length;
	const cumplidos = consider.filter((c) => c.estado === "CUMPLIDO").length;
	const reprogramados = consider.filter(
		(c) => c.estado === "REPROGRAMADO"
	).length;
	return {
		plan,
		recv,
		fillRate,
		vencidos,
		pendientes,
		cumplidos,
		reprogramados,
	};
}

function weeklySeries(compromisos: Compromiso[]) {
	const map: Record<string, { semana: string; plan: number; recv: number }> =
		{};
	compromisos.forEach((c) => {
		if (!map[c.semana]) map[c.semana] = { semana: c.semana, plan: 0, recv: 0 };
		map[c.semana].plan += c.cantidad;
		map[c.semana].recv += c.cantidad_recibida;
	});
	return Object.values(map).sort(
		(a, b) => weekOrder(a.semana) - weekOrder(b.semana)
	);
}

function suppliers(compromisos: Compromiso[]) {
	const set = new Set(compromisos.map((c) => c.proveedor));
	return ["Todos", ...Array.from(set)];
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

export default function TableroOperativoPage() {
	const [data, setData] = useState({
		compromisos: compromisosSeed,
		recepciones: recepcionesSeed,
		zc: zcSeed,
		documentos: documentosSeed,
	});
	const [q, setQ] = useState("");
	const [proveedor, setProveedor] = useState("Todos");
	const [modelo, setModelo] = useState<"Todos" | Modelo>("Todos");
	const [semana, setSemana] = useState<"Todas" | string>("Todas");

	const proveedores = useMemo(
		() => suppliers(data.compromisos),
		[data.compromisos]
	);
	const semanas = useMemo(
		() => [
			"Todas",
			...Array.from(new Set(data.compromisos.map((c) => c.semana))).sort(
				(a, b) => weekOrder(a) - weekOrder(b)
			),
		],
		[data.compromisos]
	);

	const filtered = useMemo(() => {
		return data.compromisos.filter((c) => {
			const text = `${c.oc} ${c.linea} ${c.proveedor}`.toLowerCase();
			const hitQ = q ? text.includes(q.toLowerCase()) : true;
			const hitProv = proveedor === "Todos" ? true : c.proveedor === proveedor;
			const hitModelo = modelo === "Todos" ? true : c.modelo === modelo;
			const hitSemana = semana === "Todas" ? true : c.semana === semana;
			return hitQ && hitProv && hitModelo && hitSemana;
		});
	}, [data.compromisos, q, proveedor, modelo, semana]);

	const metrics = useMemo(() => kpis(filtered), [filtered]);
	const series = useMemo(() => weeklySeries(filtered), [filtered]);

	return (
		<div className="p-6 space-y-6">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">
					HU7 — Tablero Operativo — Gestión de OC (sin BD)
				</h1>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => {
							setData({
								compromisos: compromisosSeed,
								recepciones: recepcionesSeed,
								zc: zcSeed,
								documentos: documentosSeed,
							});
						}}
					>
						<RefreshCcw className="w-4 h-4 mr-2" />
						Reset
					</Button>
					<Button variant="outline">
						<Download className="w-4 h-4 mr-2" />
						Exportar CSV
					</Button>
				</div>
			</header>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base flex items-center gap-2">
						<Filter className="w-4 h-4" />
						Filtros
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
					<Input
						placeholder="Buscar por OC / línea / proveedor"
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
					<Select value={proveedor} onValueChange={setProveedor}>
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
					<Select value={modelo} onValueChange={(v) => setModelo(v as any)}>
						<SelectTrigger>
							<SelectValue placeholder="Modelo" />
						</SelectTrigger>
						<SelectContent>
							{(["Todos", "ALFA", "TIF", "HIBRIDO", "MAQUILA"] as const).map(
								(m) => (
									<SelectItem key={m} value={m}>
										{m}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
					<Select value={semana} onValueChange={(v) => setSemana(v as any)}>
						<SelectTrigger>
							<SelectValue placeholder="Semana" />
						</SelectTrigger>
						<SelectContent>
							{semanas.map((w) => (
								<SelectItem key={w} value={w}>
									{w}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Planificado</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{fmt.format(metrics.plan)}</div>
						<div className="text-xs text-muted-foreground">Unidades</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Recepcionado</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{fmt.format(metrics.recv)}</div>
						<div className="text-xs text-muted-foreground">Unidades</div>
						<Progress value={metrics.fillRate} className="mt-2" />
						<div className="text-xs text-muted-foreground mt-1">
							Fill Rate: {metrics.fillRate}%
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Estados</CardTitle>
					</CardHeader>
					<CardContent className="flex gap-2 flex-wrap">
						<Badge className="bg-emerald-100 text-emerald-800">
							<CheckCircle2 className="w-3 h-3 mr-1" />
							Cumplidos {metrics.cumplidos}
						</Badge>
						<Badge className="bg-yellow-100 text-yellow-800">
							<Clock className="w-3 h-3 mr-1" />
							Pend. {metrics.pendientes}
						</Badge>
						<Badge className="bg-red-100 text-red-800">
							<AlertCircle className="w-3 h-3 mr-1" />
							Venc. {metrics.vencidos}
						</Badge>
						<Badge className="bg-amber-100 text-amber-800">
							Reprog. {metrics.reprogramados}
						</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Ayuda</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Demostración con datos en memoria. No guarda cambios al recargar.
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">
						Plan vs Recepción por Semana
					</CardTitle>
				</CardHeader>
				<CardContent className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={series}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="semana" />
							<YAxis />
							<RTooltip />
							<Legend />
							<Bar dataKey="plan" name="Plan" />
							<Bar dataKey="recv" name="Recepción" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<Tabs defaultValue="compromisos">
				<TabsList>
					<TabsTrigger value="compromisos">Compromisos</TabsTrigger>
					<TabsTrigger value="recepciones">Recepciones</TabsTrigger>
					<TabsTrigger value="zc">No Conformidades</TabsTrigger>
					<TabsTrigger value="docs">Documentos</TabsTrigger>
				</TabsList>

				<TabsContent value="compromisos">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<Package className="w-4 h-4" />
								Compromisos ({filtered.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>OC</TableHead>
										<TableHead>Línea</TableHead>
										<TableHead>Proveedor</TableHead>
										<TableHead>Modelo</TableHead>
										<TableHead>Fecha</TableHead>
										<TableHead>Semana</TableHead>
										<TableHead className="text-right">Plan</TableHead>
										<TableHead className="text-right">Recibido</TableHead>
										<TableHead>Estado</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map((c) => (
										<TableRow key={c.id} className="hover:bg-muted/50">
											<TableCell>{c.oc}</TableCell>
											<TableCell>{c.linea}</TableCell>
											<TableCell>{c.proveedor}</TableCell>
											<TableCell>
												<Badge variant="outline">{c.modelo}</Badge>
											</TableCell>
											<TableCell>{c.fecha}</TableCell>
											<TableCell>{c.semana}</TableCell>
											<TableCell className="text-right">
												{fmt.format(c.cantidad)}
											</TableCell>
											<TableCell className="text-right">
												{fmt.format(c.cantidad_recibida)}
											</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded text-xs ${estadoBadge(
														c.estado
													)}`}
												>
													{c.estado}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="recepciones">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<Truck className="w-4 h-4" />
								Recepciones
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
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
									{data.recepciones.map((r) => (
										<TableRow key={r.id}>
											<TableCell>{r.guia}</TableCell>
											<TableCell>{r.compromiso_id}</TableCell>
											<TableCell>{r.fecha.replace("T", " ")}</TableCell>
											<TableCell className="text-right">
												{fmt.format(r.cantidad)}
											</TableCell>
											<TableCell>
												{r.calidad === "CONFORME" ? (
													<Badge className="bg-emerald-100 text-emerald-800">
														Conforme
													</Badge>
												) : (
													<Badge className="bg-red-100 text-red-800">
														No Conforme
													</Badge>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="zc">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<AlertCircle className="w-4 h-4" />
								No Conformidades
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>OC</TableHead>
										<TableHead>Línea</TableHead>
										<TableHead>Proveedor</TableHead>
										<TableHead>Motivo</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead>Creada</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.zc.map((z) => (
										<TableRow key={z.id}>
											<TableCell>{z.oc}</TableCell>
											<TableCell>{z.linea}</TableCell>
											<TableCell>{z.proveedor}</TableCell>
											<TableCell>{z.motivo}</TableCell>
											<TableCell>
												<Badge variant="outline">{z.estado}</Badge>
											</TableCell>
											<TableCell>{z.creada}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="docs">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<FileText className="w-4 h-4" />
								Documentos
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tipo</TableHead>
										<TableHead>OC</TableHead>
										<TableHead>Folio</TableHead>
										<TableHead>Fecha</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead>URL</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.documentos.map((d) => (
										<TableRow key={d.id}>
											<TableCell>
												<Badge variant="outline">{d.tipo}</Badge>
											</TableCell>
											<TableCell>{d.oc}</TableCell>
											<TableCell>{d.folio}</TableCell>
											<TableCell>{d.fecha}</TableCell>
											<TableCell>{d.estado}</TableCell>
											<TableCell>
												{d.url ? (
													<a
														href={d.url}
														target="_blank"
														className="text-blue-600 underline"
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
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Separator />
			<div className="text-xs text-muted-foreground flex items-center gap-2">
				<Info className="w-3 h-3" /> Sugerencias: edición inline, drag&drop de
				fechas por semana y modal de detalle con trazabilidad completa.
			</div>
		</div>
	);
}
