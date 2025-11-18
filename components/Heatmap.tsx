import React from 'react';
import { HeatmapDataPoint } from '../types';
import { HelpCircle } from 'lucide-react';

interface HeatmapProps {
  data: HeatmapDataPoint[];
}

const getCellColor = (value: number) => {
  if (value >= 95) return 'bg-emerald-600 text-white';
  if (value >= 90) return 'bg-emerald-500 text-white';
  if (value >= 85) return 'bg-green-400 text-green-900';
  if (value >= 80) return 'bg-yellow-300 text-yellow-800';
  if (value >= 70) return 'bg-amber-400 text-amber-900';
  return 'bg-red-400 text-red-900';
};

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const metrics: (keyof HeatmapDataPoint['metrics'])[] = ['fcr', 'aht', 'csat', 'quality'];

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-xl text-slate-800">Beyond CX Heatmap™</h3>
        <div className="group relative">
            <HelpCircle size={16} className="text-slate-400 cursor-pointer" />
            <div className="absolute bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Mapa de calor de Readiness Agéntico por skill. Muestra el rendimiento en métricas clave para identificar fortalezas y áreas de mejora.
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
            </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 font-semibold text-slate-600 text-left">Skill/Proceso</th>
              {metrics.map(metric => (
                <th key={metric} className="p-3 font-semibold text-slate-600 uppercase">{metric}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(({ skill, metrics }) => (
              <tr key={skill} className="border-t border-slate-200">
                <td className="p-3 font-semibold text-slate-700 text-left">{skill}</td>
                <td className={`p-3 font-bold ${getCellColor(metrics.fcr)}`}>{metrics.fcr}</td>
                <td className={`p-3 font-bold ${getCellColor(metrics.aht)}`}>{metrics.aht}</td>
                <td className={`p-3 font-bold ${getCellColor(metrics.csat)}`}>{metrics.csat}</td>
                <td className={`p-3 font-bold ${getCellColor(metrics.quality)}`}>{metrics.quality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="flex justify-end items-center gap-4 mt-4 text-xs">
            <span className="font-semibold">Leyenda:</span>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-400"></div><span>Bajo</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-yellow-300"></div><span>Medio</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div><span>Alto</span></div>
        </div>
    </div>
  );
};

export default Heatmap;