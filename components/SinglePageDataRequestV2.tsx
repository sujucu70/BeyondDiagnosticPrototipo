// components/SinglePageDataRequestV2.tsx
// Versión simplificada con nuevo componente DataInputRedesigned

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { TierKey, AnalysisData } from '../types';
import TierSelectorEnhanced from './TierSelectorEnhanced';
import DataInputRedesigned from './DataInputRedesigned';
import DashboardReorganized from './DashboardReorganized';
import { generateAnalysis } from '../utils/analysisGenerator';

const SinglePageDataRequestV2: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TierKey>('silver');
  const [view, setView] = useState<'form' | 'dashboard'>('form');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTierSelect = (tier: TierKey) => {
    setSelectedTier(tier);
  };

  const handleAnalyze = (config: {
    costPerHour: number;
    avgCsat: number;
    segmentMapping?: {
      high_value_queues: string[];
      medium_value_queues: string[];
      low_value_queues: string[];
    };
  }) => {
    console.log('🚀 handleAnalyze called with config:', config);
    console.log('🎯 Selected tier:', selectedTier);
    
    setIsAnalyzing(true);
    
    // Use requestAnimationFrame to ensure state update happens
    requestAnimationFrame(() => {
      setTimeout(() => {
        console.log('⏰ Generating analysis...');
        try {
          const data = generateAnalysis(selectedTier, config.costPerHour, config.avgCsat, config.segmentMapping);
          console.log('✅ Analysis generated successfully');
          
          setAnalysisData(data);
          setIsAnalyzing(false);
          setView('dashboard');
          
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error('❌ Error generating analysis:', error);
          setIsAnalyzing(false);
          alert('Error al generar el análisis: ' + (error as Error).message);
        }
      }, 1000);
    });
  };

  const handleBackToForm = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'dashboard' && analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Toaster position="top-right" />
        
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={handleBackToForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition shadow-md font-semibold"
          >
            <ArrowLeft size={18} />
            Volver a Configuración
          </button>
        </div>
        
        {/* Dashboard */}
        <DashboardReorganized data={analysisData} tier={selectedTier} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Beyond <span className="text-[#6D84E3]">Diagnostic</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Análisis de Automatización Inteligente para Contact Centers
          </p>
        </motion.div>

        {/* Tier Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <TierSelectorEnhanced
            selectedTier={selectedTier}
            onSelectTier={handleTierSelect}
          />
        </motion.div>

        {/* Data Input Form */}
        <DataInputRedesigned
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </div>
  );
};

export default SinglePageDataRequestV2;
