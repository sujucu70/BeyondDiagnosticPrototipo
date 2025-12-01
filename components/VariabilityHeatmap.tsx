import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ArrowUpDown, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { HeatmapDataPoint } from '../types';
import clsx from 'clsx';
import MethodologyFooter from './MethodologyFooter';

interface VariabilityHeatmapProps {
  data: HeatmapDataPoint[];
}

type SortKey = 'skill' | 'cv_aht' | 'cv_talk_time' | 'cv_hold_time' | 'transfer_rate' | 'automation_readiness';
type SortOrder = 'asc' | 'desc';

interface TooltipData {
  skill: string;
  metric: string;
  value: number;
  x: number;
  y: number;
}

interface Insight {
  type: 'quick_win' | 'standardize' | 'consult';
  skill: string;
  automation_readiness: number;
  recommendation: string;
}

// Colores invertidos: Verde = bajo CV (bueno), Rojo = alto CV (malo)
const getCellColor = (value: number) => {
  if (value < 25) return 'bg-emerald-600 text-white'; // Baja variabilidad - Excelente
  if (value < 35) return 'bg-green-400 text-green-900'; // Variabilidad aceptable
  if (value < 45) return 'bg-yellow-300 text-yellow-900'; // Variabilidad media
  if (value < 55) return 'bg-amber-400 text-amber-900'; // Variabilidad alta
  return 'bg-red-500 text-white'; // Variabilidad muy alta - Crítico
};

const getReadinessColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-600 text-white';
  if (score >= 60) return 'bg-yellow-400 text-yellow-900';
  return 'bg-red-500 text-white';
};

const getReadinessLabel = (score: number): string => {
  if (score >= 80) return 'Listo para automatizar';
  if (score >= 60) return 'Estandarizar primero';
  return 'Consultoría recomendada';
};

const getCellIcon = (value: number) => {
  if (value < 25) return <CheckCircle size={12} className="inline ml-1" />;
  if (value >= 55) return <AlertTriangle size={12} className="inline ml-1" />;
  return null;
};

