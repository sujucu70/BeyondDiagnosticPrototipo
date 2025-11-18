import { TierKey, AnalysisData, Kpi, DimensionAnalysis, HeatmapDataPoint, Opportunity, RoadmapInitiative, RoadmapPhase, Finding, Recommendation, EconomicModelData, BenchmarkDataPoint } from '../types';
// FIX: Import icons for each dimension.
import { LucideIcon, BarChartHorizontal, Zap, Target, Smile, BrainCircuit, DollarSign, Bot, Globe } from 'lucide-react';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomFromList = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getScoreColor = (score: number): 'green' | 'yellow' | 'red' => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
};

// FIX: Added icon property to dimension content.
const DIMENSIONS_CONTENT: Record<string, { titles: string[], summaries: Record<'good' | 'medium' | 'bad', string[]>, kpis: Kpi[], icon: LucideIcon }> = {
    demand: {
        icon: BarChartHorizontal,
        titles: ["Volumetría y Distribución", "Análisis de la Demanda"],
        summaries: {
            good: ["El volumen de interacciones se alinea con las previsiones, permitiendo una planificación de personal precisa.", "La distribución de contactos por motivo está claramente identificada, facilitando la automatización."],
            medium: ["Existen picos de demanda imprevistos que generan caídas en el nivel de servicio.", "Ciertos motivos de contacto de bajo valor todavía consumen una cantidad significativa de tiempo de agente."],
            bad: ["Desajuste crónico entre el forecast y el volumen real, resultando en sobrecostes o mal servicio.", "Alta tasa de contactos evitables que podrían resolverse con mejoras en la web, la app o el IVR."]
        },
        kpis: [ { label: "Precisión Forecast", value: `${randomInt(70, 96)}%` }, { label: "Tasa de Autoservicio", value: `${randomInt(20, 65)}%` }, ],
    },
    efficiency: {
        icon: Zap,
        titles: ["Eficiencia Operativa", "Optimización de Tiempos"],
        summaries: {
            good: ["El AHT está bien controlado, indicando una gestión eficiente de las interacciones y procesos ágiles.", "Tiempos de espera y post-llamada (ACW) mínimos, maximizando la productividad del agente."],
            medium: ["El AHT es competitivo, pero existen picos en horas de alta demanda que podrían optimizarse.", "El tiempo en espera (Hold Time) es ligeramente elevado, sugiriendo posibles mejoras en el acceso a la información."],
            bad: ["El AHT excede los benchmarks de la industria, impactando directamente en los costes operativos.", "Tiempos de ACW prolongados indican procesos manuales ineficientes o falta de integración de sistemas."]
        },
        kpis: [ { label: "AHT Promedio", value: `${randomInt(280, 550)}s` }, { label: "ACW Promedio", value: `${randomInt(20, 90)}s` }, ],
    },
    effectiveness: {
        icon: Target,
        titles: ["Efectividad y Resolución", "Calidad del Servicio"],
        summaries: {
            good: ["Alta tasa de resolución en el primer contacto (FCR), minimizando la repetición de llamadas y mejorando la satisfacción.", "Bajo índice de transferencias, lo que demuestra un correcto enrutamiento y un alto conocimiento del agente."],
            medium: ["La tasa de FCR es aceptable, aunque se detectan ciertos tipos de consulta que requieren múltiples contactos.", "Las transferencias son moderadas, pero se concentran en departamentos específicos, indicando una oportunidad de formación."],
            bad: ["Bajo FCR, lo que genera frustración en el cliente y aumenta el volumen de interacciones innecesarias.", "Excesivas transferencias entre agentes y departamentos, creando una experiencia de cliente fragmentada y costosa."]
        },
        kpis: [ { label: "Tasa FCR", value: `${randomInt(65, 92)}%` }, { label: "Tasa de Transferencia", value: `${randomInt(5, 25)}%` }, ],
    },
    experience: {
        icon: Smile,
        titles: ["Satisfacción y Experiencia", "Voz del Cliente"],
        summaries: {
            good: ["Puntuaciones de CSAT y NPS muy positivas, reflejando una alta satisfacción y lealtad del cliente.", "El análisis cualitativo muestra un sentimiento mayoritariamente positivo en las interacciones."],
            medium: ["Los indicadores de satisfacción son neutros. Los clientes perciben el servicio como funcional pero no excepcional.", "Se observan comentarios mixtos, con puntos fuertes en la amabilidad del agente pero debilidades en los tiempos de respuesta."],
            bad: ["Bajas puntuaciones de CSAT y un NPS negativo, indicando un riesgo significativo de pérdida de clientes (churn).", "Los clientes se quejan frecuentemente de largos tiempos de espera, repetición de información y falta de resolución."]
        },
        kpis: [ { label: "CSAT Promedio", value: `${randomFloat(3.8, 4.9, 1)}/5` }, { label: "NPS", value: `${randomInt(-20, 55)}` }, ],
    },
     complexity: {
        icon: BrainCircuit,
        titles: ["Complejidad y Predictibilidad", "Drivers de Esfuerzo"],
        summaries: {
            good: ["Los procesos están estandarizados, con un bajo número de interacciones que requieren gestión por excepción.", "Claro sistema de códigos de disposición que permite un análisis profundo de las causas raíz."],
            medium: ["Un porcentaje moderado de interacciones se desvía del flujo estándar, requiriendo intervención de supervisores.", "El uso de los códigos de disposición es inconsistente entre los agentes."],
            bad: ["Alto volumen de excepciones que consumen recursos de personal senior y ralentizan la resolución.", "Falta de datos estructurados sobre el motivo real de la interacción, dificultando la identificación de problemas recurrentes."]
        },
        kpis: [ { label: "Tasa de Excepciones", value: `${randomInt(3, 18)}%` }, { label: "Entropía de temas", value: `${randomFloat(1.8, 5.5, 1)} bits` }, ],
    },
    cost: {
        icon: DollarSign,
        titles: ["Economía y Costes", "Rentabilidad del Servicio"],
        summaries: {
            good: ["El coste por interacción está por debajo del promedio de la industria, indicando una operación rentable.", "La inversión en tecnología se traduce en una reducción demostrable de los costes operativos."],
            medium: ["Los costes son estables pero no se observa una tendencia a la baja, sugiriendo un estancamiento en la optimización.", "El coste por contacto varía significativamente entre canales, con el canal de voz siendo el más oneroso."],
            bad: ["Coste por interacción elevado, erosionando los márgenes de beneficio de la compañía.", "Falta de visibilidad sobre los verdaderos impulsores de costes en el contact center."]
        },
        kpis: [ { label: "Coste por Interacción", value: `€${randomFloat(2.5, 9.5, 2)}` }, { label: "Ahorro Potencial", value: `€${randomInt(50, 250)}k` }, ],
    },
    agent: {
        icon: Bot,
        titles: ["Agentic Readiness", "Potencial de Automatización"],
        summaries: {
            good: ["Alta repetitividad y predictibilidad en múltiples procesos, indicando un alto potencial para la automatización completa.", "Los datos están bien estructurados, facilitando la implementación de soluciones de IA y bots."],
            medium: ["Existen varios candidatos para automatización parcial o 'Agent Assist', aunque la complejidad de juicio es media.", "El ROI potencial es atractivo, pero requiere una inversión inicial moderada en tecnología y formación."],
            bad: ["Procesos muy variables y poco predecibles, que requieren un alto grado de juicio humano.", "Baja calidad de los datos y falta de estructuración, lo que dificulta cualquier iniciativa de automatización."]
        },
        kpis: [ { label: "Procesos Automatizables", value: `${randomInt(5, 15)}` }, { label: "% Datos Estructurados", value: `${randomInt(40, 95)}%` }, ],
    },
    benchmark: {
        icon: Globe,
        titles: ["Benchmark de Industria", "Contexto Competitivo"],
        summaries: {
            good: ["La operación se sitúa consistentemente por encima del promedio de la industria en los KPIs más críticos.", "El rendimiento en eficiencia y calidad es de 'top quartile', representando una ventaja competitiva."],
            medium: ["El rendimiento general está en línea con la media de la industria, sin claras fortalezas o debilidades.", "Se observan algunas áreas por debajo del P50 que representan oportunidades de mejora claras."],
            bad: ["La mayoría de los KPIs se encuentran por debajo del promedio del sector, indicando una necesidad urgente de mejora.", "El AHT y el CPI son significativamente más altos que los benchmarks, impactando la rentabilidad."]
        },
        kpis: [ { label: "Posición vs P50 AHT", value: `P${randomInt(30, 70)}` }, { label: "Posición vs P50 FCR", value: `P${randomInt(30, 70)}` }, ],
    },
};

