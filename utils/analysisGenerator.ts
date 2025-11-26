// analysisGenerator.ts - v2.0 con 6 dimensiones
import type { AnalysisData, Kpi, DimensionAnalysis, HeatmapDataPoint, Opportunity, RoadmapInitiative, EconomicModelData, BenchmarkDataPoint, Finding, Recommendation, TierKey, CustomerSegment } from '../types';
import { RoadmapPhase } from '../types';
import { BarChartHorizontal, Zap, Smile, DollarSign, Target, Globe } from 'lucide-react';
import { calculateAgenticReadinessScore, type AgenticReadinessInput } from './agenticReadinessV2';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomFromList = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Distribución normal (Box-Muller transform)
const normalRandom = (mean: number, std: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z0;
};

const getScoreColor = (score: number): 'green' | 'yellow' | 'red' => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
};

// v2.0: 6 DIMENSIONES (eliminadas Complejidad y Efectividad)
const DIMENSIONS_CONTENT = {
    volumetry_distribution: {
        icon: BarChartHorizontal,
        titles: ["Volumetría y Distribución Horaria", "Análisis de la Demanda"],
        summaries: {
            good: ["El volumen de interacciones se alinea con las previsiones, permitiendo una planificación de personal precisa.", "La distribución horaria es uniforme con picos predecibles, facilitando la automatización."],
            medium: ["Existen picos de demanda imprevistos que generan caídas en el nivel de servicio.", "Alto porcentaje de interacciones fuera de horario laboral (>30%), sugiriendo necesidad de cobertura 24/7."],
            bad: ["Desajuste crónico entre el forecast y el volumen real, resultando en sobrecostes o mal servicio.", "Distribución horaria muy irregular con múltiples picos impredecibles."]
        },
        kpis: [
            { label: "Volumen Mensual", value: `${randomInt(5000, 25000).toLocaleString('es-ES')}` },
            { label: "% Fuera de Horario", value: `${randomInt(15, 45)}%` },
        ],
    },
    performance: {
        icon: Zap,
        titles: ["Rendimiento Operativo", "Optimización de Tiempos"],
        summaries: {
            good: ["El AHT está bien controlado con baja variabilidad (CV<30%), indicando procesos estandarizados.", "Tiempos de espera y post-llamada (ACW) mínimos, maximizando la productividad del agente."],
            medium: ["El AHT es competitivo, pero la variabilidad es alta (CV>40%), sugiriendo inconsistencia en procesos.", "El tiempo en espera (Hold Time) es ligeramente elevado, sugiriendo posibles mejoras en el acceso a la información."],
            bad: ["El AHT excede los benchmarks de la industria con alta variabilidad, impactando directamente en los costes.", "Tiempos de ACW prolongados indican procesos manuales ineficientes o falta de integración de sistemas."]
        },
        kpis: [
            { label: "AHT Promedio", value: `${randomInt(280, 550)}s` },
            { label: "CV AHT", value: `${randomInt(25, 60)}%` },
        ],
    },
    satisfaction: {
        icon: Smile,
        titles: ["Satisfacción y Experiencia", "Voz del Cliente"],
        summaries: {
            good: ["Puntuaciones de CSAT muy positivas con distribución normal, reflejando un proceso estable y consistente.", "El análisis cualitativo muestra un sentimiento mayoritariamente positivo en las interacciones."],
            medium: ["Los indicadores de satisfacción son neutros. La distribución de CSAT muestra cierta bimodalidad.", "Se observan comentarios mixtos, con puntos fuertes en la amabilidad del agente pero debilidades en los tiempos de respuesta."],
            bad: ["Bajas puntuaciones de CSAT con distribución anormal, indicando un proceso inconsistente.", "Los clientes se quejan frecuentemente de largos tiempos de espera, repetición de información y falta de resolución."]
        },
        kpis: [
            { label: "CSAT Promedio", value: `${randomFloat(3.8, 4.9, 1)}/5` },
            { label: "NPS", value: `${randomInt(-20, 55)}` },
        ],
    },
    economy: {
        icon: DollarSign,
        titles: ["Economía y Costes", "Rentabilidad del Servicio"],
        summaries: {
            good: ["El coste por interacción está por debajo del promedio de la industria, indicando una operación rentable.", "El ROI potencial de automatización supera los €200K anuales con payback <12 meses."],
            medium: ["Los costes son estables pero no se observa una tendencia a la baja, sugiriendo un estancamiento en la optimización.", "El ROI potencial es moderado (€100-200K), requiriendo inversión inicial significativa."],
            bad: ["Coste por interacción elevado, erosionando los márgenes de beneficio de la compañía.", "Bajo ROI potencial (<€100K) debido a volumen insuficiente o procesos ya optimizados."]
        },
        kpis: [
            { label: "Coste por Interacción", value: `€${randomFloat(2.5, 9.5, 2)}` },
            { label: "Ahorro Potencial", value: `€${randomInt(50, 250)}K` },
        ],
    },
    efficiency: {
        icon: Target,
        titles: ["Eficiencia", "Resolución y Calidad"],
        summaries: {
            good: ["Alta tasa de resolución en el primer contacto (FCR>85%), minimizando la repetición de llamadas.", "Bajo índice de transferencias y escalaciones (<10%), demostrando un correcto enrutamiento y alto conocimiento del agente."],
            medium: ["La tasa de FCR es aceptable (70-85%), aunque se detectan ciertos tipos de consulta que requieren múltiples contactos.", "Las transferencias son moderadas (10-20%), concentradas en departamentos específicos."],
            bad: ["Bajo FCR (<70%), lo que genera frustración en el cliente y aumenta el volumen de interacciones innecesarias.", "Excesivas transferencias y escalaciones (>20%), creando una experiencia de cliente fragmentada y costosa."]
        },
        kpis: [
            { label: "Tasa FCR", value: `${randomInt(65, 92)}%` },
            { label: "Tasa de Escalación", value: `${randomInt(5, 25)}%` },
        ],
    },
    benchmark: {
        icon: Globe,
        titles: ["Benchmark de Industria", "Contexto Competitivo"],
        summaries: {
            good: ["La operación se sitúa consistentemente por encima del P75 en los KPIs más críticos.", "El rendimiento en eficiencia y calidad es de 'top quartile', representando una ventaja competitiva."],
            medium: ["El rendimiento general está en línea con la mediana de la industria (P50), sin claras fortalezas o debilidades.", "Se observan algunas áreas por debajo del P50 que representan oportunidades de mejora claras."],
            bad: ["La mayoría de los KPIs se encuentran por debajo del P25, indicando una necesidad urgente de mejora.", "El AHT y el CPI son significativamente más altos que los benchmarks, impactando la rentabilidad."]
        },
        kpis: [
            { label: "Posición vs P50 AHT", value: `P${randomInt(30, 70)}` },
            { label: "Posición vs P50 FCR", value: `P${randomInt(30, 70)}` },
        ],
    },
};

