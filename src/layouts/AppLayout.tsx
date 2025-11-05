import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout({ children }: { children?: ReactNode }) {
	const [open, setOpen] = useState(false);

	const linkCls = ({ isActive }: { isActive: boolean }) =>
		[
			"px-3 py-1.5 rounded-full text-sm transition",
			isActive ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-50",
		].join(" ");

	const ddBtn =
		"px-3 py-1.5 rounded-full bg-white border hover:bg-gray-50 text-sm";

	return (
		<div className="flex h-screen flex-col">
			{/* Header */}
			<header className="sticky top-0 z-[100] w-full border-b bg-white">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
					{/* Branding */}
					<div className="flex items-center gap-2">
						<span className="text-base font-semibold">Gestión OC</span>
					</div>

					{/* Botón mobile */}
					<button
						className="md:hidden rounded-md border px-3 py-1.5 text-sm"
						onClick={() => setOpen((v) => !v)}
						aria-label="Abrir menú"
						aria-expanded={open}
					>
						Menú
					</button>

					{/* Menú principal (desktop) */}
					<nav className="hidden md:flex flex-wrap items-center gap-3">
						{/* Planificación */}
						<div className="relative group">
							<button
								className={ddBtn}
								aria-haspopup="menu"
								aria-expanded="false"
							>
								Planificación
							</button>
							<div
								className="absolute right-0 z-[9999] hidden min-w-[240px] flex-col rounded-md border bg-white p-2 text-sm shadow-md group-hover:flex"
								role="menu"
							>
								<div className="px-2 pb-1 text-xs font-semibold text-slate-500">
									Datos y solicitud
								</div>
								<NavLink
									to="/ingesta"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Ingesta (SAP)
								</NavLink>
								<NavLink
									to="/alfa"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Solicitud ALFA
								</NavLink>
								<NavLink
									to="/portal-proveedor"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Portal Proveedor
								</NavLink>
							</div>
						</div>

						{/* Operación */}
						<div className="relative group">
							<button
								className={ddBtn}
								aria-haspopup="menu"
								aria-expanded="false"
							>
								Operación
							</button>
							<div
								className="absolute right-0 z-[9999] hidden min-w-[280px] flex-col rounded-md border bg-white p-2 text-sm shadow-md group-hover:flex"
								role="menu"
							>
								<NavLink to="/oc" className="px-2 py-1 rounded hover:bg-muted">
									OC
								</NavLink>
								<NavLink
									to="/compromisos"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Compromisos
								</NavLink>
								<NavLink
									to="/recepciones"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Recepciones
								</NavLink>
								<NavLink to="/zc" className="px-2 py-1 rounded hover:bg-muted">
									No Conformidades
								</NavLink>
								<NavLink
									to="/documentos"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Documentos
								</NavLink>
								<NavLink
									to="/proveedores"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Proveedores
								</NavLink>
								<NavLink
									to="/alertas"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Alertas
								</NavLink>
							</div>
						</div>

						{/* Dashboard */}
						<div className="relative group">
							<button
								className={ddBtn}
								aria-haspopup="menu"
								aria-expanded="false"
							>
								Dashboard
							</button>
							<div
								className="absolute right-0 z-[9999] hidden min-w-[240px] flex-col rounded-md border bg-white p-2 text-sm shadow-md group-hover:flex"
								role="menu"
							>
								<NavLink
									to="/"
									end
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Dashboard General
								</NavLink>
								<NavLink
									to="/tablero-operativo"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Tablero Operativo
								</NavLink>
								<NavLink
									to="/reportes"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Reportes
								</NavLink>
							</div>
						</div>

						{/* Maquila */}
						<div className="relative group">
							<button
								className={ddBtn}
								aria-haspopup="menu"
								aria-expanded="false"
							>
								Maquila
							</button>
							<div
								className="absolute right-0 z-[9999] hidden min-w-[240px] flex-col rounded-md border bg-white p-2 text-sm shadow-md group-hover:flex"
								role="menu"
							>
								<NavLink
									to="/maquila"
									end
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Contratos Marco
								</NavLink>
								<NavLink
									to="/maquila/actas"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Conciliación Actas
								</NavLink>
							</div>
						</div>

						{/* Mantenedores */}
						<div className="relative group">
							<button
								className={ddBtn}
								aria-haspopup="menu"
								aria-expanded="false"
							>
								Mantenedores
							</button>
							<div
								className="absolute right-0 z-[9999] hidden min-w-[300px] flex-col rounded-md border bg-white p-2 text-sm shadow-md group-hover:flex"
								role="menu"
							>
								<NavLink
									to="/mantenedores/proveedores"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Proveedores
								</NavLink>
								<NavLink
									to="/mantenedores/catalogos"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Catálogos
								</NavLink>
								<NavLink
									to="/mantenedores/parametros"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Parámetros
								</NavLink>
								<NavLink
									to="/mantenedores/scoring"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Scoring
								</NavLink>
								<NavLink
									to="/mantenedores/usuarios"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Usuarios
								</NavLink>
								<div className="my-1 border-t" />
								<NavLink
									to="/mantenedores/centros-almacenes"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Centros y Almacenes
								</NavLink>
								<NavLink
									to="/mantenedores/familias-categorias"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Familias y Categorías
								</NavLink>
								<NavLink
									to="/mantenedores/tolerancias-diferencias"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Tolerancias de Diferencias
								</NavLink>
								<NavLink
									to="/mantenedores/ventanas-politicas"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Ventanas Alfa/TIF y Políticas
								</NavLink>
								<NavLink
									to="/mantenedores/tipos-documento"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Tipos de Documento
								</NavLink>
								<NavLink
									to="/mantenedores/reglas-documentales"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Reglas Documentales
								</NavLink>
								<NavLink
									to="/mantenedores/maquiladores"
									className="px-2 py-1 rounded hover:bg-muted"
								>
									Maquiladores
								</NavLink>
							</div>
						</div>

						{/* Usuario */}
						<div className="text-xs text-muted-foreground ml-2">
							Usuario: Admin
						</div>
					</nav>
				</div>

				{/* Menú mobile */}
				{open && (
					<div className="md:hidden border-t bg-white">
						<div className="mx-auto max-w-7xl px-4 py-3 space-y-4">
							{/* Planificación */}
							<div>
								<div className="text-xs font-semibold text-slate-500 mb-2">
									Planificación
								</div>
								<div className="flex flex-wrap gap-2">
									<NavLink
										to="/ingesta"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Ingesta (SAP)
									</NavLink>
									<NavLink
										to="/alfa"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Solicitud ALFA
									</NavLink>
									<NavLink
										to="/portal-proveedor"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Portal Proveedor
									</NavLink>
								</div>
							</div>

							{/* Operación */}
							<div>
								<div className="text-xs font-semibold text-slate-500 mb-2">
									Operación
								</div>
								<div className="flex flex-wrap gap-2">
									<NavLink
										to="/oc"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										OC
									</NavLink>
									<NavLink
										to="/compromisos"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Compromisos
									</NavLink>
									<NavLink
										to="/recepciones"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Recepciones
									</NavLink>
									<NavLink
										to="/zc"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										No Conformidades
									</NavLink>
									<NavLink
										to="/documentos"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Documentos
									</NavLink>
									<NavLink
										to="/proveedores"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Proveedores
									</NavLink>
									<NavLink
										to="/alertas"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Alertas
									</NavLink>
								</div>
							</div>

							{/* Dashboard */}
							<div>
								<div className="text-xs font-semibold text-slate-500 mb-2">
									Dashboard
								</div>
								<div className="flex flex-wrap gap-2">
									<NavLink
										to="/"
										end
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Dashboard General
									</NavLink>
									<NavLink
										to="/tablero-operativo"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Tablero Operativo
									</NavLink>
									<NavLink
										to="/reportes"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Reportes
									</NavLink>
								</div>
							</div>

							{/* Maquila */}
							<div>
								<div className="text-xs font-semibold text-slate-500 mb-2">
									Maquila
								</div>
								<div className="flex flex-wrap gap-2">
									<NavLink
										to="/maquila"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Contratos Marco
									</NavLink>
									<NavLink
										to="/maquila/actas"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Conciliación Actas
									</NavLink>
								</div>
							</div>

							{/* Mantenedores */}
							<div>
								<div className="text-xs font-semibold text-slate-500 mb-2">
									Mantenedores
								</div>
								<div className="flex flex-wrap gap-2">
									<NavLink
										to="/mantenedores"
										className={linkCls}
										onClick={() => setOpen(false)}
									>
										Mantenedores
									</NavLink>
								</div>
							</div>
						</div>
					</div>
				)}
			</header>

			{/* Contenido */}
			<main className="flex-1 overflow-auto bg-white p-4 md:p-8">
				<Outlet />
				{children}
			</main>
		</div>
	);
}
