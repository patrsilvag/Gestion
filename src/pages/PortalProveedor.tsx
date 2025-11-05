import React from "react";
import { Link } from "react-router-dom";

const PortalProveedor: React.FC = () => {
	const card =
		"border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white";

	const btn = "inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm";

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Portal Proveedor — Inicio</h1>
			<p className="text-gray-600">
				Bienvenido al portal del proveedor. Desde aquí puedes gestionar tus
				solicitudes, compromisos y documentos asociados a órdenes de compra.
			</p>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{/* Solicitudes ALFA */}
				<div className={card}>
					<h2 className="text-lg font-semibold mb-2">Solicitudes ALFA</h2>
					<p className="text-sm text-gray-600 mb-3">
						Consulta y responde las solicitudes enviadas desde el área de
						planificación.
					</p>
					<Link to="/portal-proveedor/solicitudes" className={btn}>
						Ver Solicitudes
					</Link>
				</div>

				{/* Compromisos */}
				<div className={card}>
					<h2 className="text-lg font-semibold mb-2">Compromisos</h2>
					<p className="text-sm text-gray-600 mb-3">
						Revisa y actualiza los compromisos de entrega asociados a tus
						órdenes de compra.
					</p>
					<Link to="/portal-proveedor/compromisos" className={btn}>
						Ir a Compromisos
					</Link>
				</div>

				{/* Documentos */}
				<div className={card}>
					<h2 className="text-lg font-semibold mb-2">Documentos</h2>
					<p className="text-sm text-gray-600 mb-3">
						Sube guías, facturas u otros documentos de respaldo.
					</p>
					<Link to="/portal-proveedor/documentos" className={btn}>
						Subir Documentos
					</Link>
				</div>

				{/* No Conformidades */}
				<div className={card}>
					<h2 className="text-lg font-semibold mb-2">No Conformidades</h2>
					<p className="text-sm text-gray-600 mb-3">
						Visualiza los rechazos de materiales y acciones requeridas.
					</p>
					<Link to="/portal-proveedor/zc" className={btn}>
						Ver No Conformidades
					</Link>
				</div>

				{/* Alertas */}
				<div className={card}>
					<h2 className="text-lg font-semibold mb-2">Alertas</h2>
					<p className="text-sm text-gray-600 mb-3">
						Mantente informado sobre plazos próximos o entregas atrasadas.
					</p>
					<Link to="/portal-proveedor/alertas" className={btn}>
						Revisar Alertas
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PortalProveedor;
