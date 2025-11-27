import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, AlertCircle, FileText, Database, Clock, UploadCloud, File, Sheet, Loader2, Sparkles, Wand2, BarChart3, X } from 'lucide-react';
import { TIERS, DATA_REQUIREMENTS } from '../constants';
import { TierKey, AnalysisData } from '../types';
import TierSelectorEnhanced from './TierSelectorEnhanced';
import DashboardReorganized from './DashboardReorganized';
import { generateAnalysis } from '../utils/analysisGenerator';
import { generateSyntheticCsv } from '../utils/syntheticDataGenerator';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';

type UploadStatus = 'idle' | 'generating' | 'uploading' | 'success';

const formatFileSize = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const SinglePageDataRequest: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TierKey>('silver');
  const [view, setView] = useState<'form' | 'dashboard'>('form');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [isDragging, setIsDragging] = useState(false);
  
  // Configuration states
  const [costPerHour, setCostPerHour] = useState<number>(20);
  const [avgCsat, setAvgCsat] = useState<number>(85);
  const [highValueQueues, setHighValueQueues] = useState<string>('');
  const [mediumValueQueues, setMediumValueQueues] = useState<string>('');
  const [lowValueQueues, setLowValueQueues] = useState<string>('');

  const isActionInProgress = status === 'generating' || status === 'uploading' || isAnalyzing;
  const hasDataSource = file || sheetUrl || status === 'success';

  const handleTierSelect = (tier: TierKey) => {
    setSelectedTier(tier);
  };

  const resetUploadState = (clearAll: boolean = true) => {
    setStatus('idle');
    if (clearAll) {
      setFile(null);
      setSheetUrl('');
    }
  };

  const handleDataReady = (message: string) => {
    setStatus('success');
    toast.success(message, {
      icon: '✅',
      duration: 3000,
    });
  };

  const handleFileChange = (selectedFile: File | null) => {
    resetUploadState();
    if (selectedFile) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (allowedTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.csv') || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setSheetUrl('');
        toast.success(`Archivo "${selectedFile.name}" cargado correctamente`, {
          icon: '📄',
        });
      } else {
        toast.error('Tipo de archivo no válido. Sube un CSV o Excel.', {
          icon: '❌',
        });
        setFile(null);
      }
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isActionInProgress) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isActionInProgress) return;
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleGenerateSyntheticData = () => {
    resetUploadState();
    setStatus('generating');
    toast.loading('Generando datos sintéticos...', { id: 'generating' });
    
    setTimeout(() => {
      const csvData = generateSyntheticCsv(selectedTier);
      console.log(`Generated ${csvData.split('\n').length} rows of synthetic data for tier: ${selectedTier}`);
      toast.dismiss('generating');
      handleDataReady('¡Datos Sintéticos Generados!');
    }, 2000);
  };

  const handleGenerateAnalysis = () => {
    if (!hasDataSource) {
      toast.error('Por favor, sube un archivo, introduce una URL o genera datos sintéticos.', {
        icon: '⚠️',
      });
      return;
    }
    
    setIsAnalyzing(true);
    toast.loading('Generando análisis...', { id: 'analyzing' });
    
    setTimeout(() => {
      // Preparar segment_mapping si hay colas definidas
      const segmentMapping = (highValueQueues || mediumValueQueues || lowValueQueues) ? {
        high_value_queues: highValueQueues.split(',').map(q => q.trim()).filter(q => q),
        medium_value_queues: mediumValueQueues.split(',').map(q => q.trim()).filter(q => q),
        low_value_queues: lowValueQueues.split(',').map(q => q.trim()).filter(q => q)
      } : undefined;
      
      const analysis = generateAnalysis(selectedTier, costPerHour, avgCsat, segmentMapping);
      setAnalysisData(analysis);
      setIsAnalyzing(false);
      toast.dismiss('analyzing');
      toast.success('¡Análisis completado!', { icon: '🎉' });
      setView('dashboard');
    }, 2000);
  };

  const handleBackToForm = () => {
    setView('form');
    setAnalysisData(null);
  };

  if (view === 'dashboard' && analysisData) {
    return <DashboardReorganized analysisData={analysisData} onBack={handleBackToForm} />;
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-[#E8EBFA] to-slate-100 font-sans">
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Beyond Diagnostic
            </h1>
            <p className="text-lg text-slate-600">
              Análisis de Readiness Agéntico para Contact Centers
            </p>
          </motion.div>

          {/* Tier Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-8">
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
          </motion.div>

          {/* Data Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Database size={24} className="text-[#6D84E3]" />
              Requisitos de Datos - {TIERS[selectedTier].name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8EBFA] flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#6D84E3]" size={20} />
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

            {/* Download Template Button */}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.success('Descarga de plantilla próximamente...', { icon: '📥' });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mb-6 flex items-center justify-center gap-2 w-full bg-[#6D84E3] text-white px-6 py-3 rounded-lg hover:bg-[#5669D0] transition-colors shadow-md font-semibold"
            >
              <Download size={20} />
              Descargar Plantilla CSV
            </motion.a>

            {/* Data Categories - Fields as Horizontal Cards */}
            <div className="space-y-4">
              {DATA_REQUIREMENTS[selectedTier].mandatory.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-lg p-6 border border-slate-200"
                >
                  <h4 className="font-bold text-slate-900 mb-4 text-lg">
                    {category.category}
                  </h4>
                  
                  {/* Horizontal scrollable container */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-3 min-w-max">
                      {category.fields.map((field, fieldIdx) => (
                        <div
                          key={fieldIdx}
                          className="flex-shrink-0 w-64 bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                        >
                          {/* Field Name */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              {field.critical ? (
                                <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
                              ) : (
                                <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                              )}
                              <span className="text-xs text-slate-500 font-semibold">CAMPO</span>
                            </div>
                            <span className="font-mono text-sm font-bold text-slate-900 block">
                              {field.name}
                            </span>
                          </div>

                          {/* Type */}
                          <div className="mb-3">
                            <span className="text-xs text-slate-500 font-semibold block mb-1">TIPO</span>
                            <span className="text-sm text-slate-700 block">
                              {field.type}
                            </span>
                          </div>

                          {/* Example */}
                          <div className="mb-3">
                            <span className="text-xs text-slate-500 font-semibold block mb-1">EJEMPLO</span>
                            <span className="text-sm font-mono text-slate-600 block break-words">
                              {field.example}
                            </span>
                          </div>

                          {/* Required Badge */}
                          <div>
                            {field.critical ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-semibold">
                                <AlertCircle size={12} />
                                Obligatorio
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                                <CheckCircle size={12} />
                                Opcional
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Static Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Database size={28} className="text-[#6D84E3]" />
                Configuración Estática
              </h2>
              <p className="text-slate-600">
                Introduce los parámetros de configuración para tu análisis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost per Hour */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Coste por Hora Agente (Fully Loaded)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
                  <input
                    type="number"
                    defaultValue="20"
                    min="0"
                    step="0.5"
                    className="w-full pl-10 pr-20 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#6D84E3] focus:border-[#6D84E3] transition"
                    placeholder="20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">€/hora</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Incluye salario, cargas sociales, infraestructura, etc.</p>
              </div>

              {/* Average CSAT (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  CSAT Promedio (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="85"
                    min="0"
                    max="100"
                    step="1"
                    className="w-full pr-16 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#6D84E3] focus:border-[#6D84E3] transition"
                    placeholder="85"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Puntuación promedio de satisfacción del cliente (0-100)</p>
              </div>

              {/* Segmentación por Cola/Skill (Optional) */}
              <div className="col-span-2">
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Database size={18} className="text-[#6D84E3]" />
                    Segmentación de Clientes por Cola/Skill (Opcional)
                  </h4>
                  <p className="text-sm text-slate-600">
                    Identifica qué colas/skills corresponden a cada segmento de cliente. Separa múltiples colas con comas.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* High Value */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      🟢 Clientes Alto Valor (High)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: VIP, Premium, Enterprise, Key_Accounts"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#6D84E3] focus:border-[#6D84E3] transition"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Colas para clientes de alto valor o estratégicos
                    </p>
                  </div>

                  {/* Medium Value */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      🟡 Clientes Valor Medio (Medium)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Soporte_General, Ventas, Facturacion"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#6D84E3] focus:border-[#6D84E3] transition"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Colas para clientes estándar o generales
                    </p>
                  </div>

                  {/* Low Value */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      🔴 Clientes Bajo Valor (Low)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Basico, Trial, Freemium"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#6D84E3] focus:border-[#6D84E3] transition"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Colas para clientes de bajo valor o en prueba
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ <strong>Nota:</strong> Las colas no mapeadas se clasificarán automáticamente como "Medium". 
                    El matching es flexible (no distingue mayúsculas y permite coincidencias parciales).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Sube tus Datos (CSV)
              </h2>
              <p className="text-slate-600">
                Elige una de las siguientes opciones para proporcionar tus datos
              </p>
            </div>

            <div className="space-y-6">
              {/* 1. Upload File */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <UploadCloud size={20} className="text-[#6D84E3]" />
                  Opción 1: Subir Archivo
                </h3>
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={clsx(
                    'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300',
                    isDragging && 'border-[#6D84E3] bg-[#E8EBFA] scale-105 shadow-lg',
                    !isDragging && 'border-slate-300 bg-slate-50 hover:border-slate-400',
                    isActionInProgress && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    disabled={isActionInProgress}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    <motion.div
                      animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <UploadCloud className={clsx(
                        "w-16 h-16 mb-4",
                        isDragging ? "text-[#6D84E3]" : "text-slate-400"
                      )} />
                    </motion.div>
                    <span className="font-semibold text-lg text-[#6D84E3] mb-1">
                      Haz clic para subir un fichero
                    </span>
                    <span className="text-slate-500">o arrástralo aquí</span>
                    <p className="text-sm text-slate-400 mt-3 bg-white px-4 py-2 rounded-full">
                      CSV, XLSX, o XLS
                    </p>
                  </label>
                </div>

                {/* File Preview */}
                {file && status !== 'uploading' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-between gap-3 p-4 bg-[#E8EBFA] border-2 border-[#6D84E3] rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-[#E8EBFA] rounded-lg flex items-center justify-center flex-shrink-0">
                        <File className="w-6 h-6 text-[#6D84E3]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm truncate">{file.name}</span>
                        <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setFile(null);
                        toast('Archivo eliminado', { icon: '🗑️' });
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors flex-shrink-0"
                    >
                      <X size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center text-slate-400">
                <hr className="w-full border-slate-300" />
                <span className="px-4 font-medium text-sm">O</span>
                <hr className="w-full border-slate-300" />
              </div>

              {/* 2. Google Sheets URL */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Sheet size={20} className="text-green-600" />
                  Opción 2: Google Sheets
                </h3>
                <div className="relative">
                  <Sheet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    placeholder="Pega la URL de tu Google Sheet aquí"
                    value={sheetUrl}
                    onChange={(e) => {
                      resetUploadState();
                      setSheetUrl(e.target.value);
                      setFile(null);
                    }}
                    disabled={isActionInProgress}
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-[#6D84E3] focus:border-[#6D84E3] transition disabled:bg-slate-100 text-sm"
                  />
                </div>

                {sheetUrl && !file && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-between gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Sheet className="w-6 h-6 flex-shrink-0 text-green-600" />
                      <span className="font-medium text-sm truncate">{sheetUrl}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSheetUrl('');
                        toast('URL eliminada', { icon: '🗑️' });
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors flex-shrink-0"
                    >
                      <X size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center text-slate-400">
                <hr className="w-full border-slate-300" />
                <span className="px-4 font-medium text-sm">O</span>
                <hr className="w-full border-slate-300" />
              </div>

              {/* 3. Generate Synthetic Data */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles size={20} className="text-fuchsia-600" />
                  Opción 3: Datos de Demostración
                </h3>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 p-1">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Sparkles className="text-fuchsia-600 w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      🎭 Prueba con Datos de Demo
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Explora el diagnóstico sin necesidad de datos reales. Generamos un dataset completo para ti.
                    </p>
                    <motion.button
                      onClick={handleGenerateSyntheticData}
                      disabled={isActionInProgress}
                      whileHover={{ scale: isActionInProgress ? 1 : 1.05 }}
                      whileTap={{ scale: isActionInProgress ? 1 : 0.95 }}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-fuchsia-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed font-semibold text-lg"
                    >
                      {status === 'generating' ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Sparkles size={24} />
                          Generar Datos Sintéticos
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center justify-center gap-3 p-6 bg-green-50 border-2 border-green-200 text-green-800 rounded-xl"
                  >
                    <CheckCircle className="w-8 h-8 flex-shrink-0" />
                    <span className="font-bold text-lg">¡Datos listos para analizar!</span>
                  </motion.div>
                )}
              </div>

              {/* 4. Generate Analysis Button */}
              <div className="pt-4">
                <motion.button
                  onClick={handleGenerateAnalysis}
                  disabled={!hasDataSource || isAnalyzing}
                  whileHover={{ scale: !hasDataSource || isAnalyzing ? 1 : 1.02 }}
                  whileTap={{ scale: !hasDataSource || isAnalyzing ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 text-white px-6 py-5 rounded-xl transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-[#6D84E3] to-[#5669D0] hover:from-[#5669D0] hover:to-[#6D84E3] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={28} />
                      Generando Análisis...
                    </>
                  ) : (
                    <>
                      <Wand2 size={28} />
                      Generar Análisis
                    </>
                  )}
                </motion.button>
                
                {!hasDataSource && (
                  <p className="text-center text-sm text-slate-500 mt-3">
                    Sube un archivo, pega una URL o genera datos sintéticos para continuar
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SinglePageDataRequest;
