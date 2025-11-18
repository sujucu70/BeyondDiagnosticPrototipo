
import { TiersData, DataRequirementsData } from './types';

export const TIERS: TiersData = {
  gold: {
    name: 'Análisis GOLD',
    price: 4900,
    color: 'bg-yellow-500',
    description: '8 dimensiones completas con análisis avanzado',
    requirements: 'CCaaS moderno (Genesys, Five9, NICE, Talkdesk)',
    timeline: '3-4 semanas',
    features: [
      'Análisis de 8 dimensiones completo',
      'Roadmap ejecutable detallado',
      'Modelo económico con ROI',
      'Sesión de presentación incluida',
      'Soporte prioritario'
    ]
  },
  silver: {
    name: 'Análisis SILVER',
    price: 3500,
    color: 'bg-gray-400',
    description: '6 dimensiones core con datos estándar',
    requirements: 'Sistema ACD/PBX con reporting básico',
    timeline: '2-3 semanas',
    features: [
      'Análisis de 6 dimensiones core',
      'Roadmap ejecutable',
      'Modelo económico con ROI',
      'Dashboard interactivo'
    ]
  },
  bronze: {
    name: 'Análisis EXPRESS',
    price: 1950,
    color: 'bg-orange-600',
    description: '3 dimensiones fundamentales',
    requirements: 'Exportación básica de reportes',
    timeline: '1-2 semanas',
    features: [
      'Análisis de 3 dimensiones clave',
      'Roadmap básico',
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
          { name: 'agent_id', type: 'String', example: 'AGT-0234', critical: true }
        ]
      },
      {
        category: '⏱️ Métricas de Tiempo (EFICIENCIA)',
        fields: [
          { name: 'aht', type: 'Integer (segundos)', example: '380', critical: true },
          { name: 'talk_time', type: 'Integer (segundos)', example: '320', critical: true },
          { name: 'hold_time', type: 'Integer (segundos)', example: '45', critical: true },
          { name: 'acw', type: 'Integer (segundos)', example: '15', critical: true },
          { name: 'speed_of_answer', type: 'Integer (segundos)', example: '12', critical: false }
        ]
      },
      {
        category: '✅ Métricas de Resolución (EFECTIVIDAD)',
        fields: [
          { name: 'resolved', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'transferred', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'abandoned', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'transfer_to_skill', type: 'String', example: 'supervisor, tier2', critical: false }
        ]
      },
      {
        category: '👤 Datos de Cliente (REINCIDENCIA)',
        fields: [
          { name: 'customer_id', type: 'String único', example: 'CUST-56789', critical: true },
          { name: 'contact_reason', type: 'String', example: 'consulta_saldo, reclamacion', critical: false }
        ]
      },
      {
        category: '😊 Satisfacción (si disponible)',
        fields: [
          { name: 'csat_score', type: 'Integer', example: '1-5 o 1-10', critical: false },
          { name: 'nps_score', type: 'Integer', example: '-100 a +100', critical: false },
          { name: 'ces_score', type: 'Integer', example: '1-7', critical: false }
        ]
      },
      {
        category: '📝 Datos Avanzados (COMPLEJIDAD - GOLD only)',
        fields: [
          { name: 'call_transcription', type: 'Text', example: 'Transcripción completa o notas', critical: false },
          { name: 'disposition_code', type: 'String', example: 'resuelto, escalado, callback', critical: false },
          { name: 'exception_flag', type: 'Boolean', example: 'TRUE si requirió aprobación manual', critical: false },
          { name: 'structured_fields_pct', type: 'Float', example: '0.75 (75% datos estructurados)', critical: false }
        ]
      },
      {
        category: '💰 Datos Económicos',
        fields: [
          { name: 'labor_cost_per_hour', type: 'Float', example: '25.00 (coste/hora agente)', critical: true },
          { name: 'overhead_rate', type: 'Float', example: '0.15 (15% overhead)', critical: false },
          { name: 'tech_licenses_annual', type: 'Float', example: '50000 (coste anual tecnología)', critical: false }
        ]
      }
    ],
    format: 'CSV o Excel con 6+ meses de datos históricos (mínimo 3 meses)',
    volumeMin: '10,000+ interacciones'
  },
  silver: {
    mandatory: [
      {
        category: '📊 Datos de Interacciones (CORE)',
        fields: [
          { name: 'interaction_id', type: 'String único', example: 'INT-2024-001234', critical: true },
          { name: 'timestamp_start', type: 'DateTime', example: '2024-10-15 09:23:45', critical: true },
          { name: 'timestamp_end', type: 'DateTime', example: '2024-10-15 09:29:12', critical: true },
          { name: 'channel', type: 'String', example: 'voice, chat, email, whatsapp', critical: true },
          { name: 'skill / queue', type: 'String', example: 'soporte_tecnico, facturacion', critical: true },
          { name: 'agent_id', type: 'String', example: 'AGT-0234', critical: true }
        ]
      },
      {
        category: '⏱️ Métricas de Tiempo',
        fields: [
          { name: 'aht', type: 'Integer (segundos)', example: '380', critical: true },
          { name: 'talk_time', type: 'Integer (segundos)', example: '320', critical: false },
          { name: 'hold_time', type: 'Integer (segundos)', example: '45', critical: false },
          { name: 'acw', type: 'Integer (segundos)', example: '15', critical: false }
        ]
      },
      {
        category: '✅ Métricas de Resolución',
        fields: [
          { name: 'resolved', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'transferred', type: 'Boolean', example: 'TRUE / FALSE', critical: true },
          { name: 'abandoned', type: 'Boolean', example: 'TRUE / FALSE', critical: false }
        ]
      },
      {
        category: '👤 Datos de Cliente (opcional pero recomendado)',
        fields: [
          { name: 'customer_id', type: 'String', example: 'CUST-56789', critical: false }
        ]
      },
      {
        category: '💰 Datos Económicos',
        fields: [
          { name: 'labor_cost_per_hour', type: 'Float', example: '25.00', critical: true }
        ]
      }
    ],
    format: 'CSV o Excel con 3+ meses de datos históricos',
    volumeMin: '5,000+ interacciones'
  },
  bronze: {
    mandatory: [
      {
        category: '📊 Datos Básicos de Interacciones',
        fields: [
          { name: 'fecha', type: 'Date', example: '2024-10-15', critical: true },
          { name: 'hora', type: 'Time', example: '09:23', critical: true },
          { name: 'canal', type: 'String', example: 'voz, chat, email', critical: true },
          { name: 'skill / tipo', type: 'String', example: 'soporte, ventas, facturacion', critical: true },
          { name: 'duracion_minutos', type: 'Float', example: '5.5', critical: true }
        ]
      },
      {
        category: '💰 Información de Costes',
        fields: [
          { name: 'coste_hora_agente', type: 'Float', example: '25.00', critical: true },
          { name: 'num_agentes_promedio', type: 'Integer', example: '35', critical: false }
        ]
      }
    ],
    format: 'CSV, Excel o incluso reportes PDF (los procesamos nosotros)',
    volumeMin: '2,000+ interacciones'
  }
};
