import type { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout({ children }: { children?: ReactNode }) {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "underline underline-offset-4" : "hover:underline";

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-[100] w-full border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">Gestión OC</span>
          </div>

          {/* Main nav */}
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink to="/oc" className={linkCls}>OC</NavLink>
            <NavLink to="/compromisos" className={linkCls}>Compromisos</NavLink>
            <NavLink to="/recepciones" className={linkCls}>Recepciones</NavLink>
            <NavLink to="/zc" className={linkCls}>No Conformidades</NavLink>
            <NavLink to="/documentos" className={linkCls}>Documentos</NavLink>
            <NavLink to="/proveedores" className={linkCls}>Proveedores</NavLink>
            <NavLink to="/alertas" className={linkCls}>Alertas</NavLink>
            <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>

            {/* Mantenedores */}
            <div className="relative group">
              <button
                className="hover:underline"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                Mantenedores
              </button>
              <div
                className="absolute right-0 z-[9999] hidden min-w-[280px] flex-col rounded-md border bg-white p-2 text-sm shadow-md group-hover:flex"
                role="menu"
              >
                <NavLink to="/mantenedores/proveedores" className="px-2 py-1 rounded hover:bg-muted">Proveedores</NavLink>
                <NavLink to="/mantenedores/catalogos" className="px-2 py-1 rounded hover:bg-muted">Catálogos</NavLink>
                <NavLink to="/mantenedores/parametros" className="px-2 py-1 rounded hover:bg-muted">Parámetros</NavLink>
                <NavLink to="/mantenedores/scoring" className="px-2 py-1 rounded hover:bg-muted">Scoring</NavLink>
                <NavLink to="/mantenedores/usuarios" className="px-2 py-1 rounded hover:bg-muted">Usuarios</NavLink>
                <div className="my-1 border-t" />
                <NavLink to="/mantenedores/centros-almacenes" className="px-2 py-1 rounded hover:bg-muted">Centros y Almacenes</NavLink>
                <NavLink to="/mantenedores/familias-categorias" className="px-2 py-1 rounded hover:bg-muted">Familias y Categorías</NavLink>
                <NavLink to="/mantenedores/tolerancias-diferencias" className="px-2 py-1 rounded hover:bg-muted">Tolerancias de Diferencias</NavLink>
                <NavLink to="/mantenedores/ventanas-politicas" className="px-2 py-1 rounded hover:bg-muted">Ventanas Alfa/TIF y Políticas</NavLink>
                <NavLink to="/mantenedores/tipos-documento" className="px-2 py-1 rounded hover:bg-muted">Tipos de Documento</NavLink>
                <NavLink to="/mantenedores/reglas-documentales" className="px-2 py-1 rounded hover:bg-muted">Reglas Documentales</NavLink>
                <NavLink to="/mantenedores/maquiladores" className="px-2 py-1 rounded hover:bg-muted">Maquiladores</NavLink>
              </div>
            </div>
          </nav>

          {/* Usuario (placeholder) */}
          <div className="text-xs text-muted-foreground">Usuario: Admin</div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-white p-4 md:p-8">
        <Outlet />
        {children}
      </main>
    </div>
  );
}
