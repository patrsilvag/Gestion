import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
type Props = { onFiles?: (files: FileList) => void; label?: string; accept?: string; };
export default function UploadExcelButton({ onFiles, label, accept }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick = () => inputRef.current?.click();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles?.(e.target.files);
      console.log("Archivos seleccionados:", Array.from(e.target.files).map(f => f.name));
      e.currentTarget.value = "";
    }
  };
  return (<>
    <input ref={inputRef} type="file" multiple accept={accept || ".csv,.xlsx,.xls"} onChange={onChange} className="hidden"/>
    <Button type="button" variant="secondary" onClick={onClick}>{label || "Importar CSV/XLSX"}</Button>
  </>);
}