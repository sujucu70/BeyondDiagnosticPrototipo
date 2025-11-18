import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, FileText, Database, Clock } from 'lucide-react';
import { TIERS, DATA_REQUIREMENTS } from '../constants';
import { TierKey, AnalysisData } from '../types';
import DataUploader from './DataUploader';
import DashboardEnhanced from './DashboardEnhanced';
import { generateAnalysis } from '../utils/analysisGenerator';

const DataRequestTool: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TierKey>('silver');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [view, setView] = useState<'uploader' | 'dashboard'>('uploader');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentTierData = DATA_REQUIREMENTS[selectedTier];
  const currentTierInfo = TIERS[selectedTier];

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const handleDownload = () => {
    const headers = currentTierData.mandatory
      .flatMap((category) => category.fields.map((field) => field.name))
      .join(',');
    const blob = new Blob([headers], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plantilla_analisis_${selectedTier}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAnalysisReady = () => {
    setIsAnalyzing(true);
    // Simulate analysis processing time
    setTimeout(() => {
      const data = generateAnalysis(selectedTier);
      setAnalysisData(data);
      setView('dashboard');
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleBackToUploader = () => {
    setView('uploader');
    setAnalysisData(null);
  };
  
  if (view === 'dashboard' && analysisData) {
    return <DashboardEnhanced analysisData={analysisData} onBack={handleBackToUploader} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Beyond Diagnostic - Proceso de Análisis
        </h1>
        <p className="text-slate-600">
          Sigue los pasos para completar tu análisis de diagnóstico.
        </p>
      </header>

      {/* Tier Selection */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(Object.keys(TIERS) as TierKey[]).map((key) => {
          const tier = TIERS[key];
          return (
            <button
              key={key}
              onClick={() => setSelectedTier(key)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedTier === key
                  ? 'border-blue-500 bg-white shadow-lg scale-105'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg ${tier.color} mb-4 flex items-center justify-center`}>
                <Database className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">{tier.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">{tier.price}</p>
              <p className="text-sm text-slate-600 mb-3 h-10">{tier.description}</p>
              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>{tier.timeline}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{tier.requirements}</span>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Requirements Detail (Step 1) */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <span className="text-blue-600 font-semibold mb-1 block">Paso 1</span>
            <h2 className="text-2xl font-bold text-slate-900">
              Prepara tus Datos - {currentTierInfo.name}
            </h2>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Download size={20} />
            Descargar Plantilla CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <div className="text-sm text-slate-600 mb-1">Formato</div>
            <div className="font-semibold text-slate-900">{currentTierData.format}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Volumen Mínimo</div>
            <div className="font-semibold text-slate-900">{currentTierData.volumeMin}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Timeline Análisis</div>
            <div className="font-semibold text-slate-900">{currentTierInfo.timeline}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {currentTierData.mandatory.map((category, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(idx)}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-lg font-medium text-slate-800">{category.category}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {category.fields.length} campos
                  </span>
                </div>
                <span className="text-2xl text-slate-400 font-light">
                  {expandedSection === idx ? '−' : '+'}
                </span>
              </button>
              
              {expandedSection === idx && (
                <div className="p-4 overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="text-left text-sm text-slate-600 border-b border-slate-200">
                        <th className="pb-2 font-medium w-1/4">Campo</th>
                        <th className="pb-2 font-medium w-1/4">Tipo</th>
                        <th className="pb-2 font-medium w-1/4">Ejemplo</th>
                        <th className="pb-2 font-medium w-1/4">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.fields.map((field, fieldIdx) => (
                        <tr key={fieldIdx} className="border-b border-slate-200 last:border-0">
                          <td className="py-3 font-mono text-sm text-slate-900">{field.name}</td>
                          <td className="py-3 text-sm text-slate-600">{field.type}</td>
                          <td className="py-3 text-xs text-slate-500 font-mono">{field.example}</td>
                          <td className="py-3">
                            {field.critical ? (
                              <div className="flex items-center gap-1.5 text-red-600">
                                <AlertCircle size={14} />
                                <span className="text-xs font-semibold tracking-wide">CRÍTICO</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-green-600">
                                <CheckCircle size={14} />
                                <span className="text-xs font-medium">Opcional</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Notas Importantes
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800 list-disc list-inside">
            <li>Los campos marcados como <strong>CRÍTICOS</strong> son obligatorios para el análisis.</li>
            <li>Los campos opcionales enriquecen el análisis pero no son bloqueantes.</li>
            <li>Si tu sistema no tiene algún campo crítico, contáctanos para ver alternativas.</li>
            <li>Todos los datos serán tratados bajo estricta confidencialidad (NDA incluido).</li>
            <li>Período recomendado: 6 meses de datos históricos (mínimo 3 meses).</li>
          </ul>
        </div>
      </section>

      {/* Data Uploader (Step 2) */}
      <section className="mb-8">
        <DataUploader 
            selectedTier={selectedTier} 
            onAnalysisReady={handleAnalysisReady}
            isAnalyzing={isAnalyzing}
        />
      </section>

      {/* Next Steps (Updated) */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Resumen del Proceso</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="text-4xl font-bold mb-2">1</div>
            <h4 className="font-semibold mb-2">Descarga Plantilla</h4>
            <p className="text-sm text-blue-100">
              Usa nuestra plantilla para asegurar que tus datos tienen el formato correcto.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold mb-2">2</div>
            <h4 className="font-semibold mb-2">Sube tus Datos</h4>
            <p className="text-sm text-blue-100">
              Arrastra tu fichero, genera datos de ejemplo o enlaza tu Google Sheet.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold mb-2">3</div>
            <h4 className="font-semibold mb-2">Recibe el Diagnóstico</h4>
            <p className="text-sm text-blue-100">
              Nuestro equipo analizará los datos y recibirás tu informe en {currentTierInfo.timeline}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataRequestTool;