const KEY_FINDINGS: Finding[] = [
    { text: "El canal de voz presenta un AHT un 35% superior al del chat, pero una tasa de resolución un 15% mayor.", dimensionId: 'efficiency' },
    { text: "Un 22% de las transferencias desde 'Soporte Técnico N1' hacia 'Facturación' son incorrectas.", dimensionId: 'effectiveness' },
    { text: "El pico de demanda de los lunes por la mañana provoca una caída del Nivel de Servicio al 65%.", dimensionId: 'demand' },
    { text: "Los agentes con menos de 3 meses de antigüedad tienen un ACW un 50% más alto que la media.", dimensionId: 'agent' },
    { text: "Las consultas sobre 'estado del pedido' representan el 30% de las interacciones.", dimensionId: 'demand' },
    { text: "Baja puntuación de CSAT en interacciones relacionadas con problemas de facturación.", dimensionId: 'experience' },
];

const RECOMMENDATIONS: Recommendation[] = [
    { text: "Implementar un programa de formación específico para agentes de Facturación sobre los nuevos planes.", dimensionId: 'effectiveness' },
    { text: "Desarrollar un bot de estado de pedido para WhatsApp para desviar el 30% de las consultas.", dimensionId: 'demand' },
    { text: "Revisar la planificación de personal (WFM) para los lunes, añadiendo recursos flexibles.", dimensionId: 'demand' },
    { text: "Crear una Knowledge Base más robusta y accesible para reducir el tiempo en espera.", dimensionId: 'efficiency' },
    { text: "Lanzar una iniciativa de 'coaching' entre pares para reducir el ACW de los nuevos agentes.", dimensionId: 'agent' },
    { text: "Realizar un análisis de causa raíz sobre las quejas de facturación para mejorar procesos.", dimensionId: 'experience' },
]

