import FormMetaInfo from "@/components/shared/FormMetaInfo";
// src/maquila/MaquilaConciliation.tsx
import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ReconciliationResult = {
	differences: number;
	status: "Sin Diferencias" | "Diferencias Detectadas";
	suggestedAdjustment: string;
};

export default function MaquilaConciliation() {
	// ❱ Tipamos el estado para que setState acepte el objeto y no infiera null-only
	const [reconciliationData, setReconciliationData] =
		useState<ReconciliationResult | null>(null);

	// ❱ Usamos un ref para evitar pasar un MouseEvent a handleImport
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImport = (file: File) => {
		// Lógica BE-11: Importar movimientos del maquilador
		// Procesamiento: Cruce contra stock/guías internas

		// Simulación del resultado:
		setReconciliationData({
			differences: 50, // Ejemplo
			status: "Diferencias Detectadas",
			suggestedAdjustment: "Creación de NC-XXX y ajuste de saldo.",
		});
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// ❱ e.target.files puede ser null: chequeo seguro
		const file = e.target.files?.[0];
		if (!file) return;
		handleImport(file);
		// opcional: limpiar input para poder subir el mismo archivo de nuevo
		e.currentTarget.value = "";
	};

	const handleGenerateActa = () => {
		// Lógica BE-11: Generar el 'Acta' de conciliación (RN)
		alert("Acta generada y enviada a aprobación.");
	};

	const triggerFileDialog = () => fileInputRef.current?.click();

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Conciliación de Inventario y Movimientos de Maquila
				</CardTitle>
				<CardDescription>
					Cargar movimientos del período para cruzar contra stock y guías.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4 overflow-visible">
          <FormMetaInfo menu="/maquilaconciliation" fuentes="UI" carga="Formulario / Consulta" />
				{/* Input oculto, activado por el botón */}
				<Input
					type="file"
					ref={fileInputRef}
					onChange={onFileChange}
					accept=".csv,.xlsx"
					className="hidden"
				/>

				<Button onClick={triggerFileDialog} variant="outline">
					<Upload className="mr-2 h-4 w-4" /> Importar Movimientos
				</Button>

				{reconciliationData && (
					<Alert>
						<AlertTitle
							className={
								reconciliationData.differences > 0
									? "text-destructive"
									: "text-primary"
							}
						>
							Resultado de la Conciliación
						</AlertTitle>
						<AlertDescription>
							<p>
								<strong>Estado:</strong> {reconciliationData.status}.
							</p>
							<p>
								<strong>Diferencia Total:</strong>{" "}
								{reconciliationData.differences} unidades.
							</p>
							<p>
								Propuesta de Ajuste: {reconciliationData.suggestedAdjustment}
							</p>
							<Button
								className="mt-2 bg-primary hover:bg-primary/90"
								onClick={handleGenerateActa}
							>
								Generar Acta de Conciliación
							</Button>
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
			{/* Lógica BE-11: API Conciliación Maquila */}
		</Card>
	);
}