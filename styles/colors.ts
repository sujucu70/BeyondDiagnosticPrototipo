// McKinsey-style Professional Color Palette
// Based on consulting industry best practices

export const colors = {
  // Primary Colors (Strategic Use)
  primary: {
    blue: '#1E40AF',      // Corporate blue - main insights, key data
    green: '#059669',     // Positive, achievements, targets met
    red: '#DC2626',       // Critical, gaps, alerts
    amber: '#D97706',     // Warning, opportunities, medium priority
  },

  // Neutral Colors (Context)
  neutral: {
    darkest: '#0F172A',   // Headings, primary text
    dark: '#1E293B',      // Body text
    medium: '#64748B',    // Secondary text, labels
    light: '#CBD5E1',     // Borders, dividers
    lightest: '#F1F5F9',  // Backgrounds, subtle fills
    white: '#FFFFFF',     // Cards, containers
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',   // Success states
    warning: '#F59E0B',   // Warning states
    error: '#EF4444',     // Error states
    info: '#3B82F6',      // Info states
  },

  // Chart Colors (Data Visualization)
  chart: {
    primary: '#1E40AF',
    secondary: '#059669',
    tertiary: '#D97706',
    quaternary: '#8B5CF6',
    quinary: '#EC4899',
  },

  // Heatmap Scale (Performance)
  heatmap: {
    critical: '#DC2626',    // <70 - Critical
    low: '#F59E0B',         // 70-80 - Below average
    medium: '#FCD34D',      // 80-85 - Average
    good: '#34D399',        // 85-90 - Good
    excellent: '#10B981',   // 90-95 - Excellent
    bestInClass: '#059669', // 95+ - Best in class
  },

  // Priority Matrix
  matrix: {
    quickWins: '#10B981',      // High impact, high feasibility
    strategic: '#3B82F6',      // High impact, low feasibility
    consider: '#F59E0B',       // Low impact, high feasibility
    discard: '#94A3B8',        // Low impact, low feasibility
  },

  // Gradients (For hero sections, highlights)
  gradients: {
    primary: 'from-blue-600 to-indigo-800',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-blue-500 to-cyan-600',
  },
};

// Helper function to get color by value (for heatmap)
export const getHeatmapColor = (value: number): string => {
  if (value >= 95) return colors.heatmap.bestInClass;
  if (value >= 90) return colors.heatmap.excellent;
  if (value >= 85) return colors.heatmap.good;
  if (value >= 80) return colors.heatmap.medium;
  if (value >= 70) return colors.heatmap.low;
  return colors.heatmap.critical;
};

// Helper function to get Tailwind class by value
export const getHeatmapTailwindClass = (value: number): string => {
  if (value >= 95) return 'bg-emerald-600 text-white';
  if (value >= 90) return 'bg-emerald-500 text-white';
  if (value >= 85) return 'bg-green-400 text-green-900';
  if (value >= 80) return 'bg-yellow-300 text-yellow-900';
  if (value >= 70) return 'bg-amber-400 text-amber-900';
  return 'bg-red-500 text-white';
};

// Helper function for priority matrix quadrant colors
export const getMatrixQuadrantColor = (impact: number, feasibility: number): string => {
  if (impact >= 5 && feasibility >= 5) return colors.matrix.quickWins;
  if (impact >= 5 && feasibility < 5) return colors.matrix.strategic;
  if (impact < 5 && feasibility >= 5) return colors.matrix.consider;
  return colors.matrix.discard;
};

export default colors;
