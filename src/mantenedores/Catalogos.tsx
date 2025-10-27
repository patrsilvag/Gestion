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

type TipoCatalogo = "Reprogramación" | "Rechazo" | "ZC" | "";
type Penaliza = "Sí" | "No" | "";
type Estado = "Activo" | "Inactivo" | "";

interface CatalogoForm {
	tipo: TipoCatalogo;
	codigo: string;
	descripcion: string;
	penaliza: Penaliza;
	estado: Estado;
}

export default function Catalogos() {
	const storageKey = "mant_catalogos";
	const [data, setData] = useState<CatalogoForm[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [form, setForm] = useState<CatalogoForm>({
		tipo: "",
		codigo: "",
		descripcion: "",
		penaliza: "",
		estado: "",
	});

	useEffect(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved) setData(JSON.parse(saved) as CatalogoForm[]);
		} catch {}
	}, []);
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(data));
	}, [data]);

	const resetForm = () =>
		setForm({
			tipo: "",
			codigo: "",
			descripcion: "",
			penaliza: "",
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
					<CardTitle>Catalogos — Formulario</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Tipo */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Tipo</label>
							<Select
								value={form.tipo}
								onValueChange={(v: TipoCatalogo) =>
									setForm((prev) => ({ ...prev, tipo: v }))
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
									<SelectItem value="Reprogramación">Reprogramación</SelectItem>
									<SelectItem value="Rechazo">Rechazo</SelectItem>
									<SelectItem value="ZC">ZC</SelectItem>
								</SelectContent>
							</Select>
						</div>

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

						{/* Penaliza KPI */}
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">
								Penaliza KPI
							</label>
							<Select
								value={form.penaliza}
								onValueChange={(v: Penaliza) =>
									setForm((prev) => ({ ...prev, penaliza: v }))
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent className="z-50 z-[9999]" position="popper" side="bottom" sideOffset={4}>
									<SelectItem value="Sí">Sí</SelectItem>
									<SelectItem value="No">No</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Descripción */}
						<div className="md:col-span-2 flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">
								Descripción
							</label>
							<Input
								type="text"
								value={form.descripcion}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setForm((prev) => ({ ...prev, descripcion: e.target.value }))
								}
							/>
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
					<CardTitle>Catalogos — Listado</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tipo</TableHead>
								<TableHead>Código</TableHead>
								<TableHead>Descripción</TableHead>
								<TableHead>Penaliza</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((row, idx) => (
								<TableRow key={idx}>
									<TableCell>{row.tipo}</TableCell>
									<TableCell>{row.codigo}</TableCell>
									<TableCell>{row.descripcion}</TableCell>
									<TableCell>{row.penaliza}</TableCell>
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
									<TableCell colSpan={6}>Sin registros</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
