// SAP client stubs
export async function importarOC(){return [{oc:"4500000001",proveedor:"PROV-001",estado:"Activa"}];}
export async function exportarConfirmaciones(payload:any){return {ok:true,enviado:payload};}
export async function crearNotaCredito(zcId:string){return {numeroNC:"NC-0001",zcId};}
