// src/modules/oc/OCList.tsx
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
import { ocSeed, type OC, fmtCLP, fmtFechaDDMMYYYY } from "./data";

function estadoClase(estado: OC["estado"]) {
	switch (estado) {
		case "Abierta":
			return "bg-blue-100 text-blue-800";
		case "Parcial":
			return "bg-amber-100 text-amber-800";
		case "Cerrada":
			return "bg-emerald-100 text-emerald-800";
		default:
			return "bg-slate-100 text-slate-800";
	}
}

type SortKey = "oc" | "proveedor" | "fecha" | "monto" | "saldo" | "estado";
type SortDir = "asc" | "desc";
const ESTADOS: Array<OC["estado"] | "Todos"> = [
	"Todos",
	"Abierta",
	"Parcial",
	"Cerrada",
];

function cmp(a: any, b: any) {
	if (a === b) return 0;
	return a > b ? 1 : -1;
}

export default function OCList() {
	const [q, setQ] = useState("");
	const [estado, setEstado] = useState<OC["estado"] | "Todos">("Todos");
	const [sortBy, setSortBy] = useState<SortKey>("fecha");
	const [sortDir, setSortDir] = useState<SortDir>("desc");

	const data: OC[] = ocSeed;

	function toggleSort(col: SortKey) {
		if (sortBy === col) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(col);
			setSortDir("asc");
		}
	}
	function sortIndicator(col: SortKey) {
		if (sortBy !== col) return "";
		return sortDir === "asc" ? " ▲" : " ▼";
	}

	const filtered = useMemo(() => {
		const text = q.trim().toLowerCase();
		return data.filter((o: OC) => {
			const hitText =
				!text ||
				`${o.oc} ${o.proveedor} ${o.estado}`.toLowerCase().includes(text);
			const hitEstado = estado === "Todos" ? true : o.estado === estado;
			return hitText && hitEstado;
		});
	}, [q, estado, data]);

	const sorted = useMemo(() => {
		const arr = [...filtered];
		arr.sort((a, b) => {
			let A: any = a[sortBy];
			let B: any = b[sortBy];
			if (sortBy === "fecha") {
				A = new Date(A).getTime();
				B = new Date(B).getTime();
			}
			const s = cmp(A, B);
			return sortDir === "asc" ? s : -s;
		});
		return arr;
	}, [filtered, sortBy, sortDir]);

	const totals = useMemo(() => {
		const monto = filtered.reduce((s: number, o: OC) => s + o.monto, 0);
		const saldo = filtered.reduce((s: number, o: OC) => s + o.saldo, 0);
		return { monto, saldo };
	}, [filtered]);

	return (
		<div className="p-6 space-y-4">
			<div>
				<h1 className="text-2xl font-semibold">Órdenes de Compra</h1>
				<p className="text-sm text-muted-foreground">
					Este módulo muestra las OC activas y saldos disponibles.
				</p>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Búsqueda</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-3">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<Input
							placeholder="Buscar por OC / proveedor / estado"
							value={q}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setQ(e.target.value)
							}
						/>
					</div>

					<div className="flex flex-wrap gap-2">
						{ESTADOS.map((e) => (
							<Button
								key={e}
								variant={estado === e ? "default" : "outline"}
								onClick={() => setEstado(e as any)}
							>
								{e}
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Listado ({sorted.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<button
										onClick={() => toggleSort("oc")}
										className="underline"
									>
										OC{sortIndicator("oc")}
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => toggleSort("proveedor")}
										className="underline"
									>
										Proveedor{sortIndicator("proveedor")}
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => toggleSort("fecha")}
										className="underline"
									>
										Fecha{sortIndicator("fecha")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										onClick={() => toggleSort("monto")}
										className="underline"
									>
										Monto{sortIndicator("monto")}
									</button>
								</TableHead>
								<TableHead className="text-right">
									<button
										onClick={() => toggleSort("saldo")}
										className="underline"
									>
										Saldo{sortIndicator("saldo")}
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => toggleSort("estado")}
										className="underline"
									>
										Estado{sortIndicator("estado")}
									</button>
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{sorted.map((o: OC) => (
								<TableRow key={o.oc} className="hover:bg-muted/50">
									<TableCell>{o.oc}</TableCell>
									<TableCell>{o.proveedor}</TableCell>
									<TableCell>{fmtFechaDDMMYYYY(o.fecha)}</TableCell>
									<TableCell className="text-right">
										{fmtCLP.format(o.monto)}
									</TableCell>
									<TableCell className="text-right">
										{fmtCLP.format(o.saldo)}
									</TableCell>
									<TableCell>
										<Badge className={estadoClase(o.estado)}>{o.estado}</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>

						<TableFooter>
							<TableRow>
								<TableCell colSpan={3} className="font-medium">
									Totales
								</TableCell>
								<TableCell className="text-right font-semibold">
									{fmtCLP.format(totals.monto)}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{fmtCLP.format(totals.saldo)}
								</TableCell>
								<TableCell />
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
