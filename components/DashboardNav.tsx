import React from 'react';
import { DimensionAnalysis } from '../types';
import { LayoutDashboard, Bot, DollarSign, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardNavProps {
    dimensions: DimensionAnalysis[];
    activeView: string;
    setActiveView: (view: string) => void;
}

const NavItem: React.FC<{ icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

const DashboardNav: React.FC<DashboardNavProps> = ({ dimensions, activeView, setActiveView }) => {
    const [isDimensionsExpanded, setIsDimensionsExpanded] = React.useState(true);

    return (
        <nav className="flex-1 flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <NavItem 
                icon={LayoutDashboard} 
                label="Resumen General" 
                isActive={activeView === 'summary'} 
                onClick={() => setActiveView('summary')} 
            />

            {/* Dimensions Accordion */}
            <div className="w-full">
                 <button 
                    onClick={() => setIsDimensionsExpanded(!isDimensionsExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                    <span className="font-semibold">Análisis Dimensional</span>
                    {isDimensionsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isDimensionsExpanded && (
                    <div className="pl-4 pt-2 space-y-1">
                        {dimensions.map(dim => (
                             <NavItem 
                                key={dim.id}
                                icon={dim.icon} 
                                label={dim.title} 
                                isActive={activeView === `dimension_${dim.id}`} 
                                onClick={() => setActiveView(`dimension_${dim.id}`)} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <hr className="border-slate-200 my-2" />
            
            <NavItem 
                icon={Bot} 
                label="Visuales Estratégicas" 
                isActive={activeView === 'strategic'} 
                onClick={() => setActiveView('strategic')} 
            />
            <NavItem 
                icon={DollarSign} 
                label="Modelo Económico" 
                isActive={activeView === 'economic'} 
                onClick={() => setActiveView('economic')} 
            />
            <NavItem 
                icon={Globe} 
                label="Benchmark de Industria" 
                isActive={activeView === 'benchmark'} 
                onClick={() => setActiveView('benchmark')} 
            />
        </nav>
    );
};

export default DashboardNav;