const generateHeatmapData = (): HeatmapDataPoint[] => {
    const skills = ['Ventas Inbound', 'Soporte Técnico N1', 'Facturación', 'Retención'];
    return skills.map(skill => ({
        skill,
        metrics: {
            fcr: randomInt(65, 95),
            aht: randomInt(70, 98), 
            csat: randomInt(75, 99),
            quality: randomInt(80, 97)
        }
    }));
};

const generateOpportunityMatrixData = (): Opportunity[] => {
    const opportunities = [
        { id: 'opp1', name: 'Automatizar consulta de pedidos', savings: 85000, dimensionId: 'demand' },
        { id: 'opp2', name: 'Implementar Knowledge Base dinámica', savings: 45000, dimensionId: 'efficiency' },
        { id: 'opp3', name: 'Chatbot de triaje inicial', savings: 120000, dimensionId: 'effectiveness' },
        { id: 'opp4', name: 'Análisis de sentimiento en tiempo real', savings: 30000, dimensionId: 'experience' },
        { id: 'opp5', name: 'Formación en soft-skills', savings: 20000, dimensionId: 'agent' },
    ];
    return opportunities.map(opp => ({ ...opp, impact: randomInt(3, 10), feasibility: randomInt(2, 9) }));
};

const generateRoadmapData = (): RoadmapInitiative[] => {
    return [
        { id: 'r1', name: 'Chatbot de estado de pedido', phase: RoadmapPhase.Automate, timeline: 'Q1 2025', investment: 25000, resources: ['1x Bot Developer', 'API Access'], dimensionId: 'demand' },
        { id: 'r2', name: 'Implementar Knowledge Base dinámica', phase: RoadmapPhase.Assist, timeline: 'Q1 2025', investment: 15000, resources: ['1x PM', 'Content Team'], dimensionId: 'efficiency' },
        { id: 'r3', name: 'Agent Assist para sugerencias en real-time', phase: RoadmapPhase.Assist, timeline: 'Q2 2025', investment: 45000, resources: ['2x AI Devs', 'QA Team'], dimensionId: 'agent' },
        { id: 'r4', name: 'IVR conversacional con IA', phase: RoadmapPhase.Automate, timeline: 'Q3 2025', investment: 60000, resources: ['AI Voice Specialist', 'UX Designer'], dimensionId: 'effectiveness' },
        { id: 'r5', name: 'Co-pilot para agentes en tareas complejas', phase: RoadmapPhase.Augment, timeline: 'Q4 2025', investment: 75000, resources: ['Lead AI Engineer', 'Data Scientist'], dimensionId: 'complexity' },
    ];
};

