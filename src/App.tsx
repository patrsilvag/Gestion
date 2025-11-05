import { Route, Routes } from "react-router-dom";

/* NUEVOS módulos */
import IngestaSAP from "./pages/IngestaSAP";
import NuevoALFA from "./pages/NuevoALFA";

/* Base / Operativo */
import ZC from "./pages/zc";
import AlertasRemanente from "./pages/AlertasRemanente";
import Reasignacion from "./pages/Reasignacion";
import Mantenedores from "./pages/Mantenedores";
import Maquila from "./pages/Maquila";
import Alertas from "./pages/Alertas";

/* Layout */
import AppLayout from "@/layouts/AppLayout";

/* Páginas operativas */
import Dashboard from "@/pages/Dashboard";
import TableroOperativoPage from "@/pages/TableroOperativo";
import Compromisos from "@/pages/Compromisos";
import Recepciones from "@/pages/Recepciones";
import NoConformidades from "@/pages/NoConformidades";
import Documentos from "@/pages/Documentos";
import Proveedores from "@/pages/Proveedores";
import Reportes from "@/pages/Reportes";

/* Módulos / páginas adicionales */
import OCList from "@/modules/oc/OCList";
import OrdenLineaDetalle from "@/pages/OrdenLineaDetalle";
import CompromisoNuevo from "@/pages/CompromisoNuevo";
import CompromisoReprogramar from "@/pages/CompromisoReprogramar";
import RecepcionRegistrar from "@/pages/RecepcionRegistrar";
import Devoluciones from "@/pages/Devoluciones";
import MaquilaActas from "@/pages/MaquilaActas";
import DocumentosAdjuntar from "@/pages/DocumentosAdjuntar";

/* Mantenedores (subrutas directas) */
import MantProveedores from "@/mantenedores/Proveedores";
import MantCatalogos from "@/mantenedores/Catalogos";
import MantParametros from "@/mantenedores/Parametros";
import MantScoring from "@/mantenedores/Scoring";
import MantUsuarios from "@/mantenedores/Usuarios";
import MantCentrosAlmacenes from "@/mantenedores/CentrosAlmacenes";
import MantFamiliasCategorias from "@/mantenedores/FamiliasCategorias";
import MantToleranciasDiferencias from "@/mantenedores/ToleranciasDiferencias";
import MantVentanasPoliticas from "@/mantenedores/VentanasPoliticas";
import MantTiposDocumento from "@/mantenedores/TiposDocumento";
import MantReglasDocumentales from "@/mantenedores/ReglasDocumentales";
import MantMaquiladores from "@/mantenedores/Maquiladores";

/* Portal proveedor */
import PortalProveedor from "@/pages/PortalProveedor"; // Home del portal
import PortalALFA from "@/portal/PortalALFA"; // NUEVO
import PortalCompromisos from "@/portal/PortalCompromisos";
import PortalDocumentos from "@/portal/PortalDocumentos";
import PortalZC from "@/portal/PortalZC";
import PortalAlertas from "@/portal/PortalAlertas"; // NUEVO

export default function App() {
	return (
		<Routes>
			{/* Todo bajo layout para mantener el menú */}
			<Route element={<AppLayout />}>
				{/* Inicio / Dashboard */}
				<Route path="/" element={<Dashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/tablero-operativo" element={<TableroOperativoPage />} />
				{/* Órdenes & Compromisos */}
				<Route path="/oc" element={<OCList />} />
				<Route path="/oc/:ocId/linea/:lineId" element={<OrdenLineaDetalle />} />
				<Route path="/compromisos" element={<Compromisos />} />
				<Route path="/compromisos/nuevo" element={<CompromisoNuevo />} />
				<Route
					path="/compromisos/:id/reprogramar"
					element={<CompromisoReprogramar />}
				/>
				{/* Recepción & Calidad */}
				<Route path="/recepciones" element={<Recepciones />} />
				<Route path="/recepciones/registrar" element={<RecepcionRegistrar />} />
				<Route path="/zc" element={<NoConformidades />} />
				<Route path="/devoluciones" element={<Devoluciones />} />
				{/* Documentos */}
				<Route path="/documentos" element={<Documentos />} />
				<Route path="/documentos/adjuntar" element={<DocumentosAdjuntar />} />
				{/* Maquila */}
				<Route path="/maquila" element={<Maquila />} />
				<Route path="/maquila/actas" element={<MaquilaActas />} />
				{/* Proveedores / Alertas / Reportes */}
				<Route path="/proveedores" element={<Proveedores />} />
				<Route path="/alertas" element={<Alertas />} />
				<Route path="/reportes" element={<Reportes />} />
				{/* Mantenedores */}
				<Route path="/mantenedores" element={<Mantenedores />} />
				<Route path="/mantenedores/proveedores" element={<MantProveedores />} />
				<Route path="/mantenedores/catalogos" element={<MantCatalogos />} />
				<Route path="/mantenedores/parametros" element={<MantParametros />} />
				<Route path="/mantenedores/scoring" element={<MantScoring />} />
				<Route path="/mantenedores/usuarios" element={<MantUsuarios />} />
				<Route
					path="/mantenedores/centros-almacenes"
					element={<MantCentrosAlmacenes />}
				/>
				<Route
					path="/mantenedores/familias-categorias"
					element={<MantFamiliasCategorias />}
				/>
				<Route
					path="/mantenedores/tolerancias-diferencias"
					element={<MantToleranciasDiferencias />}
				/>
				<Route
					path="/mantenedores/ventanas-politicas"
					element={<MantVentanasPoliticas />}
				/>
				<Route
					path="/mantenedores/tipos-documento"
					element={<MantTiposDocumento />}
				/>
				<Route
					path="/mantenedores/reglas-documentales"
					element={<MantReglasDocumentales />}
				/>
				<Route
					path="/mantenedores/maquiladores"
					element={<MantMaquiladores />}
				/>
				{/* Portal Proveedor */}
				<Route path="/portal-proveedor" element={<PortalProveedor />} />
				<Route
					path="/portal-proveedor/solicitudes"
					element={<PortalALFA />}
				/>{" "}
				{/* NUEVO */}
				<Route
					path="/portal-proveedor/compromisos"
					element={<PortalCompromisos />}
				/>
				<Route
					path="/portal-proveedor/documentos"
					element={<PortalDocumentos />}
				/>
				<Route path="/portal-proveedor/zc" element={<PortalZC />} />
				<Route
					path="/portal-proveedor/alertas"
					element={<PortalAlertas />}
				/>{" "}
				{/* NUEVO */}
				{/* Planificación */}
				<Route path="/ingesta" element={<IngestaSAP />} />
				<Route path="/alfa" element={<NuevoALFA />} />
				{/* Extensiones */}
				<Route path="/reasignacion" element={<Reasignacion />} />
				<Route path="/alertas-remanente" element={<AlertasRemanente />} />
				{/* 404 */}
				<Route
					path="*"
					element={<div className="p-6">Página no encontrada</div>}
				/>
			</Route>
		</Routes>
	);
}
