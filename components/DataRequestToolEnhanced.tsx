import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, AlertCircle, FileText, Database, Clock } from 'lucide-react';
import { TIERS, DATA_REQUIREMENTS } from '../constants';
import { TierKey, AnalysisData } from '../types';
import ProgressStepper from './ProgressStepper';
import TierSelectorEnhanced from './TierSelectorEnhanced';
import DataUploaderEnhanced from './DataUploaderEnhanced';
import DashboardEnhanced from './DashboardEnhanced';
import { generateAnalysis } from '../utils/analysisGenerator';

const DataRequestToolEnhanced: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TierKey>('silver');
  const [view, setView] = useState<'tierSelection' | 'dataUpload' | 'dashboard'>('tierSelection');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentStep = view === 'tierSelection' ? 1 : view === 'dataUpload' ? 2 : 3;

  const handleTierSelect = (tier: TierKey) => {
    setSelectedTier(tier);
  };

  const handleContinueToUpload = () => {
    setView('dataUpload');
  };

  const handleAnalysisReady = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = generateAnalysis(selectedTier);
      setAnalysisData(analysis);
      setIsAnalyzing(false);
      setView('dashboard');
    }, 2000);
  };

  const handleBackToUploader = () => {
    setView('dataUpload');
    setAnalysisData(null);
  };

  const handleBackToTierSelection = () => {
    setView('tierSelection');
  };

  if (view === 'dashboard' && analysisData) {
    return <DashboardEnhanced analysisData={analysisData} onBack={handleBackToUploader} />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-sans">
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Beyond Diagnostic
          </h1>
          <p className="text-lg text-slate-600">
            Análisis de Readiness Agéntico para Contact Centers
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {view === 'tierSelection' && (
            <motion.div
              key="tier-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tier Selection */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <div className="mb-8">
                  <span className="text-blue-600 font-semibold mb-1 block">Paso 1</span>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Selecciona tu Tier de Análisis
                  </h2>
                  <p className="text-slate-600">
                    Elige el nivel de profundidad que necesitas para tu diagnóstico
                  </p>
                </div>

                <TierSelectorEnhanced
                  selectedTier={selectedTier}
                  onSelectTier={handleTierSelect}
                />

                <motion.button
                  onClick={handleContinueToUpload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-lg"
                >
                  Continuar al Paso 2
                </motion.button>
              </div>

              {/* Data Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Database size={24} className="text-blue-600" />
                  Requisitos de Datos - {TIERS[selectedTier].name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Formato</h4>
                      <p className="text-sm text-slate-600">
                        {DATA_REQUIREMENTS[selectedTier].format}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Database className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Volumen Mínimo</h4>
                      <p className="text-sm text-slate-600">
                        {DATA_REQUIREMENTS[selectedTier].volumeMin}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Tiempo de Entrega</h4>
                      <p className="text-sm text-slate-600">
                        {TIERS[selectedTier].timeline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {DATA_REQUIREMENTS[selectedTier].mandatory.map((category, idx) => (
                    <details
                      key={idx}
                      className="group bg-slate-50 rounded-lg overflow-hidden"
                    >
                      <summary className="cursor-pointer p-4 font-semibold text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-between">
                        <span>{category.category}</span>
                        <span className="text-xs text-slate-500">
                          {category.fields.length} campos
                        </span>
                      </summary>
                      <div className="p-4 pt-0 space-y-2">
                        {category.fields.map((field, fieldIdx) => (
                          <div
                            key={fieldIdx}
                            className="flex items-start gap-3 p-3 bg-white rounded-lg"
                          >
                            {field.critical ? (
                              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                            ) : (
                              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm font-semibold text-slate-900">
                                  {field.name}
                                </span>
                                {field.critical && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                                    Obligatorio
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mb-1">
                                Tipo: <span className="font-semibold">{field.type}</span>
                              </p>
                              <p className="text-xs text-slate-500">
                                Ejemplo: <span className="font-mono">{field.example}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>

                <motion.a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Descarga de plantilla próximamente...');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors shadow-sm font-semibold"
                >
                  <Download size={20} />
                  Descargar Plantilla CSV
                </motion.a>
              </motion.div>
            </motion.div>
          )}

          {view === 'dataUpload' && (
            <motion.div
              key="data-upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DataUploaderEnhanced
                selectedTier={selectedTier}
                onAnalysisReady={handleAnalysisReady}
                isAnalyzing={isAnalyzing}
              />

              <motion.button
                onClick={handleBackToTierSelection}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-slate-700 px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-50 transition-colors shadow-sm font-semibold"
              >
                ← Volver a Selección de Tier
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DataRequestToolEnhanced;
