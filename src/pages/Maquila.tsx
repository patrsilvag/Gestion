// src/pages/Maquila.tsx
import React, { useMemo, useState } from "react";

type Contrato = {
	id: string;
	proveedor: string;
	servicio: string;
	vigenciaDesde: string; // YYYY-MM-DD
	vigenciaHasta: string; // YYYY-MM-DD
	tarifa: string; // texto amigable (ej: "$85 / kg")
	estado: "Vigente" | "Por vencer" | "Vencido" | "Borrador";
	actualizado: string; // fecha corta
};

const MOCK: Contrato[] = [
	{
		id: "CT-2025-001",
		proveedor: "Maquila Sur Ltda.",
		servicio: "Fraccionado de insumo X",
		vigenciaDesde: "2025-01-01",
		vigenciaHasta: "2025-06-30",
		tarifa: "$85 / kg",
		estado: "Vigente",
		actualizado: "2025-02-10",
	},
	{
		id: "CT-2024-118",
		proveedor: "Procesos Andinos SpA",
		servicio: "Envasado línea B",
		vigenciaDesde: "2024-07-01",
		vigenciaHasta: "2025-03-31",
		tarifa: "$1.200 / pallet",
		estado: "Por vencer",
		actualizado: "2025-02-05",
	},
	{
		id: "CT-2024-077",
		proveedor: "Servicios Norte",
		servicio: "Maquila integral",
		vigenciaDesde: "2024-01-01",
		vigenciaHasta: "2024-12-31",
		tarifa: "$0,45 / unidad",
		estado: "Vencido",
		actualizado: "2024-12-29",
	},
	{
		id: "CT-2025-010",
		proveedor: "Maquila Sur Ltda.",
		servicio: "Etiquetado y reempaque",
		vigenciaDesde: "2025-02-01",
		vigenciaHasta: "2025-08-31",
		tarifa: "$350 / hora",
		estado: "Borrador",
		actualizado: "2025-02-20",
	},
];

const badge = (estado: Contrato["estado"]) => {
	const base = "px-2 py-0.5 text-xs rounded-full";
	switch (estado) {
		case "Vigente":
			return base + " bg-green-100 text-green-800";
		case "Por vencer":
			return base + " bg-amber-100 text-amber-800";
		case "Vencido":
			return base + " bg-red-100 text-red-800";
		default:
			return base + " bg-gray-100 text-gray-800";
	}
};

