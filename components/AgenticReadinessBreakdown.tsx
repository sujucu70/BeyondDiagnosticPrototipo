import React from 'react';
import { motion } from 'framer-motion';
import type { AgenticReadinessResult } from '../types';
import { CheckCircle2, TrendingUp, Database, Brain, Clock, DollarSign } from 'lucide-react';

interface AgenticReadinessBreakdownProps {
  agenticReadiness: AgenticReadinessResult;
}

const SUB_FACTOR_ICONS: Record<string, any> = {
  repetitividad: TrendingUp,
  predictibilidad: CheckCircle2,
  estructuracion: Database,
  complejidad_inversa: Brain,
  estabilidad: Clock,
  roi: DollarSign
};

const SUB_FACTOR_COLORS: Record<string, string> = {
  repetitividad: '#10B981',  // green
  predictibilidad: '#3B82F6',  // blue
  estructuracion: '#8B5CF6',  // purple
  complejidad_inversa: '#F59E0B',  // amber
  estabilidad: '#06B6D4',  // cyan
  roi: '#EF4444'  // red
};

export function AgenticReadinessBreakdown({ agenticReadiness }: AgenticReadinessBreakdownProps) {
  const { score, sub_factors, interpretation, confidence } = agenticReadiness;
  
  // Color del score general
  const getScoreColor = (score: number): string => {
    if (score >= 8) return '#10B981';  // green
    if (score >= 5) return '#F59E0B';  // amber
    return '#EF4444';  // red
  };
  
  const getScoreLabel = (score: number): string => {
    if (score >= 8) return 'Excelente';
    if (score >= 5) return 'Bueno';
    if (score >= 3) return 'Moderado';
    return 'Bajo';
  };
  
  const confidenceColor = {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#EF4444'
  }[confidence];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-8 shadow-sm border border-slate-200"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Agentic Readiness Score
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Confianza:</span>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${confidenceColor}20`,
                color: confidenceColor
              }}
            >
              {confidence === 'high' ? 'Alta' : confidence === 'medium' ? 'Media' : 'Baja'}
            </span>
          </div>
        </div>
        
        {/* Score principal */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#E2E8F0"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke={getScoreColor(score)}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - score / 10) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: getScoreColor(score) }}>
                {score.toFixed(1)}
              </span>
              <span className="text-sm text-slate-600">/10</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-2">
              <span 
                className="inline-block px-4 py-2 rounded-lg text-lg font-semibold"
                style={{ 
                  backgroundColor: `${getScoreColor(score)}20`,
                  color: getScoreColor(score)
                }}
              >
                {getScoreLabel(score)}
              </span>
            </div>
            <p className="text-slate-700 text-lg leading-relaxed">
              {interpretation}
            </p>
          </div>
        </div>
      </div>
      
      {/* Sub-factors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Desglose por Sub-factores
        </h3>
        
        {sub_factors.map((factor, index) => {
          const Icon = SUB_FACTOR_ICONS[factor.name] || CheckCircle2;
          const color = SUB_FACTOR_COLORS[factor.name] || '#6D84E3';
          
          return (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {factor.displayName}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {factor.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold" style={{ color }}>
                        {factor.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Peso: {(factor.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="relative w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className="absolute top-0 left-0 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(factor.score / 10) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Nota:</strong> El Agentic Readiness Score evalúa el potencial de automatización 
          basándose en repetitividad, predictibilidad, estructuración, complejidad, estabilidad y ROI. 
          Scores ≥8 son candidatos ideales para automatización completa (Automate), 5-7 para asistencia 
          agéntica (Assist), y 3-4 para augmentación humana (Augment).
        </p>
      </div>
    </motion.div>
  );
}
