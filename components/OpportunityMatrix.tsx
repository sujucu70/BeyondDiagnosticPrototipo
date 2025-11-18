import React from 'react';
import { Opportunity } from '../types';
import { HelpCircle, TrendingUp, Zap, DollarSign } from 'lucide-react';

interface OpportunityMatrixProps {
  data: Opportunity[];
}

const OpportunityMatrix: React.FC<OpportunityMatrixProps> = ({ data }) => {
  const maxSavings = Math.max(...data.map(d => d.savings), 1);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-xl text-slate-800">Opportunity Matrix</h3>
        <div className="group relative">
            <HelpCircle size={16} className="text-slate-400 cursor-pointer" />
            <div className="absolute bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Prioriza iniciativas basadas en Impacto vs. Factibilidad. El tamaño de la burbuja representa el ahorro potencial.
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
            </div>
        </div>
      </div>
      
      <div className="relative w-full h-[350px] border-l border-b border-slate-300">
        {/* Y-axis Label */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-slate-600 flex items-center gap-1">
          <TrendingUp size={14} /> Impacto
        </div>
        {/* X-axis Label */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-semibold text-slate-600 flex items-center gap-1">
          <Zap size={14} /> Factibilidad
        </div>

        {/* Quadrant Lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200" style={{borderTop: '1px dashed #cbd5e1'}}></div>
        <div className="absolute left-1/2 top-0 h-full w-px bg-slate-200" style={{borderLeft: '1px dashed #cbd5e1'}}></div>

        {/* Quadrant Labels */}
        <div className="absolute top-2 left-2 text-xs text-slate-500 font-medium">Estudiar</div>
        <div className="absolute top-2 right-2 text-xs text-slate-500 font-medium">Quick Wins</div>
        <div className="absolute bottom-2 left-2 text-xs text-slate-500 font-medium">Descartar</div>
        <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-medium">Proyectos Estratégicos</div>
        
        {data.map((opp) => {
          const size = 20 + (opp.savings / maxSavings) * 40; // Bubble size from 20px to 60px
          return (
            <div
              key={opp.id}
              className="absolute group transition-all duration-300"
              style={{
                left: `calc(${(opp.feasibility / 10) * 100}% - ${size / 2}px)`,
                bottom: `calc(${(opp.impact / 10) * 100}% - ${size / 2}px)`,
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              <div className="w-full h-full bg-blue-500 rounded-full opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-slate-800 text-white p-3 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                <h4 className="font-bold mb-1">{opp.name}</h4>
                <div className="flex items-center gap-1"><TrendingUp size={12} /> Impacto: <span className="font-semibold">{opp.impact}/10</span></div>
                <div className="flex items-center gap-1"><Zap size={12} /> Factibilidad: <span className="font-semibold">{opp.feasibility}/10</span></div>
                <div className="flex items-center gap-1"><DollarSign size={12} /> Ahorro: <span className="font-semibold">{opp.savings.toLocaleString('es-ES')}€</span></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunityMatrix;