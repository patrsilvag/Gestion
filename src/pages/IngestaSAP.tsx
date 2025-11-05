import React, { useState } from 'react';

const IngestaSAP: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files);
  const procesar = async () => {
    if (!files || files.length === 0) return alert('Selecciona archivos MD07/MD04, ME2M/ME21N, MIGO/MB51 (CSV/XLSX).');
    const names = Array.from(files).map(f => '• ' + f.name);
    setLog(['Archivos cargados:', ...names, 'Normalizando y validando...', '✅ Ingesta simulada.']);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Ingesta / Planificación (SAP)</h1>
      <input type="file" multiple accept=".csv,.xlsx,.xls" onChange={onChange} className="block border p-2 rounded w-full max-w-xl" />
      <button onClick={procesar} className="px-4 py-2 bg-blue-600 text-white rounded">Procesar archivos</button>
      {log.length>0 && <pre className="bg-gray-50 border rounded p-3 text-sm whitespace-pre-wrap">{log.join('\n')}</pre>}
    </div>
  );
};

export default IngestaSAP;
