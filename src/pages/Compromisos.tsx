import FormMetaInfo from "@/components/shared/FormMetaInfo";
import { Portal as SelectPortal } from "@radix-ui/react-select";
// src/pages/Compromisos.tsx
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableFooter,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Filter, Info, Truck, FileText, X } from "lucide-react";

import {
	Compromiso,
	recepcionesSeed,
	zcSeed,
	documentosSeed,
	compromisosSeed,
	Modelo,
	EstadoCompromiso,
	proveedoresUnicos,
	semanasUnicas,
	fmtCLP0,
	avancePct,
	saldo,
	diasAtraso,
	weekOrder,
} from "@/modules/compromisos/data";

function estadoClase(estado: EstadoCompromiso) {
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

type SortKey =
	| "oc"
	| "proveedor"
	| "fecha"
	| "semana"
	| "cantidad"
	| "cantidad_recibida"
	| "avance"
	| "saldo"
	| "estado";
type SortDir = "asc" | "desc";
type Row = Compromiso & { __avance: number; __saldo: number };

export default function Compromisos() {
	// Filtros
	const [q, setQ] = useState<string>("");
	const [proveedor, setProveedor] = useState<string>("Todos");
	const [modelo, setModelo] = useState<"Todos" | Modelo>("Todos");
	const [semana, setSemana] = useState<"Todas" | string>("Todas");
	const [estado, setEstado] = useState<"Todos" | EstadoCompromiso>("Todos");

	// Orden
	const [sortBy, setSortBy] = useState<SortKey>("fecha");
	const [sortDir, setSortDir] = useState<SortDir>("desc");

	// Datos en memoria
	const data: Compromiso[] = compromisosSeed;

	const proveedores = useMemo(
		() => ["Todos", ...proveedoresUnicos(data)],
		[data]
	);
	const semanas = useMemo(() => ["Todas", ...semanasUnicas(data)], [data]);

	function toggleSort(col: SortKey) {
		if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortBy(col);
			setSortDir("asc");
		}
	}
	function sortIndicator(col: SortKey) {
		if (sortBy !== col) return "";
		return sortDir === "asc" ? " ▲" : " ▼";
	}

	// Filtro
	const filtered: Compromiso[] = useMemo(() => {
		const text = q.trim().toLowerCase();
		return data.filter((c: Compromiso) => {
			const hitText =
				!text ||
				`${c.oc} ${c.linea} ${c.proveedor}`.toLowerCase().includes(text);
			const hitProv = proveedor === "Todos" ? true : c.proveedor === proveedor;
			const hitModelo = modelo === "Todos" ? true : c.modelo === modelo;
			const hitSemana = semana === "Todas" ? true : c.semana === semana;
			const hitEstado = estado === "Todos" ? true : c.estado === estado;
			return hitText && hitProv && hitModelo && hitSemana && hitEstado;
		});
	}, [q, proveedor, modelo, semana, estado, data]);

	// Orden
	const sorted: Row[] = useMemo(() => {
		const arr: Row[] = filtered.map((c: Compromiso) => ({
			...c,
			__avance: avancePct(c.cantidad, c.cantidad_recibida),
			__saldo: saldo(c.cantidad, c.cantidad_recibida),
		}));
		arr.sort((a: Row, b: Row) => {
			let A: number | string;
			let B: number | string;
			switch (sortBy) {
				case "avance":
					A = a.__avance;
					B = b.__avance;
					break;
				case "saldo":
					A = a.__saldo;
					B = b.__saldo;
					break;
				case "fecha":
					A = new Date(a.fecha).getTime();
					B = new Date(b.fecha).getTime();
					break;
				case "semana":
					A = weekOrder(a.semana);
					B = weekOrder(b.semana);
					break;
				default:
					A = (a as any)[sortBy];
					B = (b as any)[sortBy];
			}
			const s = A === B ? 0 : A > B ? 1 : -1;
			return sortDir === "asc" ? s : -s;
		});
		return arr;
	}, [filtered, sortBy, sortDir]);

	// Totales
	const totals = useMemo(() => {
		const plan = filtered.reduce(
			(s: number, c: Compromiso) => s + c.cantidad,
			0
		);
		const recv = filtered.reduce(
			(s: number, c: Compromiso) => s + c.cantidad_recibida,
			0
		);
		const saldoTot = Math.max(0, plan - recv);
		const avance = plan === 0 ? 0 : Math.round((recv / plan) * 100);
		return { plan, recv, saldo: saldoTot, avance };
	}, [filtered]);

	// Modal de detalle
	const [detalle, setDetalle] = useState<Compromiso | null>(null);
	const recepcionesBy = (id: string) =>
		recepcionesSeed.filter((r) => r.compromiso_id === id);
	const zcBy = (oc: string, linea: string) =>
		zcSeed.filter((z) => z.oc === oc && z.linea === linea);
	const docsBy = (oc: string, linea: string) =>
		documentosSeed.filter((d) => d.oc === oc && d.linea === linea);

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Compromisos</h1>
				<p className="text-sm text-muted-foreground">
					Plan vs recepción por compromiso, con filtros, % avance, saldo y
					atraso.
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
						placeholder="Buscar por OC / línea / proveedor"
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

					<Select value={modelo} onValueChange={(v) => setModelo(v as any)}>
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

					<Select value={estado} onValueChange={(v) => setEstado(v as any)}>
						<SelectTrigger>
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectPortal><SelectContent className="z-[2147483647]" position="popper" side="bottom" sideOffset={8}>
							{(
								[
									"Todos",
									"PENDIENTE",
									"CONFIRMADO",
									"REPROGRAMADO",
									"VENCIDO",
									"CUMPLIDO",
									"CANCELADO",
								] as const
							).map((e) => (
								<SelectItem key={e} value={e}>
									{e}
								</SelectItem>
							))}
						</SelectContent></SelectPortal>
					</Select>
				</CardContent>
			</Card>

			{/* KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Planificado</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{fmtCLP0.format(totals.plan)}
						</div>
						<div className="text-xs text-muted-foreground">Unidades</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Recepcionado</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{fmtCLP0.format(totals.recv)}
						</div>
						<div className="text-xs text-muted-foreground">Unidades</div>
						<Progress value={totals.avance} className="mt-2" />
						<div className="text-xs text-muted-foreground mt-1">
							Fill Rate: {totals.avance}%
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Saldo</CardTitle>
					</CardHeader>
					<CardContent className="overflow-visible"><div className="text-2xl font-bold">
							{fmtCLP0.format(totals.saldo)}
						</div>
						<div className="text-xs text-muted-foreground">
							Unidades pendientes
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Ayuda</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground overflow-visible">
						Datos 100% en memoria. Click en la{" "}
						<span className="font-medium">OC</span> para detalle.
					</CardContent>
				</Card>
			</div>

			{/* Tabla */}
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
								<TableHead>Modelo</TableHead>
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
										onClick={() => toggleSort("semana")}
									>
										Semana{sortIndicator("semana")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("cantidad")}
									>
										Plan{sortIndicator("cantidad")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("cantidad_recibida")}
									>
										Recibido{sortIndicator("cantidad_recibida")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										className="underline"
										onClick={() => toggleSort("avance")}
									>
										% Avance{sortIndicator("avance")}
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
								<TableHead>Estado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sorted.map((c: Row) => {
								const av = avancePct(c.cantidad, c.cantidad_recibida);
								const sd = saldo(c.cantidad, c.cantidad_recibida);
								return (
									<TableRow key={c.id} className="hover:bg-muted/50">
										<TableCell>
											<button
												className="text-blue-600 underline"
												onClick={() => setDetalle(c)}
											>
												{c.oc}
											</button>
										</TableCell>
										<TableCell>{c.linea}</TableCell>
										<TableCell>{c.proveedor}</TableCell>
										<TableCell>
											<Badge variant="outline">{c.modelo}</Badge>
										</TableCell>
										<TableCell>{c.fecha}</TableCell>
										<TableCell>{c.semana}</TableCell>
										<TableCell className="text-right">
											{c.cantidad.toLocaleString("es-CL")}
										</TableCell>
										<TableCell className="text-right">
											{c.cantidad_recibida.toLocaleString("es-CL")}
										</TableCell>
										<TableCell className="text-right">{av}%</TableCell>
										<TableCell className="text-right">
											{sd.toLocaleString("es-CL")}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded text-xs ${estadoClase(
													c.estado
												)}`}
											>
												{c.estado}
											</span>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={6} className="font-medium">
									Totales
								</TableCell>
								<TableCell className="text-right font-semibold">
									{totals.plan.toLocaleString("es-CL")}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{totals.recv.toLocaleString("es-CL")}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{totals.avance}%
								</TableCell>
								<TableCell className="text-right font-semibold">
									{totals.saldo.toLocaleString("es-CL")}
								</TableCell>
								<TableCell />
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>

			<Separator />
			<div className="text-xs text-muted-foreground flex items-center gap-2">
				<Info className="w-3 h-3" /> Sugerencia: agrega “Exportar CSV” y “Editar
				inline” si lo necesitas.
			</div>

			{/* Modal de Detalle */}
			{detalle && (
				<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
					<div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
						<div className="p-4 border-b flex items-center justify-between">
							<h3 className="font-semibold">
								Detalle {detalle.oc} · Línea {detalle.linea}
							</h3>
							<Button variant="outline" onClick={() => setDetalle(null)}>
								<X className="w-4 h-4 mr-1" />
								Cerrar
							</Button>
						</div>

						<div className="p-4 grid gap-6">
							{/* Resumen */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								<div className="text-sm">
									<div className="text-muted-foreground">Proveedor</div>
									<div className="font-medium">{detalle.proveedor}</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">Plan</div>
									<div className="font-medium">
										{detalle.cantidad.toLocaleString("es-CL")}
									</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">Recibido</div>
									<div className="font-medium">
										{detalle.cantidad_recibida.toLocaleString("es-CL")}
									</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">% Avance</div>
									<div className="font-medium">
										{avancePct(detalle.cantidad, detalle.cantidad_recibida)}%
									</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">Saldo</div>
									<div className="font-medium">
										{saldo(
											detalle.cantidad,
											detalle.cantidad_recibida
										).toLocaleString("es-CL")}
									</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">Fecha</div>
									<div className="font-medium">{detalle.fecha}</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">Semana</div>
									<div className="font-medium">{detalle.semana}</div>
								</div>
								<div className="text-sm">
									<div className="text-muted-foreground">Atraso (días)</div>
									<div className="font-medium">
										{detalle.estado === "VENCIDO"
											? diasAtraso(detalle.fecha)
											: 0}
									</div>
								</div>
							</div>

							{/* Recepciones */}
							<div>
								<div className="flex items-center gap-2 mb-2 font-medium">
									<Truck className="w-4 h-4" /> Recepciones
								</div>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Guía</TableHead>
											<TableHead>Fecha</TableHead>
											<TableHead className="text-right">Cantidad</TableHead>
											<TableHead>Calidad</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recepcionesBy(detalle.id).map((r) => (
											<TableRow key={r.id}>
												<TableCell>{r.guia}</TableCell>
												<TableCell>{r.fecha.replace("T", " ")}</TableCell>
												<TableCell className="text-right">
													{r.cantidad.toLocaleString("es-CL")}
												</TableCell>
												<TableCell>
													<Badge
														className={
															r.calidad === "CONFORME"
																? "bg-emerald-100 text-emerald-800"
																: "bg-red-100 text-red-800"
														}
													>
														{r.calidad === "CONFORME"
															? "Conforme"
															: "No Conforme"}
													</Badge>
												</TableCell>
											</TableRow>
										))}
										{recepcionesBy(detalle.id).length === 0 && (
											<TableRow>
												<TableCell
													colSpan={4}
													className="text-sm text-muted-foreground"
												>
													Sin recepciones.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{/* No Conformidades */}
							<div>
								<div className="flex items-center gap-2 mb-2 font-medium">
									<AlertCircle className="w-4 h-4" /> No Conformidades
								</div>
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
										{zcBy(detalle.oc, detalle.linea).map((z) => (
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
										{zcBy(detalle.oc, detalle.linea).length === 0 && (
											<TableRow>
												<TableCell
													colSpan={6}
													className="text-sm text-muted-foreground"
												>
													Sin no conformidades.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{/* Documentos */}
							<div>
								<div className="flex items-center gap-2 mb-2 font-medium">
									<FileText className="w-4 h-4" /> Documentos
								</div>
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
										{docsBy(detalle.oc, detalle.linea).map((d) => (
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
										{docsBy(detalle.oc, detalle.linea).length === 0 && (
											<TableRow>
												<TableCell
													colSpan={6}
													className="text-sm text-muted-foreground"
												>
													Sin documentos.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
