import FormMetaInfo from "@/components/shared/FormMetaInfo";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";

type Unidad = "%" | "u" | "";
type Aplica = "Recepción" | "Conciliación" | "";
type Estado = "Activo" | "Inactivo" | "";

interface ToleranciaForm {
	codigo: string;
	concepto: string;
	tolerancia: string; // usar string para inputs controlados; se puede castear a número al guardar
	unidad: Unidad;
	aplica: Aplica;
	estado: Estado;
}

export default function ToleranciasDiferencias() {
	const storageKey = "mant_tolerancias_diferencias";

	const [data, setData] = useState<ToleranciaForm[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [form, setForm] = useState<ToleranciaForm>({
		codigo: "",
		concepto: "",
		tolerancia: "",
		unidad: "",
		aplica: "",
		estado: "",
	});

	// Cargar desde localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved) setData(JSON.parse(saved) as ToleranciaForm[]);
		} catch {}
	}, []);

	// Persistir en localStorage
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(data));
	}, [data]);

	const resetForm = () =>
		setForm({
			codigo: "",
			concepto: "",
			tolerancia: "",
			unidad: "",
			aplica: "",
			estado: "",
		});

	const onAdd = () => {
		setData((d) => [...d, form]);
		resetForm();
	};

	const onUpdate = () => {
		if (editingIndex === null) return;
		setData((d) => d.map((x, i) => (i === editingIndex ? form : x)));
		setEditingIndex(null);
		resetForm();
	};

	const onEdit = (idx: number) => {
		setEditingIndex(idx);
		setForm(data[idx]);
	};

	const onDelete = (idx: number) =>
		setData((d) => d.filter((_, i) => i !== idx));

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Tolerancias de Diferencias — Formulario</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Código */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Código</label>
							<Input
								type="text"
								value={form.codigo}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setForm((prev) => ({ ...prev, codigo: e.target.value }))
								}
							/>
						</div>

						{/* Concepto */}
						<div className="md:col-span-2 flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Concepto</label>
							<Input
								type="text"
								value={form.concepto}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setForm((prev) => ({ ...prev, concepto: e.target.value }))
								}
							/>
						</div>

						{/* Tolerancia */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">
								Tolerancia
							</label>
							<Input
								type="number"
								value={form.tolerancia}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setForm((prev) => ({ ...prev, tolerancia: e.target.value }))
								}
							/>
						</div>

						{/* Unidad */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Unidad</label>
							<Select
								value={form.unidad}
								onValueChange={(v: Unidad) =>
									setForm((prev) => ({ ...prev, unidad: v }))
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
									<SelectItem value="%">%</SelectItem>
									<SelectItem value="u">u</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Aplica a */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Aplica a</label>
							<Select
								value={form.aplica}
								onValueChange={(v: Aplica) =>
									setForm((prev) => ({ ...prev, aplica: v }))
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
									<SelectItem value="Recepción">Recepción</SelectItem>
									<SelectItem value="Conciliación">Conciliación</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Estado */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Estado</label>
							<Select
								value={form.estado}
								onValueChange={(v: Estado) =>
									setForm((prev) => ({ ...prev, estado: v }))
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
									<SelectItem value="Activo">Activo</SelectItem>
									<SelectItem value="Inactivo">Inactivo</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="mt-4 flex gap-2">
						{editingIndex === null ? (
							<Button onClick={onAdd}>Agregar</Button>
						) : (
							<>
								<Button onClick={onUpdate}>Guardar</Button>
								<Button
									variant="secondary"
									onClick={() => {
										setEditingIndex(null);
										resetForm();
									}}
								>
									Cancelar
								</Button>
							</>
						)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Tolerancias de Diferencias — Listado</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><Table>
						<TableHeader>
							<TableRow>
								<TableHead>Código</TableHead>
								<TableHead>Concepto</TableHead>
								<TableHead>Tolerancia</TableHead>
								<TableHead>Unidad</TableHead>
								<TableHead>Aplica</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((row, idx) => (
								<TableRow key={idx}>
									<TableCell>{row.codigo}</TableCell>
									<TableCell>{row.concepto}</TableCell>
									<TableCell>{row.tolerancia}</TableCell>
									<TableCell>{row.unidad}</TableCell>
									<TableCell>{row.aplica}</TableCell>
									<TableCell>{row.estado}</TableCell>
									<TableCell className="space-x-2">
										<Button size="sm" onClick={() => onEdit(idx)}>
											Editar
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => onDelete(idx)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))}
							{data.length === 0 && (
								<TableRow>
									<TableCell colSpan={7}>Sin registros</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
