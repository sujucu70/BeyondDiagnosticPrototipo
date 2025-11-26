// constants.ts - v2.0 con 6 dimensiones
import { TiersData, DataRequirementsData } from './types';

export const TIERS: TiersData = {
  gold: {
    name: 'Análisis GOLD',
    price: 4900,
    color: 'bg-yellow-500',
    description: '6 dimensiones completas con algoritmo Agentic Readiness avanzado',
    requirements: 'CCaaS moderno (Genesys, Five9, NICE, Talkdesk)',
    timeline: '3-4 semanas',
    features: [
      '6 dimensiones completas',
      'Algoritmo Agentic Readiness avanzado (6 sub-factores)',
      'Análisis de distribución horaria',
      'Segmentación de clientes (opcional)',
      'Benchmark con percentiles múltiples (P25, P50, P75, P90)',
      'Roadmap ejecutable con 3 waves',
      'Modelo económico con NPV y análisis de sensibilidad',
      'Sesión de presentación incluida'
    ]
  },
  silver: {
    name: 'Análisis SILVER',
    price: 3500,
    color: 'bg-gray-400',
    description: '4 dimensiones core con Agentic Readiness simplificado',
    requirements: 'Sistema ACD/PBX con reporting básico',
    timeline: '2-3 semanas',
    features: [
      '4 dimensiones (Volumetría, Rendimiento, Economía, Agentic Readiness)',
      'Algoritmo Agentic Readiness simplificado (3 sub-factores)',
      'Roadmap de implementación',
      'Opportunity Matrix',
      'Economic Model básico',
      'Dashboard interactivo'
    ]
  },
  bronze: {
    name: 'Análisis EXPRESS',
    price: 1950,
    color: 'bg-orange-600',
    description: '3 dimensiones fundamentales sin Agentic Readiness',
    requirements: 'Exportación básica de reportes',
    timeline: '1-2 semanas',
    features: [
      '3 dimensiones core (Volumetría, Rendimiento, Economía)',
      'Roadmap cualitativo',
      'Análisis básico',
      'Recomendaciones estratégicas',
      'Reporte ejecutivo'
    ]
  }
};

