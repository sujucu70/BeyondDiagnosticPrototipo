
import React from 'react';

interface HealthScoreGaugeProps {
  score: number;
}

const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score }) => {
  const getScoreProps = (s: number) => {
    if (s >= 80) return { color: 'text-emerald-500', bgColor: 'bg-emerald-100', label: 'Excelente' };
    if (s >= 60) return { color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Bueno' };
    return { color: 'text-red-500', bgColor: 'bg-red-100', label: 'Mejorable' };
  };

  const { color, bgColor, label } = getScoreProps(score);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${bgColor}`}>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-slate-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${color}`}>{score}</span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-600">Overall Health Score</p>
      <p className={`text-lg font-bold ${color}`}>{label}</p>
    </div>
  );
};

export default HealthScoreGauge;
