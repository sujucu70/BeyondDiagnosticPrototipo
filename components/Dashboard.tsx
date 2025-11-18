import React from 'react';
import { AnalysisData, Kpi } from '../types';
import { TIERS } from '../constants';
import { ArrowLeft, BarChart2, Lightbulb, Target } from 'lucide-react';

import HealthScoreGauge from './HealthScoreGauge';
import DimensionCard from './DimensionCard';
import Heatmap from './Heatmap';
import OpportunityMatrix from './OpportunityMatrix';
import Roadmap from './Roadmap';
import EconomicModel from './EconomicModel';
import BenchmarkReport from './BenchmarkReport';

interface DashboardProps {
  analysisData: AnalysisData;
  onBack: () => void;
}

const KpiCard: React.FC<Kpi> = ({ label, value, change, changeType }) => {
    const changeColor = changeType === 'positive' ? 'bg-green-100 text-green-700' : changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700';
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-500 mb-1 truncate">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                {change && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${changeColor}`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ analysisData, onBack }) => {
  const tierInfo = TIERS[analysisData.tier];

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 bg-slate-50 font-sans flex flex-col md:flex-row gap-6 h-screen overflow-hidden">
      {/* Left Sidebar (Fixed) */}
      <aside className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${tierInfo.color} flex items-center justify-center`}>
            <BarChart2 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Diagnóstico</h1>
            <p className="text-sm text-slate-500">{tierInfo.name}</p>
          </div>
        </div>
        
        <HealthScoreGauge score={analysisData.overallHealthScore} />

        <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-500" />
                Principales Hallazgos
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 list-disc list-inside">
                {analysisData.keyFindings.map((finding, i) => <li key={i}>{finding.text}</li>)}
            </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
             <h3 className="font-bold text-lg text-blue-800 mb-4 flex items-center gap-2">
                <Target size={20} className="text-blue-600" />
                Recomendaciones
            </h3>
             <ul className="space-y-3 text-sm text-blue-900 list-disc list-inside">
                {analysisData.recommendations.map((rec, i) => <li key={i}>{rec.text}</li>)}
            </ul>
        </div>
        
        <button
          onClick={onBack}
          className="w-full mt-auto flex items-center justify-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Nuevo Análisis
        </button>
      </aside>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-y-auto">
        <div className="p-6 md:p-8 space-y-10">
            {/* Summary KPIs */}
            <section>
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {analysisData.summaryKpis.map(kpi => (
                        <KpiCard 
                            key={kpi.label} 
                            label={kpi.label} 
                            value={kpi.value}
                            change={kpi.change}
                            changeType={kpi.changeType} 
                        />
                    ))}
                </div>
            </section>
            
            {/* Dimensional Analysis */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Análisis Dimensional</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {analysisData.dimensions.map(dim => (
                        <DimensionCard key={dim.id} dimension={dim} />
                    ))}
                </div>
            </section>

            {/* Strategic Visualizations */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Visualizaciones Estratégicas</h2>
                <div className="space-y-8">
                    <Heatmap data={analysisData.heatmap} />
                    <OpportunityMatrix data={analysisData.opportunityMatrix} />
                    <Roadmap data={analysisData.roadmap} />
                    <EconomicModel data={analysisData.economicModel} />
                    <BenchmarkReport data={analysisData.benchmarkReport} />
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;