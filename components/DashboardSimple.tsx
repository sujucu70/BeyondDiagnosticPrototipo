// components/DashboardSimple.tsx
// Dashboard simplificado para debug

import React from 'react';
import { AnalysisData } from '../types';
import { ArrowLeft } from 'lucide-react';

interface DashboardSimpleProps {
  analysisData: AnalysisData;
  onBack: () => void;
}

const DashboardSimple: React.FC<DashboardSimpleProps> = ({ analysisData, onBack }) => {
  console.log('🎨 DashboardSimple rendering');
  console.log('📊 Data received:', analysisData);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold mb-4"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Dashboard de Análisis
        </h1>
        <p className="text-slate-600">
          Tier: <span className="font-semibold">{analysisData.tier}</span>
        </p>
      </div>
      
      {/* Health Score */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Score</h2>
        <div className="text-6xl font-bold text-[#6D84E3]">
          {analysisData.overallHealthScore}
        </div>
        <p className="text-slate-600 mt-2">Puntuación general de salud operativa</p>
      </div>
      
      {/* KPIs */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Métricas Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysisData.summaryKpis.map((kpi, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              {kpi.change && (
                <p className={`text-sm mt-1 ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 
                  kpi.changeType === 'negative' ? 'text-red-600' : 
                  'text-slate-600'
                }`}>
                  {kpi.change}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Dimensions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Dimensiones Analizadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisData.dimensions.map((dimension, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">{dimension.title}</h3>
              <div className="text-3xl font-bold text-[#6D84E3] mb-2">
                {dimension.score}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{dimension.summary}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Heatmap Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Heatmap Data</h2>
        <p className="text-slate-600 mb-4">
          Total de skills analizados: <span className="font-semibold">{analysisData.heatmap.length}</span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Skill</th>
                <th className="p-2 text-right">Volumen</th>
                <th className="p-2 text-right">AHT (s)</th>
                <th className="p-2 text-right">Automation Readiness</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.heatmap.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-2">{row.skill}</td>
                  <td className="p-2 text-right">{row.volume}</td>
                  <td className="p-2 text-right">{row.aht_seconds}</td>
                  <td className="p-2 text-right">{row.automation_readiness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Debug Info */}
      <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">🔍 Debug Info</h2>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(analysisData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DashboardSimple;
