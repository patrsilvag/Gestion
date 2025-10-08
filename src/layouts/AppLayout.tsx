import type { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout({ children }: { children?: ReactNode }) {
	// Con <Outlet/> usamos routing anidado; si hay children, los mostramos como fallback
	return (
		<div className="flex h-screen flex-col">
			<header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<h1 className="text-xl font-bold">Gestión OC</h1>
					<nav className="hidden space-x-4 md:flex">
						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/oc"
						>
							OC
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/compromisos"
						>
							Compromisos
						</NavLink>

						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/recepciones"
						>
							Recepciones
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/zc"
						>
							No Conformidades
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/documentos"
						>
							Documentos
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/proveedores"
						>
							Proveedores
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/alertas"
						>
							Alertas
						</NavLink>

						<NavLink
							className={({ isActive }) =>
								isActive ? "underline" : "hover:underline"
							}
							to="/dashboard"
						>
							Dashboard
						</NavLink>
					</nav>
					<div className="text-sm">Usuario: Admin</div>
				</div>
			</header>

			<main className="flex-grow overflow-auto bg-white p-4 md:p-8">
				{/* Si usas rutas anidadas, renderiza aquí */}
				<Outlet />
				{/* Por compatibilidad, si alguien te manda children directamente */}
				{children}
			</main>
		</div>
	);
}