const KEY_FINDINGS: Finding[] = [
    { text: "El canal de voz presenta un AHT un 35% superior al del chat, pero una tasa de resolución un 15% mayor.", dimensionId: 'performance' },
    { text: "Un 22% de las transferencias desde 'Soporte Técnico N1' hacia 'Facturación' son incorrectas.", dimensionId: 'efficiency' },
    { text: "El pico de demanda de los lunes por la mañana provoca una caída del Nivel de Servicio al 65%.", dimensionId: 'volumetry_distribution' },
    { text: "El 28% de las interacciones ocurren fuera del horario laboral estándar (8-18h).", dimensionId: 'volumetry_distribution' },
    { text: "Las consultas sobre 'estado del pedido' representan el 30% de las interacciones y tienen alta repetitividad.", dimensionId: 'volumetry_distribution' },
    { text: "Baja puntuación de CSAT en interacciones relacionadas con problemas de facturación.", dimensionId: 'satisfaction' },
    { text: "La variabilidad de AHT (CV=45%) sugiere procesos poco estandarizados.", dimensionId: 'performance' },
];

const RECOMMENDATIONS: Recommendation[] = [
    { text: "Implementar un programa de formación específico para agentes de Facturación sobre los nuevos planes.", dimensionId: 'efficiency', priority: 2 },
    { text: "Desarrollar un bot de estado de pedido para WhatsApp para desviar el 30% de las consultas.", dimensionId: 'volumetry_distribution', priority: 1 },
    { text: "Revisar la planificación de personal (WFM) para los lunes, añadiendo recursos flexibles.", dimensionId: 'volumetry_distribution', priority: 2 },
    { text: "Crear una Knowledge Base más robusta y accesible para reducir el tiempo en espera.", dimensionId: 'performance', priority: 1 },
    { text: "Implementar cobertura 24/7 con agentes virtuales para el 28% de interacciones fuera de horario.", dimensionId: 'volumetry_distribution', priority: 1 },
    { text: "Realizar un análisis de causa raíz sobre las quejas de facturación para mejorar procesos.", dimensionId: 'satisfaction', priority: 3 },
];

