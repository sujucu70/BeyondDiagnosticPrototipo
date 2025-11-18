import React from 'react';
import { EconomicModelData } from '../types';
import { TrendingDown, TrendingUp, PiggyBank, Briefcase, Zap, Calendar } from 'lucide-react';

interface EconomicModelProps {
  data: EconomicModelData;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
}

const InfoCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const EconomicModel: React.FC<EconomicModelProps> = ({ data }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Modelo Económico (Business Case)</h2>
      <p className="text-slate-600 mb-8">Análisis comparativo de costes y proyección de retorno de la inversión basado en las oportunidades de automatización identificadas.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Costes */}
        <div className="md:col-span-2 lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-center">
            <h3 className="font-semibold text-lg text-slate-800 mb-4">Comparativa de Costes Anuales</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <TrendingUp size={16} className="text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Coste Actual (AS-IS)</p>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(data.currentAnnualCost)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingDown size={16} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Coste Futuro (TO-BE)</p>
                        <p className="text-xl font-semibold text-green-600">{formatCurrency(data.futureAnnualCost)}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Ahorro */}
        <div className="md:col-span-2 lg:col-span-2 bg-emerald-500 text-white p-8 rounded-xl flex flex-col justify-center items-center text-center shadow-lg">
            <PiggyBank size={40} className="mb-3" />
            <h3 className="text-xl font-semibold opacity-80">Ahorro Anual Potencial</h3>
            <p className="text-5xl font-bold my-2">{formatCurrency(data.annualSavings)}</p>
            <p className="text-sm opacity-70">Reducción del {((data.annualSavings / data.currentAnnualCost) * 100).toFixed(1)}% en costes operativos.</p>
        </div>
        
        {/* ROI Metrics */}
        <InfoCard icon={Briefcase} title="Inversión Inicial Estimada" value={formatCurrency(data.initialInvestment)} color="bg-sky-500" />
        <InfoCard icon={Calendar} title="Payback Period" value={`${data.paybackMonths} meses`} color="bg-amber-500" />
        <InfoCard icon={Zap} title="ROI a 3 Años" value={`${data.roi3yr}%`} color="bg-fuchsia-500" />
      </div>

    </div>
  );
};

export default EconomicModel;
