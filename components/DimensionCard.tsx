import React from 'react';
import { DimensionAnalysis } from '../types';

const ScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'bg-emerald-500';
        if (s >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="flex items-center gap-2">
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`${getScoreColor(score)} h-2 rounded-full`} style={{ width: `${score}%`}}></div>
            </div>
            <span className={`font-bold text-lg ${getScoreColor(score).replace('bg-', 'text-')}`}>{score}</span>
        </div>
    )
};

const DimensionCard: React.FC<{ dimension: DimensionAnalysis }> = ({ dimension }) => {
    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 mb-2">{dimension.title}</h3>
            <div className="mb-4">
                <ScoreIndicator score={dimension.score} />
            </div>
            <p className="text-sm text-slate-600 flex-grow">{dimension.summary}</p>
        </div>
    );
};

export default DimensionCard;
