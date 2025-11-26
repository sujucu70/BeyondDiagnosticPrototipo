import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ArrowUpDown, TrendingUp, TrendingDown, AlertTriangle, Star, Award } from 'lucide-react';
import { HeatmapDataPoint } from '../types';
import clsx from 'clsx';
import MethodologyFooter from './MethodologyFooter';

interface HeatmapProProps {
  data: HeatmapDataPoint[];
}

type SortKey = 'skill' | 'fcr' | 'aht' | 'csat' | 'quality' | 'average' | 'cost';
type SortOrder = 'asc' | 'desc';

interface TooltipData {
  skill: string;
  metric: string;
  value: number;
  x: number;
  y: number;
}

interface Insight {
  type: 'strength' | 'opportunity';
  skill: string;
  metric: string;
  value: number;
  percentile: string;
}

const getCellColor = (value: number) => {
  if (value >= 95) return 'bg-emerald-600 text-white';
  if (value >= 90) return 'bg-emerald-500 text-white';
  if (value >= 85) return 'bg-green-400 text-green-900';
  if (value >= 80) return 'bg-yellow-300 text-yellow-900';
  if (value >= 70) return 'bg-amber-400 text-amber-900';
  return 'bg-red-500 text-white';
};

const getPercentile = (value: number): string => {
  if (value >= 95) return 'P95+ (Best-in-Class)';
  if (value >= 90) return 'P90-P95 (Excelente)';
  if (value >= 85) return 'P75-P90 (Competitivo)';
  if (value >= 70) return 'P50-P75 (Por debajo promedio)';
  return '<P50 (Crítico)';
};

const getCellIcon = (value: number) => {
  if (value >= 95) return <Star size={12} className="inline ml-1" />;
  if (value < 70) return <AlertTriangle size={12} className="inline ml-1" />;
  return null;
};

