import { Route, Routes } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Compromisos from "@/pages/Compromisos";
import OCList from "@/modules/oc/OCList";
import TableroOperativoPage from "@/pages/TableroOperativo"; // 👈 nuevo
import Recepciones from "@/pages/Recepciones";
import NoConformidades from "@/pages/NoConformidades";
import Documentos from "@/pages/Documentos";
import Proveedores from "@/pages/Proveedores";
import Alertas from "@/pages/Alertas";


export default function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/oc" element={<OCList />} />
				<Route path="/compromisos" element={<Compromisos />} />
				<Route
					path="/tablero-operativo"
					element={<TableroOperativoPage />}
				/>{" "}
				<Route path="/recepciones" element={<Recepciones />} />
				<Route path="/zc" element={<NoConformidades />} />
				<Route path="/documentos" element={<Documentos />} />
				<Route path="/proveedores" element={<Proveedores />} />
				<Route path="/alertas" element={<Alertas />} />
				{/* 👈 nuevo */}
				{/* 404 simple */}
				<Route
					path="*"
					element={<div className="p-6">Página no encontrada</div>}
				/>
			</Route>
		</Routes>
	);
}
