import React, { useMemo, useState } from "react";

type Alerta = {
	id: string;
	tipo: "OT" | "IF" | "OTIF";
	oc: string;
	sku: string;
	proveedor: string;
	fechaCompromiso: string;
	estado: "En plazo" | "Fuera de plazo" | "Parcial";
};

const MOCK: Alerta[] = [
	{
		id: "A-001",
		tipo: "OT",
		oc: "45001234",
		sku: "MAT-1001",
		proveedor: "Maquila Sur",
		fechaCompromiso: "2025-02-20",
		estado: "Fuera de plazo",
	},
	{
		id: "A-002",
		tipo: "IF",
		oc: "45005678",
		sku: "MAT-2003",
		proveedor: "Proc. Andinos",
		fechaCompromiso: "2025-02-22",
		estado: "Parcial",
	},
];

const PortalAlertas: React.FC = () => {
	const [q, setQ] = useState("");
	const [tipo, setTipo] = useState<"Todos" | Alerta["tipo"]>("Todos");

	const data = useMemo(() => {
		return MOCK.filter((a) => {
			const t = (a.id + a.oc + a.sku + a.proveedor + a.estado).toLowerCase();
			const okQ = q.trim() === "" || t.includes(q.toLowerCase());
			const okT = tipo === "Todos" || a.tipo === tipo;
			return okQ && okT;
		});
	}, [q, tipo]);

	const ver = (id: string) => alert(`Ver detalle alerta ${id} (mock)`);
	const comentar = (id: string) =>
		alert(`Comentar/justificar alerta ${id} (mock)`);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Alertas — Portal</h1>
			<p className="text-gray-600">
				Revisa alertas de cumplimiento OT/IF y comenta tu plan de acción.
			</p>

			<div className="flex flex-wrap gap-2 items-center">
				<input
					className="border rounded p-2 w-64"
					placeholder="Buscar (OC, SKU, proveedor)"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
				<select
					className="border rounded p-2"
					value={tipo}
					onChange={(e) => setTipo(e.target.value as any)}
				>
					<option>Todos</option>
					<option value="OT">OT (fecha)</option>
					<option value="IF">IF (cantidad)</option>
					<option value="OTIF">OTIF</option>
				</select>
			</div>

			<div className="overflow-auto rounded border">
				<table className="min-w-[900px] w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 border-b">ID</th>
							<th className="p-2 border-b">Tipo</th>
							<th className="p-2 border-b">OC</th>
							<th className="p-2 border-b">SKU</th>
							<th className="p-2 border-b">Proveedor</th>
							<th className="p-2 border-b">Fecha Compromiso</th>
							<th className="p-2 border-b">Estado</th>
							<th className="p-2 border-b text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{data.map((a) => (
							<tr key={a.id} className="hover:bg-gray-50">
								<td className="p-2 border-b">{a.id}</td>
								<td className="p-2 border-b">{a.tipo}</td>
								<td className="p-2 border-b">{a.oc}</td>
								<td className="p-2 border-b">{a.sku}</td>
								<td className="p-2 border-b">{a.proveedor}</td>
								<td className="p-2 border-b">{a.fechaCompromiso}</td>
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
											onClick={() => comentar(a.id)}
										>
											Comentar
										</button>
									</div>
								</td>
							</tr>
						))}
						{data.length === 0 && (
							<tr>
								<td colSpan={8} className="p-4 text-center text-slate-500">
									Sin alertas.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PortalAlertas;