const HeatmapPro: React.FC<HeatmapProProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>('skill');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const metrics: Array<{ key: keyof HeatmapDataPoint['metrics']; label: string }> = [
    { key: 'fcr', label: 'FCR' },
    { key: 'aht', label: 'AHT' },
    { key: 'csat', label: 'CSAT' },
    { key: 'quality', label: 'Quality' },
  ];

  // Calculate insights
  const insights = useMemo(() => {
    const allMetrics: Array<{ skill: string; metric: string; value: number }> = [];
    
    data.forEach(item => {
      metrics.forEach(({ key, label }) => {
        allMetrics.push({
          skill: item.skill,
          metric: label,
          value: item.metrics[key],
        });
      });
    });

    // Sort by value
    allMetrics.sort((a, b) => b.value - a.value);

    // Top 3 strengths (highest values)
    const strengths: Insight[] = allMetrics.slice(0, 3).map(m => ({
      type: 'strength',
      skill: m.skill,
      metric: m.metric,
      value: m.value,
      percentile: getPercentile(m.value),
    }));

    // Top 3 opportunities (lowest values)
    const opportunities: Insight[] = allMetrics.slice(-3).reverse().map(m => ({
      type: 'opportunity',
      skill: m.skill,
      metric: m.metric,
      value: m.value,
      percentile: getPercentile(m.value),
    }));

    return { strengths, opportunities };
  }, [data]);

  // Calculate dynamic title
  const dynamicTitle = useMemo(() => {
    const totalMetrics = data.length * metrics.length;
    const belowP75 = data.reduce((count, item) => {
      return count + metrics.filter(m => item.metrics[m.key] < 85).length;
    }, 0);
    const percentage = Math.round((belowP75 / totalMetrics) * 100);
    
    // Calculate total annual cost
    const totalCost = data.reduce((sum, item) => sum + (item.annual_cost || 0), 0);
    const costStr = `€${Math.round(totalCost / 1000)}K`;
    
    // Find metric with most issues
    const metricCounts = metrics.map(({ key, label }) => ({
      label,
      count: data.filter(item => item.metrics[key] < 85).length,
    }));
    metricCounts.sort((a, b) => b.count - a.count);
    const topMetric = metricCounts[0];

    return `${percentage}% de las métricas están por debajo de P75, representando ${costStr} en coste anual, con ${topMetric.label} mostrando la mayor oportunidad de mejora`;
  }, [data]);

  // Calculate averages
  const dataWithAverages = useMemo(() => {
    return data.map(item => {
      const values = metrics.map(m => item.metrics[m.key]);
      const average = values.reduce((sum, v) => sum + v, 0) / values.length;
      return { ...item, average };
    });
  }, [data]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedData = [...dataWithAverages].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    if (sortKey === 'skill') {
      aValue = a.skill;
      bValue = b.skill;
    } else if (sortKey === 'average') {
      aValue = a.average;
      bValue = b.average;
    } else if (sortKey === 'cost') {
      aValue = a.annual_cost || 0;
      bValue = b.annual_cost || 0;
    } else {
      aValue = a.metrics[sortKey];
      bValue = b.metrics[sortKey];
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
    <div id="heatmap" className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      {/* Header with Dynamic Title */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-2xl text-slate-800">Beyond CX Heatmap™</h3>
              <div className="group relative">
                <HelpCircle size={18} className="text-slate-400 cursor-pointer" />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-80 bg-slate-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  Mapa de calor de Readiness Agéntico por skill. Muestra el rendimiento en métricas clave comparado con benchmarks de industria (P75) para identificar fortalezas y áreas de mejora prioritarias.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <p className="text-base text-slate-700 font-medium leading-relaxed">
              {dynamicTitle}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Análisis de 12 skills críticos vs. benchmarks de industria (P75) | Datos: Q4 2024 | N=15,000 interacciones
            </p>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Top Strengths */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-green-600" />
              <h4 className="font-semibold text-green-900">Top 3 Fortalezas</h4>
            </div>
            <div className="space-y-2">
              {insights.strengths.map((insight, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-green-800">
                    <span className="font-semibold">{insight.skill}</span> - {insight.metric}
                  </span>
                  <span className="font-bold text-green-600">{insight.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-amber-600" />
              <h4 className="font-semibold text-amber-900">Top 3 Oportunidades de Mejora</h4>
            </div>
            <div className="space-y-2">
              {insights.opportunities.map((insight, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">
                    <span className="font-semibold">{insight.skill}</span> - {insight.metric}
                  </span>
                  <span className="font-bold text-amber-600">{insight.value}%</span>
                </div>
              ))}
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
                onClick={() => handleSort('average')}
                className="p-4 font-semibold text-slate-700 text-center cursor-pointer hover:bg-slate-100 transition-colors border-b-2 border-slate-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>PROMEDIO</span>
                  <ArrowUpDown size={14} className="text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('cost')}
                className="p-4 font-semibold text-slate-700 text-center cursor-pointer hover:bg-slate-100 transition-colors border-b-2 border-slate-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>COSTE ANUAL</span>
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
                    const value = item.metrics[key];
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
                        <span>{value}</span>
                        {getCellIcon(value)}
                      </td>
                    );
                  })}
                  <td className="p-4 font-bold text-center bg-slate-100 text-slate-700">
                    {item.average.toFixed(1)}
                  </td>
                  <td className="p-4 text-center">
                    {item.annual_cost ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold text-slate-800">
                          €{Math.round(item.annual_cost / 1000)}K
                        </span>
                        <div className={clsx(
                          'w-3 h-3 rounded-full',
                          item.annual_cost >= sortedData.reduce((sum, d) => sum + (d.annual_cost || 0), 0) / sortedData.length * 1.2
                            ? 'bg-red-500'  // Alto coste (>120% del promedio)
                            : item.annual_cost >= sortedData.reduce((sum, d) => sum + (d.annual_cost || 0), 0) / sortedData.length * 0.8
                            ? 'bg-amber-400'  // Coste medio (80-120% del promedio)
                            : 'bg-green-500'  // Bajo coste (<80% del promedio)
                        )} />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">N/A</span>
                    )}
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
          <span className="font-semibold text-slate-700">Escala de Performance vs. Industria:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-slate-700"><strong>&lt;70</strong> - Crítico (Por debajo P25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-amber-400"></div>
            <span className="text-slate-700"><strong>70-80</strong> - Oportunidad (P25-P50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-yellow-300"></div>
            <span className="text-slate-700"><strong>80-85</strong> - Promedio (P50-P75)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-400"></div>
            <span className="text-slate-700"><strong>85-90</strong> - Competitivo (P75-P90)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-500"></div>
            <span className="text-slate-700"><strong>90-95</strong> - Excelente (P90-P95)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-600"></div>
            <Star size={14} className="text-emerald-600" />
            <span className="text-slate-700"><strong>95+</strong> - Best-in-Class (P95+)</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm">
              <div className="font-bold mb-2">{tooltip.skill}</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">{tooltip.metric}:</span>
                  <span className="font-bold">{tooltip.value}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Percentil:</span>
                  <span className="font-semibold text-xs">{getPercentile(tooltip.value)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                  {tooltip.value >= 85 ? (
                    <>
                      <TrendingUp size={14} className="text-green-400" />
                      <span className="text-green-400 text-xs">Por encima del promedio</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={14} className="text-amber-400" />
                      <span className="text-amber-400 text-xs">Oportunidad de mejora</span>
                    </>
                  )}
                </div>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Methodology Footer */}
      <MethodologyFooter
        sources="Datos operacionales internos (Q4 2024, N=15,000 interacciones) | Benchmarks: Gartner CX Benchmarking 2024, Forrester Customer Service Study 2024"
        methodology="Percentiles calculados vs. 250 contact centers en sector Telco/Tech | Escala 0-100 | Peer group: Contact centers 200-500 agentes, Europa Occidental"
        notes="FCR = First Contact Resolution, AHT = Average Handle Time, CSAT = Customer Satisfaction, Quality = QA Score | Benchmarks actualizados trimestralmente"
        lastUpdated="Enero 2025"
      />
    </div>
  );
};

export default HeatmapPro;
