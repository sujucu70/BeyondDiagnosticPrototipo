import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisData, Kpi } from '../types';
import { TIERS } from '../constants';
import { ArrowLeft, BarChart2, Lightbulb, Target } from 'lucide-react';

import HealthScoreGaugeEnhanced from './HealthScoreGaugeEnhanced';
import DimensionCard from './DimensionCard';
import HeatmapEnhanced from './HeatmapEnhanced';
import OpportunityMatrixEnhanced from './OpportunityMatrixEnhanced';
import Roadmap from './Roadmap';
import EconomicModelEnhanced from './EconomicModelEnhanced';
import BenchmarkReport from './BenchmarkReport';

interface DashboardReorganizedProps {
  analysisData: AnalysisData;
  onBack: () => void;
}

const KpiCard: React.FC<Kpi & { index: number }> = ({ label, value, change, changeType, index }) => {
  const changeColor = changeType === 'positive' ? 'bg-green-100 text-green-700' : changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white p-5 rounded-lg border border-slate-200"
    >
      <p className="text-sm text-slate-500 mb-1 truncate">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {change && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${changeColor}`}
          >
            {change}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

const SectionDivider: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-3 my-8">
    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1" />
    <div className="flex items-center gap-2 text-slate-700">
      {icon}
      <span className="font-bold text-lg">{title}</span>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1" />
  </div>
);

const DashboardReorganized: React.FC<DashboardReorganizedProps> = ({ analysisData, onBack }) => {
  const tierInfo = TIERS[analysisData.tier];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Volver
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${tierInfo.color} flex items-center justify-center`}>
              <BarChart2 className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Beyond Diagnostic</h1>
              <p className="text-xs text-slate-500">{tierInfo.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* 1. HERO SECTION */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-10 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Health Score */}
              <div className="lg:col-span-1">
                <HealthScoreGaugeEnhanced 
                  score={analysisData.overallHealthScore}
                  previousScore={analysisData.overallHealthScore - 7}
                  industryAverage={65}
                  animated={true}
                />
              </div>

              {/* KPIs Grid */}
              <div className="lg:col-span-2">
                <h2 className="text-white text-2xl font-bold mb-6">Métricas Clave</h2>
                <div className="grid grid-cols-2 gap-4">
                  {analysisData.summaryKpis.map((kpi, index) => (
                    <KpiCard 
                      key={kpi.label} 
                      {...kpi}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. INSIGHTS SECTION */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Principales Hallazgos */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-xl text-amber-900 mb-4 flex items-center gap-2">
                <Lightbulb size={24} className="text-amber-600" />
                Principales Hallazgos
              </h3>
              <ul className="space-y-3 text-sm text-amber-900">
                {analysisData.keyFindings.map((finding, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-2"
                  >
                    <span className="text-amber-600 mt-1 font-bold">•</span>
                    <span>{finding.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Recomendaciones */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-xl text-blue-900 mb-4 flex items-center gap-2">
                <Target size={24} className="text-blue-600" />
                Recomendaciones
              </h3>
              <ul className="space-y-3 text-sm text-blue-900">
                {analysisData.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-2"
                  >
                    <span className="text-blue-600 mt-1 font-bold">→</span>
                    <span>{rec.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* 3. ANÁLISIS DIMENSIONAL */}
        <section>
          <SectionDivider 
            icon={<BarChart2 size={20} className="text-blue-600" />}
            title="Análisis Dimensional"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {analysisData.dimensions.map((dim, index) => (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <DimensionCard dimension={dim} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 4. HEATMAP */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HeatmapEnhanced data={analysisData.heatmap} />
          </motion.div>
        </section>

        {/* 5. OPPORTUNITY MATRIX */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <OpportunityMatrixEnhanced data={analysisData.opportunityMatrix} />
          </motion.div>
        </section>

        {/* 6. ROADMAP */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Roadmap data={analysisData.roadmap} />
          </motion.div>
        </section>

        {/* 7. ECONOMIC MODEL */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <EconomicModelEnhanced data={analysisData.economicModel} />
          </motion.div>
        </section>

        {/* 8. BENCHMARK REPORT */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BenchmarkReport data={analysisData.benchmarkReport} />
          </motion.div>
        </section>

        {/* Footer */}
        <section className="pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <ArrowLeft size={20} />
              Realizar Nuevo Análisis
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default DashboardReorganized;
