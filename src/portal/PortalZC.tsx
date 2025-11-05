import React, { useMemo, useState } from "react";

type ZC = {
	id: string;
	recepcion: string;
	sku: string;
	desc: string;
	fecha: string;
	motivo: string;
	estado: "Abierta" | "En análisis" | "Cerrada";
};

const MOCK: ZC[] = [
	{
		id: "ZC-001",
		recepcion: "GR-78901",
		sku: "MAT-1001",
		desc: "Insumo X",
		fecha: "2025-02-18",
		motivo: "Daño en embalaje",
		estado: "Abierta",
	},
	{
		id: "ZC-002",
		recepcion: "GR-78922",
		sku: "MAT-3300",
		desc: "Etiqueta C",
		fecha: "2025-02-19",
		motivo: "Cantidad menor",
		estado: "En análisis",
	},
];

const PortalZC: React.FC = () => {
	const [q, setQ] = useState("");
	const [estado, setEstado] = useState<"Todos" | ZC["estado"]>("Todos");

	const data = useMemo(() => {
		return MOCK.filter((z) => {
			const okQ =
				q.trim() === "" ||
				(z.id + z.recepcion + z.sku + z.desc + z.motivo)
					.toLowerCase()
					.includes(q.toLowerCase());
			const okE = estado === "Todos" || z.estado === estado;
			return okQ && okE;
		});
	}, [q, estado]);

	const responder = (id: string) =>
		alert(`Responder a ZC ${id} (mock)\nAdjunta evidencia o comentario.`);
	const descargar = (id: string) => alert(`Descargar informe ZC ${id} (mock)`);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">No Conformidades — Portal</h1>
			<p className="text-gray-600">
				Consulta los rechazos y registra tus respuestas.
			</p>

			<div className="flex flex-wrap gap-2 items-center">
				<input
					className="border rounded p-2 w-64"
					placeholder="Buscar (ZC, recepción, SKU)"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
				<select
					className="border rounded p-2"
					value={estado}
					onChange={(e) => setEstado(e.target.value as any)}
				>
					<option>Todos</option>
					<option>Abierta</option>
					<option>En análisis</option>
					<option>Cerrada</option>
				</select>
			</div>

			<div className="overflow-auto rounded border">
				<table className="min-w-[980px] w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 border-b">ZC</th>
							<th className="p-2 border-b">Recepción</th>
							<th className="p-2 border-b">SKU</th>
							<th className="p-2 border-b">Descripción</th>
							<th className="p-2 border-b">Fecha</th>
							<th className="p-2 border-b">Motivo</th>
							<th className="p-2 border-b">Estado</th>
							<th className="p-2 border-b text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{data.map((z) => (
							<tr key={z.id} className="hover:bg-gray-50">
								<td className="p-2 border-b">{z.id}</td>
								<td className="p-2 border-b">{z.recepcion}</td>
								<td className="p-2 border-b">{z.sku}</td>
								<td className="p-2 border-b">{z.desc}</td>
								<td className="p-2 border-b">{z.fecha}</td>
								<td className="p-2 border-b">{z.motivo}</td>
								<td className="p-2 border-b">{z.estado}</td>
								<td className="p-2 border-b">
									<div className="flex justify-end gap-2">
										<button
											className="border rounded px-2 py-1"
											onClick={() => responder(z.id)}
										>
											Responder
										</button>
										<button
											className="border rounded px-2 py-1"
											onClick={() => descargar(z.id)}
										>
											Descargar
										</button>
									</div>
								</td>
							</tr>
						))}
						{data.length === 0 && (
							<tr>
								<td colSpan={8} className="p-4 text-center text-slate-500">
									Sin registros.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PortalZC;
