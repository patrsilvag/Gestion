import React, { useMemo, useState } from "react";

type Compromiso = {
	id: string;
	oc: string;
	sku: string;
	desc: string;
	fecha: string; // YYYY-MM-DD
	cant: number;
	estado: "Pendiente" | "Confirmado" | "Propuesto";
};

const MOCK: Compromiso[] = [
	{
		id: "C-1001",
		oc: "45001234",
		sku: "MAT-1001",
		desc: "Insumo X",
		fecha: "2025-02-25",
		cant: 500,
		estado: "Pendiente",
	},
	{
		id: "C-1002",
		oc: "45005678",
		sku: "MAT-3300",
		desc: "Etiqueta C",
		fecha: "2025-02-26",
		cant: 200,
		estado: "Propuesto",
	},
	{
		id: "C-1003",
		oc: "45009876",
		sku: "MAT-2003",
		desc: "Envase B",
		fecha: "2025-03-01",
		cant: 800,
		estado: "Confirmado",
	},
];

const PortalCompromisos: React.FC = () => {
	const [q, setQ] = useState("");
	const [estado, setEstado] = useState<"Todos" | Compromiso["estado"]>("Todos");

	const data = useMemo(() => {
		return MOCK.filter((c) => {
			const okQ =
				q.trim() === "" ||
				(c.id + c.oc + c.sku + c.desc).toLowerCase().includes(q.toLowerCase());
			const okE = estado === "Todos" || c.estado === estado;
			return okQ && okE;
		});
	}, [q, estado]);

	const confirmar = (id: string) => alert(`Confirmar compromiso ${id} (mock)`);
	const proponer = (id: string) =>
		alert(`Proponer nueva fecha/cantidad para ${id} (mock)`);
	const comentar = (id: string) => alert(`Agregar comentario en ${id} (mock)`);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Compromisos — Portal</h1>
			<p className="text-gray-600">
				Confirma o propone cambios sobre compromisos de entrega.
			</p>

			<div className="flex flex-wrap gap-2 items-center">
				<input
					className="border rounded p-2 w-64"
					placeholder="Buscar (OC, SKU, desc.)"
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
					<option>Propuesto</option>
					<option>Confirmado</option>
				</select>
			</div>

			<div className="overflow-auto rounded border">
				<table className="min-w-[940px] w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 border-b">ID</th>
							<th className="p-2 border-b">OC</th>
							<th className="p-2 border-b">SKU</th>
							<th className="p-2 border-b">Descripción</th>
							<th className="p-2 border-b">Fecha</th>
							<th className="p-2 border-b">Cantidad</th>
							<th className="p-2 border-b">Estado</th>
							<th className="p-2 border-b text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{data.map((c) => (
							<tr key={c.id} className="hover:bg-gray-50">
								<td className="p-2 border-b">{c.id}</td>
								<td className="p-2 border-b">{c.oc}</td>
								<td className="p-2 border-b">{c.sku}</td>
								<td className="p-2 border-b">{c.desc}</td>
								<td className="p-2 border-b">{c.fecha}</td>
								<td className="p-2 border-b">{c.cant}</td>
								<td className="p-2 border-b">{c.estado}</td>
								<td className="p-2 border-b">
									<div className="flex justify-end gap-2">
										<button
											className="border rounded px-2 py-1"
											onClick={() => confirmar(c.id)}
										>
											Confirmar
										</button>
										<button
											className="border rounded px-2 py-1"
											onClick={() => proponer(c.id)}
										>
											Proponer
										</button>
										<button
											className="border rounded px-2 py-1"
											onClick={() => comentar(c.id)}
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

export default PortalCompromisos;