// v2.0: Generar distribución horaria realista
const generateHourlyDistribution = (): number[] => {
    // Distribución con picos en 9-11h y 14-17h
    const distribution = Array(24).fill(0).map((_, hour) => {
        if (hour >= 9 && hour <= 11) return randomInt(800, 1200);  // Pico mañana
        if (hour >= 14 && hour <= 17) return randomInt(700, 1000);  // Pico tarde
        if (hour >= 8 && hour <= 18) return randomInt(300, 600);   // Horario laboral
        return randomInt(50, 200);  // Fuera de horario
    });
    return distribution;
};

// v2.0: Calcular % fuera de horario
const calculateOffHoursPct = (hourly_distribution: number[]): number => {
    const total = hourly_distribution.reduce((a, b) => a + b, 0);
    const off_hours = hourly_distribution.slice(0, 8).reduce((a, b) => a + b, 0) +
                      hourly_distribution.slice(19, 24).reduce((a, b) => a + b, 0);
    return off_hours / total;
};

// v2.0: Identificar horas pico
const identifyPeakHours = (hourly_distribution: number[]): number[] => {
    const sorted = [...hourly_distribution].sort((a, b) => b - a);
    const threshold = sorted[2];  // Top 3
    return hourly_distribution
        .map((val, idx) => val >= threshold ? idx : -1)
        .filter(idx => idx !== -1);
};

const generateHeatmapData = (): HeatmapDataPoint[] => {
    const skills = ['Ventas Inbound', 'Soporte Técnico N1', 'Facturación', 'Retención'];
    const COST_PER_HOUR = 25; // €25/hora (estándar industria)
    const COST_PER_SECOND = COST_PER_HOUR / 3600;
    
    return skills.map(skill => {
        const volume = randomInt(800, 2500); // Volumen mensual
        const aht_seconds = randomInt(280, 550); // AHT en segundos
        const annual_volume = volume * 12; // Volumen anual
        const annual_cost = Math.round(annual_volume * aht_seconds * COST_PER_SECOND);
        
        return {
            skill,
            volume,
            aht_seconds,
            metrics: {
                fcr: randomInt(65, 95),
                aht: randomInt(70, 98), 
                csat: randomInt(75, 99),
                quality: randomInt(80, 97)
            },
            annual_cost
        };
    });
};

// v2.0: Añadir segmentación de cliente
const generateOpportunityMatrixData = (): Opportunity[] => {
    const opportunities = [
        { id: 'opp1', name: 'Automatizar consulta de pedidos', savings: 85000, dimensionId: 'volumetry_distribution', customer_segment: 'medium' as CustomerSegment },
        { id: 'opp2', name: 'Implementar Knowledge Base dinámica', savings: 45000, dimensionId: 'performance', customer_segment: 'high' as CustomerSegment },
        { id: 'opp3', name: 'Chatbot de triaje inicial', savings: 120000, dimensionId: 'efficiency', customer_segment: 'medium' as CustomerSegment },
        { id: 'opp4', name: 'Análisis de sentimiento en tiempo real', savings: 30000, dimensionId: 'satisfaction', customer_segment: 'high' as CustomerSegment },
        { id: 'opp5', name: 'Cobertura 24/7 con agentes virtuales', savings: 65000, dimensionId: 'volumetry_distribution', customer_segment: 'low' as CustomerSegment },
    ];
    return opportunities.map(opp => ({ ...opp, impact: randomInt(3, 10), feasibility: randomInt(2, 9) }));
};

// v2.0: Añadir risk level
const generateRoadmapData = (): RoadmapInitiative[] => {
    return [
        { id: 'r1', name: 'Chatbot de estado de pedido', phase: RoadmapPhase.Automate, timeline: 'Q1 2025', investment: 25000, resources: ['1x Bot Developer', 'API Access'], dimensionId: 'volumetry_distribution', risk: 'low' },
        { id: 'r2', name: 'Implementar Knowledge Base dinámica', phase: RoadmapPhase.Assist, timeline: 'Q1 2025', investment: 15000, resources: ['1x PM', 'Content Team'], dimensionId: 'performance', risk: 'low' },
        { id: 'r3', name: 'Agent Assist para sugerencias en real-time', phase: RoadmapPhase.Assist, timeline: 'Q2 2025', investment: 45000, resources: ['2x AI Devs', 'QA Team'], dimensionId: 'efficiency', risk: 'medium' },
        { id: 'r4', name: 'IVR conversacional con IA', phase: RoadmapPhase.Automate, timeline: 'Q3 2025', investment: 60000, resources: ['AI Voice Specialist', 'UX Designer'], dimensionId: 'efficiency', risk: 'medium' },
        { id: 'r5', name: 'Cobertura 24/7 con agentes virtuales', phase: RoadmapPhase.Augment, timeline: 'Q4 2025', investment: 75000, resources: ['Lead AI Engineer', 'Data Scientist'], dimensionId: 'volumetry_distribution', risk: 'high' },
    ];
};