export const DATA_REQUIREMENTS: DataRequirementsData = {
  gold: {
    mandatory: [
      {
        category: '📊 Datos de Interacciones (CORE)',
        fields: [
          { name: 'interaction_id', type: 'String único', example: 'INT-2024-001234', critical: true },
          { name: 'timestamp_start', type: 'DateTime', example: '2024-10-15 09:23:45', critical: true },
          { name: 'timestamp_end', type: 'DateTime', example: '2024-10-15 09:29:12', critical: true },
          { name: 'channel', type: 'String', example: 'voice, chat, email, whatsapp', critical: true },
          { name: 'skill / queue', type: 'String', example: 'soporte_tecnico, facturacion, renovaciones', critical: true },
          { name: 'agent_id', type: 'String', example: 'AGT-0234', critical: true },
          { name: 'hour_of_day', type: 'Integer (0-23)', example: '14', critical: false },
          { name: 'is_off_hours', type: 'Boolean', example: 'TRUE / FALSE', critical: false }
        ]
      },
      {
        category: '⏱️ Métricas de Tiempo (RENDIMIENTO)',
        fields: [
          { name: 'aht', type: 'Integer (segundos)', example: '380', critical: true },
          { name: 'tmo', type: 'Integer (segundos)', example: '360', critical: false },
          { name: 'talk_time', type: 'Integer (segundos)', example: '320', critical: true },
          { name: 'hold_time', type: 'Integer (segundos)', example: '45', critical: true },
          { name: 'acw', type: 'Integer (segundos)', example: '15', critical: true },
          { name: 'speed_of_answer', type: 'Integer (segundos)', example: '12', critical: false }
        ]
      },
      {
        category: '✅ Métricas de Resolución (EFICIENCIA)',
        fields: [
          { name: 'resolved', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'fcr', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'transferred', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'escalated', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'abandoned', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'transfer_to_skill', type: 'String', example: 'supervisor, tier2', critical: false }
        ]
      },
      {
        category: '👤 Datos de Cliente (SEGMENTACIÓN)',
        fields: [
          { name: 'customer_id', type: 'String único', example: 'CUST-56789', critical: true },
          { name: 'customer_segment', type: 'String', example: 'high | medium | low', critical: false },
          { name: 'contact_reason', type: 'String', example: 'consulta_saldo, reclamacion', critical: false },
          { name: 'contact_reason_category', type: 'String', example: 'billing, technical, sales', critical: false }
        ]
      },
      {
        category: '😊 Satisfacción (CSAT)',
        fields: [
          { name: 'csat_score', type: 'Integer', example: '1-5 o 1-10', critical: false },
          { name: 'nps_score', type: 'Integer', example: '-100 a +100', critical: false },
          { name: 'ces_score', type: 'Integer', example: '1-7', critical: false }
        ]
      }
    ],
    format: 'CSV, Excel (.xlsx), JSON, o Google Sheets',
    volumeMin: 'Mínimo 500 interacciones (ideal 2,000+)'
  },
  silver: {
    mandatory: [
      {
        category: '📊 Datos de Interacciones (CORE)',
        fields: [
          { name: 'interaction_id', type: 'String único', example: 'INT-2024-001234', critical: true },
          { name: 'timestamp_start', type: 'DateTime', example: '2024-10-15 09:23:45', critical: true },
          { name: 'timestamp_end', type: 'DateTime', example: '2024-10-15 09:29:12', critical: true },
          { name: 'channel', type: 'String', example: 'voice, chat, email', critical: true },
          { name: 'skill / queue', type: 'String', example: 'soporte_tecnico, facturacion', critical: true }
        ]
      },
      {
        category: '⏱️ Métricas de Tiempo (RENDIMIENTO)',
        fields: [
          { name: 'aht', type: 'Integer (segundos)', example: '380', critical: true },
          { name: 'talk_time', type: 'Integer (segundos)', example: '320', critical: true }
        ]
      },
      {
        category: '✅ Métricas de Resolución (EFICIENCIA)',
        fields: [
          { name: 'resolved', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'transferred', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'escalated', type: 'Boolean', example: 'TRUE / FALSE', critical: false }
        ]
      },
      {
        category: '👤 Datos de Cliente',
        fields: [
          { name: 'customer_id', type: 'String único', example: 'CUST-56789', critical: false }
        ]
      }
    ],
    format: 'CSV, Excel (.xlsx), JSON',
    volumeMin: 'Mínimo 300 interacciones'
  },
  bronze: {
    mandatory: [
      {
        category: '📊 Datos de Interacciones (CORE)',
        fields: [
          { name: 'timestamp', type: 'DateTime', example: '2024-10-15 09:23:45', critical: true },
          { name: 'channel', type: 'String', example: 'voice, chat, email', critical: true },
          { name: 'skill / queue', type: 'String', example: 'soporte_tecnico', critical: true }
        ]
      },
      {
        category: '⏱️ Métricas de Tiempo',
        fields: [
          { name: 'aht', type: 'Integer (segundos)', example: '380', critical: true }
        ]
      },
      {
        category: '✅ Métricas de Resolución',
        fields: [
          { name: 'resolved', type: 'Boolean', example: 'TRUE / FALSE', critical: true }
        ]
      }
    ],
    format: 'CSV, Excel (.xlsx)',
    volumeMin: 'Mínimo 100 interacciones'
  }
};

// v2.0: Dimensiones actualizadas (6 en lugar de 8)
export const DIMENSION_NAMES = {
  volumetry_distribution: 'Volumetría y Distribución Horaria',
  performance: 'Rendimiento',
  satisfaction: 'Satisfacción',
  economy: 'Economía',
  efficiency: 'Eficiencia',  // Fusiona Eficiencia + Efectividad
  benchmark: 'Benchmark'
};

// v2.0: Ponderaciones para Agentic Readiness Score
export const AGENTIC_READINESS_WEIGHTS = {
  repetitividad: 0.25,
  predictibilidad: 0.20,
  estructuracion: 0.15,
  complejidad_inversa: 0.15,
  estabilidad: 0.10,
  roi: 0.15
};

// v2.0: Thresholds para normalización
export const AGENTIC_READINESS_THRESHOLDS = {
  repetitividad: {
    k: 0.015,
    x0: 250  // 250 interacciones/mes = score 5
  },
  predictibilidad: {
    cv_aht_excellent: 0.3,
    cv_aht_poor: 0.6,
    escalation_excellent: 0.05,
    escalation_poor: 0.20
  },
  roi: {
    k: 0.00002,
    x0: 125000  // €125K ahorro anual = score 5
  }
};

// v2.0: Multiplicadores de segmentación para Opportunity Matrix
export const SEGMENT_MULTIPLIERS = {
  high: 1.5,
  medium: 1.0,
  low: 0.7
};
