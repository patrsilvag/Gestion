import * as React from "react";
type Props = { className?: string };
export function MainNav({ className }: Props) {
  return (
    <nav className={className}>
      <ul className="flex gap-4">
        <li><a href="/" className="hover:underline">Inicio</a></li>
        <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
        <li><a href="/documentos" className="hover:underline">Documentos</a></li>
      </ul>
    </nav>
  );
}
export default MainNav;