const Maquila: React.FC = () => {
	const [q, setQ] = useState("");
	const [prov, setProv] = useState("Todos");
	const [estado, setEstado] = useState<"Todos" | Contrato["estado"]>("Todos");
	const [vig, setVig] = useState<
		"Todos" | "Vigentes" | "Vencidos" | "PorVencer"
	>("Todos");

	const proveedores = useMemo(
		() => ["Todos", ...Array.from(new Set(MOCK.map((m) => m.proveedor)))],
		[]
	);

	const data = useMemo(() => {
		return MOCK.filter((c) => {
			const text = (c.id + c.proveedor + c.servicio).toLowerCase();
			const okQ = q.trim() === "" || text.includes(q.toLowerCase());
			const okProv = prov === "Todos" || c.proveedor === prov;
			const okEstado = estado === "Todos" || c.estado === estado;

			// filtro simple de vigencia
			let okVig = true;
			const hoy = new Date("2025-02-20"); // mock de “hoy”; opcional: new Date()
			const hasta = new Date(c.vigenciaHasta);
			const diffDays = Math.ceil(
				(hasta.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
			);

			if (vig === "Vigentes") okVig = diffDays >= 0;
			if (vig === "Vencidos") okVig = diffDays < 0;
			if (vig === "PorVencer") okVig = diffDays >= 0 && diffDays <= 45;

			return okQ && okProv && okEstado && okVig;
		});
	}, [q, prov, estado, vig]);

	const crearContrato = () => alert("Nuevo contrato (mock). Abre formulario.");
	const importarCSV = () => alert("Importar CSV/XLSX (mock).");
	const ver = (id: string) => alert(`Ver contrato ${id} (mock).`);
	const editar = (id: string) => alert(`Editar contrato ${id} (mock).`);
	const descargar = (id: string) => alert(`Descargar contrato ${id} (mock).`);
	const eliminar = (id: string) => {
		if (confirm(`¿Eliminar contrato ${id}? (mock)`)) alert("Eliminado (mock).");
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">
				Módulo de Maquila / Contratos Marco
			</h1>
			<p className="text-gray-700">
				Aquí se administran los servicios recurrentes o contratos de maquila con
				los proveedores.
			</p>

			{/* Ayuda contextual */}
			<div className="rounded-lg border bg-slate-50 p-4 text-sm">
				<div className="grid gap-2 sm:grid-cols-3">
					<div>
						<div className="font-medium">Menú (ruta)</div>
						<div className="text-slate-600">/maquila</div>
					</div>
					<div>
						<div className="font-medium">Qué gestiona</div>
						<div className="text-slate-600">
							Tarifas, vigencias, servicios y anexos por proveedor.
						</div>
					</div>
					<div>
						<div className="font-medium">Integraciones</div>
						<div className="text-slate-600">
							SAP MM (proveedores/condiciones), Documentos.
						</div>
					</div>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex gap-2">
					<button
						onClick={crearContrato}
						className="rounded-md bg-blue-600 px-3 py-2 text-white"
					>
						Nuevo contrato
					</button>
					<button
						onClick={importarCSV}
						className="rounded-md border px-3 py-2 bg-white"
					>
						Importar CSV/XLSX
					</button>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<input
						placeholder="Buscar por código, proveedor o servicio"
						className="w-64 rounded-md border p-2"
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
					<select
						className="rounded-md border p-2"
						value={prov}
						onChange={(e) => setProv(e.target.value)}
					>
						{proveedores.map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</select>
					<select
						className="rounded-md border p-2"
						value={estado}
						onChange={(e) => setEstado(e.target.value as any)}
					>
						<option>Todos</option>
						<option>Vigente</option>
						<option>Por vencer</option>
						<option>Vencido</option>
						<option>Borrador</option>
					</select>
					<select
						className="rounded-md border p-2"
						value={vig}
						onChange={(e) => setVig(e.target.value as any)}
					>
						<option value="Todos">Vigencia: Todos</option>
						<option value="Vigentes">Vigentes</option>
						<option value="PorVencer">Por vencer (≤45 días)</option>
						<option value="Vencidos">Vencidos</option>
					</select>
				</div>
			</div>

			{/* Tabla */}
			<div className="overflow-auto rounded-lg border">
				<table className="min-w-[960px] w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 border-b">Código</th>
							<th className="p-2 border-b">Proveedor</th>
							<th className="p-2 border-b">Servicio</th>
							<th className="p-2 border-b">Vigencia</th>
							<th className="p-2 border-b">Tarifa</th>
							<th className="p-2 border-b">Estado</th>
							<th className="p-2 border-b">Actualización</th>
							<th className="p-2 border-b text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{data.length === 0 && (
							<tr>
								<td colSpan={8} className="p-4 text-center text-slate-500">
									Sin registros que coincidan con el filtro.
								</td>
							</tr>
						)}
						{data.map((c) => (
							<tr key={c.id} className="hover:bg-gray-50">
								<td className="p-2 border-b">{c.id}</td>
								<td className="p-2 border-b">{c.proveedor}</td>
								<td className="p-2 border-b">{c.servicio}</td>
								<td className="p-2 border-b">
									{c.vigenciaDesde} → {c.vigenciaHasta}
								</td>
								<td className="p-2 border-b">{c.tarifa}</td>
								<td className="p-2 border-b">
									<span className={badge(c.estado)}>{c.estado}</span>
								</td>
								<td className="p-2 border-b">{c.actualizado}</td>
								<td className="p-2 border-b">
									<div className="flex justify-end gap-2">
										<button
											className="rounded-md border px-2 py-1"
											onClick={() => ver(c.id)}
										>
											Ver
										</button>
										<button
											className="rounded-md border px-2 py-1"
											onClick={() => editar(c.id)}
										>
											Editar
										</button>
										<button
											className="rounded-md border px-2 py-1"
											onClick={() => descargar(c.id)}
										>
											Descargar
										</button>
										<button
											className="rounded-md border px-2 py-1 text-red-600"
											onClick={() => eliminar(c.id)}
										>
											Eliminar
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot className="bg-gray-50">
						<tr>
							<td colSpan={8} className="p-2 text-right text-xs text-slate-500">
								{data.length} contrato(s) mostrados
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			{/* Paginación mock */}
			<div className="flex items-center justify-between">
				<div className="text-xs text-slate-500">Página 1 de 1</div>
				<div className="flex gap-2">
					<button className="rounded-md border px-3 py-1.5 bg-white" disabled>
						Anterior
					</button>
					<button className="rounded-md border px-3 py-1.5 bg-white" disabled>
						Siguiente
					</button>
				</div>
			</div>
		</div>
	);
};

export default Maquila;