const generateEconomicModelData = (): EconomicModelData => {
    const currentAnnualCost = randomInt(800000, 2500000);
    const annualSavings = randomInt(150000, 500000);
    const futureAnnualCost = currentAnnualCost - annualSavings;
    const initialInvestment = randomInt(40000, 150000);
    const paybackMonths = Math.ceil((initialInvestment / annualSavings) * 12);
    const roi3yr = (((annualSavings * 3) - initialInvestment) / initialInvestment) * 100;

    // Generate savings breakdown
    const savingsBreakdown = [
        { category: 'Automatización de tareas', amount: annualSavings * 0.45, percentage: 45 },
        { category: 'Eficiencia operativa', amount: annualSavings * 0.30, percentage: 30 },
        { category: 'Mejora FCR', amount: annualSavings * 0.15, percentage: 15 },
        { category: 'Reducción attrition', amount: annualSavings * 0.075, percentage: 7.5 },
        { category: 'Otros', amount: annualSavings * 0.025, percentage: 2.5 },
    ];

    return {
        currentAnnualCost,
        futureAnnualCost,
        annualSavings,
        initialInvestment,
        paybackMonths,
        roi3yr: parseFloat(roi3yr.toFixed(1)),
        savingsBreakdown
    };
};

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
        { kpi: 'AHT Promedio', userValue: userAHT, userDisplay: `${userAHT}s`, industryValue: industryAHT, industryDisplay: `${industryAHT}s`, percentile: randomInt(40, 75) },
        { kpi: 'Tasa FCR', userValue: userFCR, userDisplay: `${(userFCR * 100).toFixed(0)}%`, industryValue: industryFCR, industryDisplay: `${(industryFCR * 100).toFixed(0)}%`, percentile: randomInt(30, 65) },
        { kpi: 'CSAT', userValue: userCSAT, userDisplay: `${userCSAT}/5`, industryValue: industryCSAT, industryDisplay: `${industryCSAT}/5`, percentile: randomInt(45, 80) },
        { kpi: 'Coste por Interacción (Voz)', userValue: userCPI, userDisplay: `€${userCPI.toFixed(2)}`, industryValue: industryCPI, industryDisplay: `€${industryCPI.toFixed(2)}`, percentile: randomInt(50, 85) },
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

  const dimensions: DimensionAnalysis[] = Object.entries(DIMENSIONS_CONTENT).map(([key, content]) => {
      const score = randomInt(50, 98);
      const status = getScoreColor(score);
      return {
          id: key,
          title: randomFromList(content.titles),
          score,
          summary: randomFromList(content.summaries[status === 'green' ? 'good' : status === 'yellow' ? 'medium' : 'bad']),
          kpi: randomFromList(content.kpis),
          // FIX: Pass icon from dimension content to the analysis data.
          icon: content.icon,
      }
  });

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
  };
};