// v2.0: Añadir NPV y costBreakdown
const generateEconomicModelData = (): EconomicModelData => {
    const currentAnnualCost = randomInt(800000, 2500000);
    const annualSavings = randomInt(150000, 500000);
    const futureAnnualCost = currentAnnualCost - annualSavings;
    const initialInvestment = randomInt(40000, 150000);
    const paybackMonths = Math.ceil((initialInvestment / annualSavings) * 12);
    const roi3yr = (((annualSavings * 3) - initialInvestment) / initialInvestment) * 100;
    
    // NPV con tasa de descuento 10%
    const discountRate = 0.10;
    const npv = -initialInvestment + 
                (annualSavings / (1 + discountRate)) +
                (annualSavings / Math.pow(1 + discountRate, 2)) +
                (annualSavings / Math.pow(1 + discountRate, 3));

    const savingsBreakdown = [
        { category: 'Automatización de tareas', amount: annualSavings * 0.45, percentage: 45 },
        { category: 'Eficiencia operativa', amount: annualSavings * 0.30, percentage: 30 },
        { category: 'Mejora FCR', amount: annualSavings * 0.15, percentage: 15 },
        { category: 'Reducción attrition', amount: annualSavings * 0.075, percentage: 7.5 },
        { category: 'Otros', amount: annualSavings * 0.025, percentage: 2.5 },
    ];
    
    const costBreakdown = [
        { category: 'Software y licencias', amount: initialInvestment * 0.43, percentage: 43 },
        { category: 'Implementación', amount: initialInvestment * 0.29, percentage: 29 },
        { category: 'Training y change mgmt', amount: initialInvestment * 0.18, percentage: 18 },
        { category: 'Contingencia', amount: initialInvestment * 0.10, percentage: 10 },
    ];

    return {
        currentAnnualCost,
        futureAnnualCost,
        annualSavings,
        initialInvestment,
        paybackMonths,
        roi3yr: parseFloat(roi3yr.toFixed(1)),
        npv: Math.round(npv),
        savingsBreakdown,
        costBreakdown
    };
};

// v2.0: Añadir percentiles múltiples
const generateBenchmarkData = (): BenchmarkDataPoint[] => {
    const userAHT = randomInt(380, 450);
    const industryAHT = 420;
    const userFCR = randomFloat(0.65, 0.78, 2);
    const industryFCR = 0.72;
    const userCSAT = randomFloat(4.1, 4.6, 1);
    const industryCSAT = 4.3;
    const userCPI = randomFloat(2.8, 4.5, 2);
    const industryCPI = 3.5;

    return [
        { 
            kpi: 'AHT Promedio', 
            userValue: userAHT, 
            userDisplay: `${userAHT}s`, 
            industryValue: industryAHT, 
            industryDisplay: `${industryAHT}s`, 
            percentile: randomInt(40, 75),
            p25: 380,
            p50: 420,
            p75: 460,
            p90: 510
        },
        { 
            kpi: 'Tasa FCR', 
            userValue: userFCR, 
            userDisplay: `${(userFCR * 100).toFixed(0)}%`, 
            industryValue: industryFCR, 
            industryDisplay: `${(industryFCR * 100).toFixed(0)}%`, 
            percentile: randomInt(30, 65),
            p25: 0.65,
            p50: 0.72,
            p75: 0.82,
            p90: 0.88
        },
        { 
            kpi: 'CSAT', 
            userValue: userCSAT, 
            userDisplay: `${userCSAT}/5`, 
            industryValue: industryCSAT, 
            industryDisplay: `${industryCSAT}/5`, 
            percentile: randomInt(45, 80),
            p25: 4.0,
            p50: 4.3,
            p75: 4.6,
            p90: 4.8
        },
        { 
            kpi: 'Coste por Interacción (Voz)', 
            userValue: userCPI, 
            userDisplay: `€${userCPI.toFixed(2)}`, 
            industryValue: industryCPI, 
            industryDisplay: `€${industryCPI.toFixed(2)}`, 
            percentile: randomInt(50, 85),
            p25: 2.8,
            p50: 3.5,
            p75: 4.2,
            p90: 5.0
        },
    ];
};

