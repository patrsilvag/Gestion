import React, { useState } from "react";

type Doc = {
	id: string;
	tipo: "Factura" | "Guía" | "Certificado";
	oc: string;
	fecha: string;
	estado: "Pendiente" | "Aprobado" | "Observado";
};

const MOCK: Doc[] = [
	{
		id: "DOC-001",
		tipo: "Guía",
		oc: "45001234",
		fecha: "2025-02-18",
		estado: "Pendiente",
	},
	{
		id: "DOC-002",
		tipo: "Factura",
		oc: "45005678",
		fecha: "2025-02-19",
		estado: "Aprobado",
	},
];

const PortalDocumentos: React.FC = () => {
	const [files, setFiles] = useState<FileList | null>(null);
	const [docs] = useState<Doc[]>(MOCK);

	const subir = () => {
		if (!files || files.length === 0)
			return alert("Selecciona archivos para subir.");
		alert(`Subida mock de ${files.length} archivo(s).`);
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Documentos — Portal</h1>
			<p className="text-gray-600">
				Sube y revisa documentos asociados a tus órdenes.
			</p>

			<div className="flex gap-2 items-center">
				<input
					type="file"
					multiple
					onChange={(e) => setFiles(e.target.files)}
					className="border rounded p-2"
				/>
				<button
					onClick={subir}
					className="bg-blue-600 text-white rounded px-3 py-2"
				>
					Subir
				</button>
			</div>

			<div className="overflow-auto rounded border">
				<table className="min-w-[760px] w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 border-b">ID</th>
							<th className="p-2 border-b">Tipo</th>
							<th className="p-2 border-b">OC</th>
							<th className="p-2 border-b">Fecha</th>
							<th className="p-2 border-b">Estado</th>
							<th className="p-2 border-b text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{docs.map((d) => (
							<tr key={d.id} className="hover:bg-gray-50">
								<td className="p-2 border-b">{d.id}</td>
								<td className="p-2 border-b">{d.tipo}</td>
								<td className="p-2 border-b">{d.oc}</td>
								<td className="p-2 border-b">{d.fecha}</td>
								<td className="p-2 border-b">{d.estado}</td>
								<td className="p-2 border-b">
									<div className="flex justify-end gap-2">
										<button className="border rounded px-2 py-1">
											Descargar
										</button>
										<button className="border rounded px-2 py-1">
											Eliminar
										</button>
									</div>
								</td>
							</tr>
						))}
						{docs.length === 0 && (
							<tr>
								<td colSpan={6} className="p-4 text-center text-slate-500">
									Sin documentos.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PortalDocumentos;
