// src/modules/recepcion/ReceptionQualityCheck.tsx
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export default function ReceptionQualityCheck() {
  // Estado para la cantidad recibida, conformidad, y guía de despacho
  const form = useForm(); // Hook de manejo de formularios (shadcn/ui/react-hook-form)

  const onSubmit = (values) => {
    // 1. Lógica BE-05: Subir Guía de Despacho (RN4, E2)
    // 2. Lógica BE-06: Registrar Recepción
    
    if (values.conformidad === 'No Conforme') {
      // Abrir modal o sección para crear ZC (Zona de No Conformidad)
      // Lógica BE-06: Apertura ZC con motivo y evidencias
      alert('Recepción No Conforme. ZC abierto.');
    } else {
      // Lógica BE-04: Actualizar Saldos/Stock (SAP)
      alert('Recepción Conforme. Stock actualizado.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField name="guideNumber" render={({ field }) => ( ... )} /> {/* Input para Guía */}
        <FormField name="receivedQty" render={({ field }) => ( ... )} /> {/* Cantidad Recibida (parcial posible) */}

        <FormField name="conformidad" render={({ field }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
            <FormLabel>Control de Calidad</FormLabel>
            <RadioGroupItem value="Conforme" id="conforme" /> <Label htmlFor="conforme">Conforme</Label>
            <RadioGroupItem value="No Conforme" id="noConforme" /> <Label htmlFor="noConforme">No Conforme (Abre ZC)</Label>
          </RadioGroup>
        )} />

        {form.watch('conformidad') === 'No Conforme' && (
          <FormField name="rejectionReason" render={() => (
            <Textarea placeholder="Motivo de No Conformidad (ZC)" />
          )} />
        )}
        <Button type="submit">Registrar Recepción</Button>
      </form>
    </Form>
  );
}