export const generateAnalysis = (tier: TierKey): AnalysisData => {
  const overallHealthScore = randomInt(55, 95);
  
  const summaryKpis: Kpi[] = [
    { label: "Interacciones Totales", value: randomInt(15000, 50000).toLocaleString('es-ES') },
    { label: "AHT Promedio", value: `${randomInt(300, 480)}s`, change: `-${randomInt(5, 20)}s`, changeType: 'positive' },
    { label: "Tasa FCR", value: `${randomInt(70, 88)}%`, change: `+${randomFloat(0.5, 2, 1)}%`, changeType: 'positive' },
    { label: "CSAT", value: `${randomFloat(4.1, 4.8, 1)}/5`, change: `-${randomFloat(0.1, 0.3, 1)}`, changeType: 'negative' },
  ];

  // v2.0: Solo 6 dimensiones
  const dimensionKeys = ['volumetry_distribution', 'performance', 'satisfaction', 'economy', 'efficiency', 'benchmark'];
  
  const dimensions: DimensionAnalysis[] = dimensionKeys.map(key => {
      const content = DIMENSIONS_CONTENT[key as keyof typeof DIMENSIONS_CONTENT];
      const score = randomInt(50, 98);
      const status = getScoreColor(score);
      
      const dimension: DimensionAnalysis = {
          id: key,
          name: key as any,
          title: randomFromList(content.titles),
          score,
          percentile: randomInt(30, 85),
          summary: randomFromList(content.summaries[status === 'green' ? 'good' : status === 'yellow' ? 'medium' : 'bad']),
          kpi: randomFromList(content.kpis),
          icon: content.icon,
      };
      
      // Añadir distribution_data para volumetry_distribution
      if (key === 'volumetry_distribution') {
          const hourly = generateHourlyDistribution();
          dimension.distribution_data = {
              hourly,
              off_hours_pct: calculateOffHoursPct(hourly),
              peak_hours: identifyPeakHours(hourly)
          };
      }
      
      return dimension;
  });

  // v2.0: Calcular Agentic Readiness Score
  let agenticReadiness = undefined;
  if (tier === 'gold' || tier === 'silver') {
      // Generar datos sintéticos para el algoritmo
      const volumen_mes = randomInt(5000, 25000);
      const aht_values = Array.from({ length: 100 }, () => 
          Math.max(180, normalRandom(420, 120))  // Media 420s, std 120s
      );
      const escalation_rate = randomFloat(0.05, 0.25, 2);
      const cpi_humano = randomFloat(2.5, 5.0, 2);
      const volumen_anual = volumen_mes * 12;
      
      const agenticInput: AgenticReadinessInput = {
          volumen_mes,
          aht_values,
          escalation_rate,
          cpi_humano,
          volumen_anual,
          tier
      };
      
      // Datos adicionales para GOLD
      if (tier === 'gold') {
          const hourly_distribution = dimensions.find(d => d.name === 'volumetry_distribution')?.distribution_data?.hourly;
          const off_hours_pct = dimensions.find(d => d.name === 'volumetry_distribution')?.distribution_data?.off_hours_pct;
          
          agenticInput.structured_fields_pct = randomFloat(0.4, 0.9, 2);
          agenticInput.exception_rate = randomFloat(0.05, 0.25, 2);
          agenticInput.hourly_distribution = hourly_distribution;
          agenticInput.off_hours_pct = off_hours_pct;
          agenticInput.csat_values = Array.from({ length: 100 }, () => 
              Math.max(1, Math.min(5, normalRandom(4.3, 0.8)))
          );
      }
      
      agenticReadiness = calculateAgenticReadinessScore(agenticInput);
  }

  return {
    tier,
    overallHealthScore,
    summaryKpis,
    dimensions,
    keyFindings: [...new Set(Array.from({ length: 3 }, () => randomFromList(KEY_FINDINGS)))],
    recommendations: [...new Set(Array.from({ length: 3 }, () => randomFromList(RECOMMENDATIONS)))],
    heatmap: generateHeatmapData(),
    opportunityMatrix: generateOpportunityMatrixData(),
    roadmap: generateRoadmapData(),
    economicModel: generateEconomicModelData(),
    benchmarkReport: generateBenchmarkData(),
    agenticReadiness
  };
};
