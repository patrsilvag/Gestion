import React, { useMemo, useState } from "react";

type Alfa = {
	id: string;
	semana: string; // 2025-W08
	sku: string;
	desc: string;
	cantSolicitada: number;
	cantConfirmada?: number;
	estado: "Pendiente" | "Confirmada" | "Con Observaciones";
};

const MOCK: Alfa[] = [
	{
		id: "ALFA-001",
		semana: "2025-W08",
		sku: "MAT-1001",
		desc: "Insumo X",
		cantSolicitada: 1200,
		estado: "Pendiente",
	},
	{
		id: "ALFA-002",
		semana: "2025-W09",
		sku: "MAT-2003",
		desc: "Envase B",
		cantSolicitada: 700,
		estado: "Con Observaciones",
		cantConfirmada: 600,
	},
	{
		id: "ALFA-003",
		semana: "2025-W10",
		sku: "MAT-3300",
		desc: "Etiqueta C",
		cantSolicitada: 400,
		estado: "Confirmada",
		cantConfirmada: 400,
	},
];

const PortalALFA: React.FC = () => {
	const [q, setQ] = useState("");
	const [estado, setEstado] = useState<"Todos" | Alfa["estado"]>("Todos");

	const data = useMemo(() => {
		return MOCK.filter((a) => {
			const okQ =
				q.trim() === "" ||
				(a.id + a.sku + a.desc + a.semana)
					.toLowerCase()
					.includes(q.toLowerCase());
			const okE = estado === "Todos" || a.estado === estado;
			return okQ && okE;
		});
	}, [q, estado]);

	const confirmar = (id: string) => alert(`Confirmar solicitud ${id} (mock)`);
	const proponer = (id: string) =>
		alert(`Proponer cambio para ${id} (mock)\nEj: cantidad/semana alternativa`);
	const ver = (id: string) => alert(`Ver detalle ${id} (mock)`);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Solicitudes ALFA — Portal</h1>
			<p className="text-gray-600">
				Responde las solicitudes enviadas por planificación.
			</p>

			<div className="flex flex-wrap gap-2 items-center">
				<input
					className="border rounded p-2 w-64"
					placeholder="Buscar (ID, SKU, desc.)"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
				<select
					className="border rounded p-2"
					value={estado}
					onChange={(e) => setEstado(e.target.value as any)}
				>
					<option>Todos</option>
					<option>Pendiente</option>
					<option>Confirmada</option>
					<option>Con Observaciones</option>
				</select>
			</div>

			<div className="overflow-auto rounded border">
				<table className="min-w-[900px] w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 border-b">ID</th>
							<th className="p-2 border-b">Semana</th>
							<th className="p-2 border-b">SKU</th>
							<th className="p-2 border-b">Descripción</th>
							<th className="p-2 border-b">Cant. Solicitada</th>
							<th className="p-2 border-b">Cant. Confirmada</th>
							<th className="p-2 border-b">Estado</th>
							<th className="p-2 border-b text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{data.map((a) => (
							<tr key={a.id} className="hover:bg-gray-50">
								<td className="p-2 border-b">{a.id}</td>
								<td className="p-2 border-b">{a.semana}</td>
								<td className="p-2 border-b">{a.sku}</td>
								<td className="p-2 border-b">{a.desc}</td>
								<td className="p-2 border-b">{a.cantSolicitada}</td>
								<td className="p-2 border-b">{a.cantConfirmada ?? "-"}</td>
								<td className="p-2 border-b">{a.estado}</td>
								<td className="p-2 border-b">
									<div className="flex justify-end gap-2">
										<button
											className="border rounded px-2 py-1"
											onClick={() => ver(a.id)}
										>
											Ver
										</button>
										<button
											className="border rounded px-2 py-1"
											onClick={() => confirmar(a.id)}
										>
											Confirmar
										</button>
										<button
											className="border rounded px-2 py-1"
											onClick={() => proponer(a.id)}
										>
											Proponer cambio
										</button>
									</div>
								</td>
							</tr>
						))}
						{data.length === 0 && (
							<tr>
								<td colSpan={8} className="p-4 text-center text-slate-500">
									Sin resultados.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PortalALFA;