const VariabilityHeatmap: React.FC<VariabilityHeatmapProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>('automation_readiness');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const metrics: Array<{ key: keyof HeatmapDataPoint['variability']; label: string }> = [
    { key: 'cv_aht', label: 'CV AHT' },
    { key: 'cv_talk_time', label: 'CV Talk Time' },
    { key: 'cv_hold_time', label: 'CV Hold Time' },
    { key: 'transfer_rate', label: 'Transfer Rate' },
  ];

  // Calculate insights
  const insights = useMemo(() => {
    const sortedByReadiness = [...data].sort((a, b) => b.automation_readiness - a.automation_readiness);
    
    const quickWins: Insight[] = sortedByReadiness
      .filter(item => item.automation_readiness >= 80)
      .map(item => ({
        type: 'quick_win',
        skill: item.skill,
        automation_readiness: item.automation_readiness,
        recommendation: `CV AHT ${item.variability.cv_aht}% → Candidato ideal para automatización inmediata`
      }));

    const standardize: Insight[] = sortedByReadiness
      .filter(item => item.automation_readiness >= 60 && item.automation_readiness < 80)
      .map(item => ({
        type: 'standardize',
        skill: item.skill,
        automation_readiness: item.automation_readiness,
        recommendation: `Implementar playbooks y estandarización antes de automatizar`
      }));

    const consult: Insight[] = sortedByReadiness
      .filter(item => item.automation_readiness < 60)
      .map(item => ({
        type: 'consult',
        skill: item.skill,
        automation_readiness: item.automation_readiness,
        recommendation: `Consultoría recomendada para identificar causas raíz de alta variabilidad`
      }));

    return { quickWins, standardize, consult };
  }, [data]);

  // Calculate dynamic title
  const dynamicTitle = useMemo(() => {
    try {
      if (!data || !Array.isArray(data)) return 'Análisis de variabilidad interna';
      const highVariability = data.filter(item => (item?.automation_readiness || 0) < 60).length;
      const total = data.length;
      
      if (highVariability === 0) {
        return `Todas las skills muestran baja variabilidad (>60), listas para automatización`;
      } else if (highVariability === total) {
        return `${highVariability} de ${total} skills muestran alta variabilidad (CV>40%), sugiriendo necesidad de estandarización antes de automatizar`;
      } else {
        return `${highVariability} de ${total} skills muestran alta variabilidad (CV>40%), sugiriendo necesidad de estandarización antes de automatizar`;
      }
    } catch (error) {
      console.error('❌ Error in dynamicTitle useMemo (VariabilityHeatmap):', error);
      return 'Análisis de variabilidad interna';
    }
  }, [data]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'automation_readiness' ? 'desc' : 'asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    if (sortKey === 'skill') {
      aValue = a.skill;
      bValue = b.skill;
    } else if (sortKey === 'automation_readiness') {
      aValue = a.automation_readiness;
      bValue = b.automation_readiness;
    } else {
      aValue = a.variability[sortKey];
      bValue = b.variability[sortKey];
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const handleCellHover = (
    skill: string,
    metric: string,
    value: number,
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      skill,
      metric,
      value,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  return (
    <div id="variability-heatmap" className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      {/* Header with Dynamic Title */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={24} className="text-[#6D84E3]" />
              <h3 className="font-bold text-2xl text-slate-800">Heatmap de Variabilidad Interna™</h3>
              <div className="group relative">
                <HelpCircle size={18} className="text-slate-400 cursor-pointer" />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-80 bg-slate-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  Mide la consistencia y predictibilidad interna de cada skill. Baja variabilidad indica procesos maduros listos para automatización. Alta variabilidad sugiere necesidad de estandarización o consultoría.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {dynamicTitle}
            </p>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Quick Wins */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">Quick Wins ({insights.quickWins.length})</h4>
            </div>
            <div className="space-y-2">
              {insights.quickWins.map((insight, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-emerald-700">{insight.skill}</span>
                  <span className="text-emerald-600"> ({insight.automation_readiness})</span>
                  <p className="text-emerald-600 mt-1">{insight.recommendation}</p>
                </div>
              ))}
              {insights.quickWins.length === 0 && (
                <p className="text-xs text-emerald-600">No hay skills con readiness &gt;80</p>
              )}
            </div>
          </div>

          {/* Standardize */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-amber-600" />
              <h4 className="font-semibold text-amber-800">Estandarizar ({insights.standardize.length})</h4>
            </div>
            <div className="space-y-2">
              {insights.standardize.map((insight, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-amber-700">{insight.skill}</span>
                  <span className="text-amber-600"> ({insight.automation_readiness})</span>
                  <p className="text-amber-600 mt-1">{insight.recommendation}</p>
                </div>
              ))}
              {insights.standardize.length === 0 && (
                <p className="text-xs text-amber-600">No hay skills con readiness 60-79</p>
              )}
            </div>
          </div>

          {/* Consult */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-600" />
              <h4 className="font-semibold text-red-800">Consultoría ({insights.consult.length})</h4>
            </div>
            <div className="space-y-2">
              {insights.consult.map((insight, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-red-700">{insight.skill}</span>
                  <span className="text-red-600"> ({insight.automation_readiness})</span>
                  <p className="text-red-600 mt-1">{insight.recommendation}</p>
                </div>
              ))}
              {insights.consult.length === 0 && (
                <p className="text-xs text-red-600">No hay skills con readiness &lt;60</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th
                onClick={() => handleSort('skill')}
                className="p-4 font-semibold text-slate-700 text-left cursor-pointer hover:bg-slate-100 transition-colors border-b-2 border-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span>Skill/Proceso</span>
                  <ArrowUpDown size={14} className="text-slate-400" />
                </div>
              </th>
              {metrics.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="p-4 font-semibold text-slate-700 text-center cursor-pointer hover:bg-slate-100 transition-colors uppercase border-b-2 border-slate-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{label}</span>
                    <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
              ))}
              <th
                onClick={() => handleSort('automation_readiness')}
                className="p-4 font-semibold text-slate-700 text-center cursor-pointer hover:bg-slate-100 transition-colors border-b-2 border-slate-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>READINESS</span>
                  <ArrowUpDown size={14} className="text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedData.map((item, index) => (
                <motion.tr
                  key={item.skill}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.03 }}
                  onMouseEnter={() => setHoveredRow(item.skill)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={clsx(
                    'border-b border-slate-200 transition-colors',
                    hoveredRow === item.skill && 'bg-blue-50'
                  )}
                >
                  <td className="p-4 font-semibold text-slate-800 border-r border-slate-200">
                    {item.skill}
                  </td>
                  {metrics.map(({ key }) => {
                    const value = item.variability[key];
                    return (
                      <td
                        key={key}
                        className={clsx(
                          'p-4 font-bold text-center cursor-pointer transition-all relative',
                          getCellColor(value),
                          hoveredRow === item.skill && 'scale-105 shadow-lg ring-2 ring-blue-400'
                        )}
                        onMouseEnter={(e) => handleCellHover(item.skill, key.toUpperCase(), value, e)}
                        onMouseLeave={handleCellLeave}
                      >
                        <span>{value}%</span>
                        {getCellIcon(value)}
                      </td>
                    );
                  })}
                  <td className={clsx(
                    'p-4 font-bold text-center',
                    getReadinessColor(item.automation_readiness)
                  )}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{item.automation_readiness}</span>
                      <span className="text-xs opacity-90">{getReadinessLabel(item.automation_readiness)}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Enhanced Legend */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <span className="font-semibold text-slate-700">Escala de Variabilidad (menor es mejor):</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-600"></div>
            <span className="text-slate-700"><strong>&lt;25%</strong> - Excelente (Proceso maduro)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-400"></div>
            <span className="text-slate-700"><strong>25-35%</strong> - Bueno (Aceptable)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-yellow-300"></div>
            <span className="text-slate-700"><strong>35-45%</strong> - Medio (Mejorable)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-amber-400"></div>
            <span className="text-slate-700"><strong>45-55%</strong> - Alto (Requiere atención)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-slate-700"><strong>&gt;55%</strong> - Crítico (Consultoría recomendada)</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs mt-3 pt-3 border-t border-slate-200">
          <span className="font-semibold text-slate-700">Automation Readiness:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-600"></div>
            <span className="text-slate-700"><strong>80-100</strong> - Listo para automatizar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-yellow-400"></div>
            <span className="text-slate-700"><strong>60-79</strong> - Estandarizar primero</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-slate-700"><strong>&lt;60</strong> - Consultoría recomendada</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="font-semibold mb-1">{tooltip.skill}</div>
            <div>{tooltip.metric}: {tooltip.value}%</div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Methodology Footer */}
      <MethodologyFooter
        sources={[
          'Datos operacionales del contact center (últimos 3 meses)',
          'Análisis de variabilidad por skill/canal',
          'Benchmarks de procesos estandarizados'
        ]}
        methodology="Automation Readiness calculado como: (100-CV_AHT)×30% + (100-CV_FCR)×25% + (100-CV_CSAT)×20% + (100-Entropía)×15% + (100-Escalación)×10%"
        assumptions={[
          'CV (Coeficiente de Variación) = Desviación Estándar / Media',
          'Entropía mide diversidad de motivos de contacto (0-100)',
          'Baja variabilidad indica proceso maduro y predecible'
        ]}
      />
    </div>
  );
};

export default VariabilityHeatmap;
