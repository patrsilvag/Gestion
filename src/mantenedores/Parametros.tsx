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

type Unidad = "días" | "%" | "u" | "";
interface ParametroForm {
	clave: string;
	descripcion: string;
	valor: string; // como texto para evitar NaN en onChange
	unidad: Unidad;
}

export default function Parametros() {
	const storageKey = "mant_parametros";
	const [data, setData] = useState<ParametroForm[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [form, setForm] = useState<ParametroForm>({
		clave: "",
		descripcion: "",
		valor: "",
		unidad: "",
	});

	useEffect(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved) setData(JSON.parse(saved) as ParametroForm[]);
		} catch {}
	}, []);

	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(data));
	}, [data]);

	const resetForm = () =>
		setForm({ clave: "", descripcion: "", valor: "", unidad: "" });

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
					<CardTitle>Parámetros — Formulario</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Clave</label>
							<Input
								type="text"
								value={form.clave}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setForm((prev) => ({ ...prev, clave: e.target.value }))
								}
							/>
						</div>

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

						<div className="flex flex-col gap-1">
							<label className="text-xs text-muted-foreground">Valor</label>
							<Input
								type="number"
								value={form.valor}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setForm((prev) => ({ ...prev, valor: e.target.value }))
								}
							/>
						</div>

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
									<SelectItem value="días">días</SelectItem>
									<SelectItem value="%">%</SelectItem>
									<SelectItem value="u">u</SelectItem>
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
					<CardTitle>Parámetros — Listado</CardTitle>
				</CardHeader>
				<CardContent className="overflow-visible"><Table>
						<TableHeader>
							<TableRow>
								<TableHead>Clave</TableHead>
								<TableHead>Descripción</TableHead>
								<TableHead>Valor</TableHead>
								<TableHead>Unidad</TableHead>
								<TableHead>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((row, idx) => (
								<TableRow key={idx}>
									<TableCell>{row.clave}</TableCell>
									<TableCell>{row.descripcion}</TableCell>
									<TableCell>{row.valor}</TableCell>
									<TableCell>{row.unidad}</TableCell>
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
									<TableCell colSpan={5}>Sin registros</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
