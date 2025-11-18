
import React from 'react';
import { AnalysisData } from '../types';
import Heatmap from './Heatmap';
import OpportunityMatrix from './OpportunityMatrix';
import Roadmap from './Roadmap';

interface StrategicVisualsViewProps {
  analysisData: AnalysisData;
}

const StrategicVisualsView: React.FC<StrategicVisualsViewProps> = ({ analysisData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Visualizaciones Estratégicas</h2>
      <p className="text-slate-600 mb-8">Herramientas interactivas para identificar, priorizar y planificar iniciativas de mejora.</p>
      
      <div className="space-y-8">
        {/* FIX: Removed unsupported 'selectedDimension' prop. */}
        <Heatmap 
            data={analysisData.heatmap}
        />
        {/* FIX: Removed unsupported 'selectedDimension' prop. */}
        <OpportunityMatrix 
            data={analysisData.opportunityMatrix}
        />
        {/* FIX: Removed unsupported 'selectedDimension' prop. */}
        <Roadmap 
            data={analysisData.roadmap}
        />
      </div>
    </div>
  );
};

export default StrategicVisualsView;
