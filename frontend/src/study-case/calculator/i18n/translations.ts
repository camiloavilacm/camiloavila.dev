/**
 * Ecowoman Days - Multilingual Translations
 * Languages supported:
 * - English (en) - Default
 * - Spanish (es)
 * - Portuguese (pt)
 * - German (de)
 */

export type Language = 'en' | 'es' | 'pt' | 'de';

export interface LanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'Español', shortLabel: 'ES', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', shortLabel: 'PT', flag: '🇵🇹' },
  { code: 'de', label: 'Deutsch', shortLabel: 'DE', flag: '🇩🇪' },
];

export interface TranslationStrings {
  header: {
    title: string;
    tagline: string;
    navYourCycle: string;
    navRecommendedPacks: string;
    navWashingRoutine: string;
    summaryBadge: (underwear: number, pads: number) => string;
    compactSummaryBadge: (underwear: number, pads: number) => string;
    languageAria: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    friendlyNoteTitle: string;
    friendlyNoteBody: string;
    imagePill: string;
  };
  cycleProfile: {
    step: string;
    title: string;
    description: string;
    durationLabel: string;
    durationDaysBadge: (days: number) => string;
    daysUnit: string;
    durationNotes: {
      3: string;
      4: string;
      5: string;
    };
    flowLabel: string;
    flows: {
      1: { name: string; tag: string; desc: string };
      2: { name: string; tag: string; desc: string };
      3: { name: string; tag: string; desc: string };
    };
  };
  packs: {
    headerTitle: string;
    headerSoldIn: string;
    headerApprox: string;
    pack1Eyebrow: string;
    pack1Title: string;
    pack1Subtitle: string;
    pack1TotalLabel: string;
    pack1BestLabel: string;
    pack1BufferText: (needed: number, excess: number) => string;
    pack1PantiesLabel: string;
    pack1BoxersLabel: string;
    unitsSuffix: string;
    pack2Eyebrow: string;
    pack2Title: string;
    pack2Subtitle: string;
    pack2TotalLabel: string;
    pack2BestLabel: string;
    pack2BufferText: (needed: number, excess: number) => string;
    pack2PadsLabel: string;
    padsRecommendedSuffix: string;
    investmentTitle: string;
    investmentBody: (underwear: number, pads: number, total: number) => string;
    zeroWastePill: string;
  };
  routine: {
    title: string;
    subtitle: (days: number) => string;
    allDays: (days: number) => string;
    dayLabel: (day: number) => string;
    gentleRhythmTitle: string;
    gentleRhythmBody: string;
    phase1Title: string;
    phase1Range: string;
    phase1Desc: string;
    phase2Title: string;
    phase2Range: string;
    phase2Desc: string;
    phase3Title: string;
    phase3Range: string;
    phase3Desc: string;
    tableColTime: string;
    tableColFlow: string;
    tableColProtection: string;
    tableColStatus: string;
    tableColDrawer: string;
    blockMorning: string;
    blockAfternoon: string;
    blockNight: string;
    flowLight: string;
    flowMedium: string;
    flowHeavy: string;
    flowNone: string;
    itemPad: (count: number) => string;
    itemPanty: (count: number) => string;
    itemBoxer: (count: number) => string;
    itemRest: string;
    statusCleanReady: string;
    statusAirDrying: string;
    statusFirstWear: string;
    statusCleanActive: string;
  };
  footer: {
    brandTitle: string;
    brandDesc: string;
    testSuiteLabel: string;
    allRights: string;
  };
  packCombinations: {
    packOf: (size: number) => string;
    noPacks: string;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  // ==========================================================================
  // ENGLISH (DEFAULT)
  // ==========================================================================
  en: {
    header: {
      title: 'Ecowoman days',
      tagline: 'Reusable Period Care Pack Recommender',
      navYourCycle: 'Your Cycle',
      navRecommendedPacks: 'Recommended Packs',
      navWashingRoutine: 'Washing Routine',
      summaryBadge: (u, p) => `${u} Period Underwear · ${p} Menstrual Pads`,
      compactSummaryBadge: (u, p) => `${u} Underwear · ${p} Pads`,
      languageAria: 'Select language',
    },
    hero: {
      badge: 'Ecowoman Days · Personalized Pack Calculator',
      title: 'Ecowoman days',
      subtitle:
        'Create your ideal pack by mixing different styles, sizes and colours. Add 3, 5 or 7 items to your cart and find the exact combination you need for your entire period.',
      friendlyNoteTitle: 'Friendly Note:',
      friendlyNoteBody:
        "Our calculation is an approximate guide to help you estimate how many reusable pieces you'll need based on your typical flow and a single mid-cycle wash. Feel free to adjust to what feels right for your body!",
      imagePill: 'Period Panties, Boxers & Pads',
    },
    cycleProfile: {
      step: 'Step 1 · Tell us about your cycle',
      title: 'Your Cycle Profile',
      description:
        'Select your period duration and general flow level to calculate your reusable product requirements instantly.',
      durationLabel: 'How many days does your period usually last?',
      durationDaysBadge: (days) => `${days} Days`,
      daysUnit: 'Days',
      durationNotes: {
        3: 'A shorter 3-day cycle. Your items are washed once on Day 2 night and ready for Day 3.',
        4: 'A classic 4-day period. Freshly washed pieces comfortably cover your final days.',
        5: 'A full 5-day cycle. Clean washed pieces cover Day 3 & 4, tapering off gently on Day 5.',
      },
      flowLabel: 'How would you describe your flow?',
      flows: {
        1: {
          name: 'Light Flow',
          tag: 'Gentle',
          desc: 'Gentle, lighter days. Perfect for breathable period panties and light menstrual pads.',
        },
        2: {
          name: 'Medium Flow',
          tag: 'Moderate',
          desc: 'Balanced, steady flow. Uses supportive period panties and menstrual boxers with daytime pads.',
        },
        3: {
          name: 'Heavy Flow',
          tag: 'Intense',
          desc: 'Intense peak days. Maximum protection with full-coverage menstrual boxers and layered pads.',
        },
      },
    },
    packs: {
      headerTitle: 'Your Recommended Packs',
      headerSoldIn: 'Sold in Packs of 3, 5 & 7 Units',
      headerApprox: 'Approximate cycle recommendation',
      pack1Eyebrow: 'Pack 1 · Period Panties & Boxers',
      pack1Title: 'Period Underwear',
      pack1Subtitle: 'Sold together in underwear packs of 3, 5, and 7 units.',
      pack1TotalLabel: 'Total',
      pack1BestLabel: 'Best Underwear Pack',
      pack1BufferText: (needed, excess) =>
        excess > 0
          ? `Covers your ${needed} underwear items (+${excess} safety buffer).`
          : `Covers your ${needed} underwear items perfectly.`,
      pack1PantiesLabel: 'Period Panties',
      pack1BoxersLabel: 'Menstrual Boxers',
      unitsSuffix: 'units',
      pack2Eyebrow: 'Pack 2 · Menstrual Pads',
      pack2Title: 'Menstrual Pads',
      pack2Subtitle: 'Sold in pad packs of 3, 5, and 7 units.',
      pack2TotalLabel: 'Total',
      pack2BestLabel: 'Best Menstrual Pads Pack',
      pack2BufferText: (needed, excess) =>
        excess > 0
          ? `Covers your ${needed} menstrual pads (+${excess} extra insert).`
          : `Covers your ${needed} menstrual pads perfectly.`,
      pack2PadsLabel: 'Reusable Menstrual Pads',
      padsRecommendedSuffix: 'units recommended',
      investmentTitle: 'Total Cycle Investment:',
      investmentBody: (underwear, pads, total) =>
        `You will need ${underwear} Period Panties & Boxers + ${pads} Menstrual Pads (${total} total reusable items) to complete your entire cycle with zero mid-cycle shortages.`,
      zeroWastePill: 'Zero Single-Use Waste',
    },
    routine: {
      title: 'Cycle Schedule & Washing Routine',
      subtitle: (days) =>
        `See how your reusable pieces work together day and night across your ${days}-day cycle.`,
      allDays: (days) => `All Days (1–${days})`,
      dayLabel: (day) => `Day ${day}`,
      gentleRhythmTitle: 'A gentle washing rhythm:',
      gentleRhythmBody:
        "Your approximate pack assumes you'll wash your reusable products once on the second evening of your cycle, allowing 12 hours for air-drying before wearing them again.",
      phase1Title: 'Phase 1 · First Wear',
      phase1Range: 'Day 1 Morning → Day 2 Evening',
      phase1Desc:
        'You start with your fresh clean pack. Products are gently collected in your wash bag until Day 2 at 18:00.',
      phase2Title: 'Phase 2 · Wash & Air-Dry (12h)',
      phase2Range: 'Day 2 18:00 → Day 3 08:00',
      phase2Desc:
        'Washing is done at 18:00. You put on fresh clean period underwear for sleeping while the others air-dry overnight.',
      phase3Title: 'Phase 3 · Clean & Ready',
      phase3Range: 'Day 3 08:00 → End of Cycle',
      phase3Desc:
        'Your washed pieces are completely dry and clean, ready in your drawer for Day 3, 4, and 5!',
      tableColTime: 'Time Block',
      tableColFlow: 'Flow',
      tableColProtection: 'Comfort Protection Worn',
      tableColStatus: 'Washing Routine Status',
      tableColDrawer: 'Clean Drawer Items',
      blockMorning: 'Morning',
      blockAfternoon: 'Afternoon',
      blockNight: 'Night',
      flowLight: 'Light Flow',
      flowMedium: 'Medium Flow',
      flowHeavy: 'Heavy Flow',
      flowNone: 'None',
      itemPad: (n) => `${n}× Menstrual Pad`,
      itemPanty: (n) => `${n}× Period Panty`,
      itemBoxer: (n) => `${n}× Menstrual Boxer`,
      itemRest: 'Rest',
      statusCleanReady: 'Washed items ready in drawer (08:00)',
      statusAirDrying: 'Air-drying overnight (12 hours)',
      statusFirstWear: 'First cycle wear (wash on Day 2 18:00)',
      statusCleanActive: 'Washed clean pieces active',
    },
    footer: {
      brandTitle: 'Ecowoman days · Sustainable Menstrual Care',
      brandDesc:
        'Designed with empathy for natural bodies and mindful routines. Built on zero-waste principles.',
      testSuiteLabel: 'Developer Test Suite',
      allRights: 'All rights reserved.',
    },
    packCombinations: {
      packOf: (size) => `Pack of ${size}`,
      noPacks: 'No packs needed',
    },
  },

  // ==========================================================================
  // SPANISH (ES)
  // ==========================================================================
  es: {
    header: {
      title: 'Ecowoman days',
      tagline: 'Calculadora de Packs para el Cuidado Menstrual Reutilizable',
      navYourCycle: 'Tu Ciclo',
      navRecommendedPacks: 'Packs Recomendados',
      navWashingRoutine: 'Rutina de Lavado',
      summaryBadge: (u, p) => `${u} Ropa Interior · ${p} Compresas`,
      compactSummaryBadge: (u, p) => `${u} Bragas · ${p} Compresas`,
      languageAria: 'Seleccionar idioma',
    },
    hero: {
      badge: 'Ecowoman Days · Calculadora de Packs Personalizada',
      title: 'Ecowoman days',
      subtitle:
        'Crea tu pack ideal combinando diferentes modelos, tallas y colores. Añade 3, 5 o 7 unidades a tu carrito y encuentra la combinación exacta que necesitas para todo tu ciclo.',
      friendlyNoteTitle: 'Nota Amiga:',
      friendlyNoteBody:
        'Nuestro cálculo es una guía orientativa para ayudarte a estimar cuántas prendas reutilizables necesitas según tu flujo habitual y un lavado a mitad del ciclo. ¡Siéntete libre de adaptarlo a lo que mejor le siente a tu cuerpo!',
      imagePill: 'Bragas, Bóxers y Compresas',
    },
    cycleProfile: {
      step: 'Paso 1 · Cuéntanos sobre tu ciclo',
      title: 'Tu Perfil de Ciclo',
      description:
        'Selecciona la duración de tu menstruación y tu nivel de flujo habitual para calcular tus necesidades de productos reutilizables al instante.',
      durationLabel: '¿Cuántos días suele durar tu menstruación?',
      durationDaysBadge: (days) => `${days} Días`,
      daysUnit: 'Días',
      durationNotes: {
        3: 'Un ciclo corto de 3 días. Tus prendas se lavan una vez en la noche del Día 2 y están listas para el Día 3.',
        4: 'Un ciclo clásico de 4 días. Las prendas recién lavadas cubren cómodamente tus últimos días.',
        5: 'Un ciclo completo de 5 días. Las prendas lavadas cubren los Días 3 y 4, disminuyendo suavemente en el Día 5.',
      },
      flowLabel: '¿Cómo describirías tu flujo?',
      flows: {
        1: {
          name: 'Flujo Suave',
          tag: 'Ligero',
          desc: 'Días tranquilos y ligeros. Ideal para bragas menstruales transpirables y compresas finas.',
        },
        2: {
          name: 'Flujo Moderado',
          tag: 'Medio',
          desc: 'Flujo regular y constante. Combina bragas y bóxers con compresas de día.',
        },
        3: {
          name: 'Flujo Fuerte',
          tag: 'Intenso',
          desc: 'Días de mayor intensidad. Máxima absorción con bóxers envolventes y compresas superpuestas.',
        },
      },
    },
    packs: {
      headerTitle: 'Tus Packs Recomendados',
      headerSoldIn: 'Se venden en packs de 3, 5 y 7 unidades',
      headerApprox: 'Recomendación orientativa para tu ciclo',
      pack1Eyebrow: 'Pack 1 · Bragas y Bóxers Menstruales',
      pack1Title: 'Ropa Interior Menstrual',
      pack1Subtitle: 'Se venden juntos en packs de ropa interior de 3, 5 y 7 unidades.',
      pack1TotalLabel: 'Total',
      pack1BestLabel: 'Mejor Pack de Ropa Interior',
      pack1BufferText: (needed, excess) =>
        excess > 0
          ? `Cubre tus ${needed} prendas de ropa interior (+${excess} unidad de reserva).`
          : `Cubre perfectamente tus ${needed} prendas de ropa interior.`,
      pack1PantiesLabel: 'Bragas Menstruales',
      pack1BoxersLabel: 'Bóxers Menstruales',
      unitsSuffix: 'uds.',
      pack2Eyebrow: 'Pack 2 · Compresas Reutilizables',
      pack2Title: 'Compresas Reutilizables',
      pack2Subtitle: 'Se venden en packs de compresas de 3, 5 y 7 unidades.',
      pack2TotalLabel: 'Total',
      pack2BestLabel: 'Mejor Pack de Compresas',
      pack2BufferText: (needed, excess) =>
        excess > 0
          ? `Cubre tus ${needed} compresas (+${excess} unidad de reserva).`
          : `Cubre perfectamente tus ${needed} compresas.`,
      pack2PadsLabel: 'Compresas de Tela',
      padsRecommendedSuffix: 'unidades recomendadas',
      investmentTitle: 'Inversión Total para tu Ciclo:',
      investmentBody: (underwear, pads, total) =>
        `Necesitarás ${underwear} Bragas y Bóxers + ${pads} Compresas (${total} prendas reutilizables en total) para completar todo tu ciclo sin quedarte sin prendas limpias.`,
      zeroWastePill: 'Cero Residuos Desechables',
    },
    routine: {
      title: 'Calendario del Ciclo y Rutina de Lavado',
      subtitle: (days) =>
        `Descubre cómo se combinan tus prendas reutilizables de día y de noche durante tu ciclo de ${days} días.`,
      allDays: (days) => `Todos los Días (1–${days})`,
      dayLabel: (day) => `Día ${day}`,
      gentleRhythmTitle: 'Un ritmo de lavado sencillo:',
      gentleRhythmBody:
        'Tu pack orientativo asume que lavarás tus prendas reutilizables una vez en la tarde del segundo día de tu ciclo, dejando 12 horas de secado al aire antes de volver a usarlas.',
      phase1Title: 'Fase 1 · Primer Uso',
      phase1Range: 'Día 1 Mañana → Día 2 Tarde',
      phase1Desc:
        'Comienzas con tus prendas limpias. Los productos usados se guardan en tu bolsa de lavado hasta el Día 2 a las 18:00.',
      phase2Title: 'Fase 2 · Lavado y Secado (12h)',
      phase2Range: 'Día 2 18:00 → Día 3 08:00',
      phase2Desc:
        'El lavado se realiza a las 18:00. Te pones una braga o bóxer limpio para dormir mientras las demás se secan al aire durante la noche.',
      phase3Title: 'Fase 3 · Limpias y Listas',
      phase3Range: 'Día 3 08:00 → Fin del Ciclo',
      phase3Desc: 'Tus prendas lavadas están secas y listas en tu cajón para los días 3, 4 y 5.',
      tableColTime: 'Momento',
      tableColFlow: 'Flujo',
      tableColProtection: 'Protección Utilizada',
      tableColStatus: 'Estado de Lavado',
      tableColDrawer: 'Prendas Limpias en Cajón',
      blockMorning: 'Mañana',
      blockAfternoon: 'Tarde',
      blockNight: 'Noche',
      flowLight: 'Flujo Suave',
      flowMedium: 'Flujo Moderado',
      flowHeavy: 'Flujo Fuerte',
      flowNone: 'Sin flujo',
      itemPad: (n) => `${n}× Compresa`,
      itemPanty: (n) => `${n}× Braga`,
      itemBoxer: (n) => `${n}× Bóxer`,
      itemRest: 'Descanso',
      statusCleanReady: 'Prendas lavadas listas en el cajón (08:00)',
      statusAirDrying: 'Secado al aire durante la noche (12 horas)',
      statusFirstWear: 'Primer uso del ciclo (lavado el Día 2 a las 18:00)',
      statusCleanActive: 'Prendas limpias en uso',
    },
    footer: {
      brandTitle: 'Ecowoman days · Cuidado Menstrual Sostenible',
      brandDesc:
        'Diseñado con empatía para cuerpos reales y rutinas conscientes. Creado bajo principios de residuo cero.',
      testSuiteLabel: 'Suite de Pruebas Técnicas',
      allRights: 'Todos los derechos reservados.',
    },
    packCombinations: {
      packOf: (size) => `Pack de ${size}`,
      noPacks: 'No se necesitan packs',
    },
  },

  // ==========================================================================
  // PORTUGUESE (PT)
  // ==========================================================================
  pt: {
    header: {
      title: 'Ecowoman days',
      tagline: 'Calculadora de Packs para Cuidados Menstruais Reutilizáveis',
      navYourCycle: 'O Teu Ciclo',
      navRecommendedPacks: 'Packs Recomendados',
      navWashingRoutine: 'Rotina de Lavagem',
      summaryBadge: (u, p) => `${u} Roupa Interior · ${p} Pensos`,
      compactSummaryBadge: (u, p) => `${u} Cuecas · ${p} Pensos`,
      languageAria: 'Selecionar idioma',
    },
    hero: {
      badge: 'Ecowoman Days · Calculadora Personalizada de Packs',
      title: 'Ecowoman days',
      subtitle:
        'Cria o teu pack ideal combinando diferentes modelos, tamanhos e cores. Adiciona 3, 5 ou 7 unidades ao carrinho e encontra a combinação exata que precisas para todo o ciclo.',
      friendlyNoteTitle: 'Nota Carinhosa:',
      friendlyNoteBody:
        'O nosso cálculo é um guia aproximado para te ajudar a estimar quantas peças reutilizáveis precisas com base no teu fluxo habitual e numa lavagem a meio do ciclo. Sente-te livre para ajustar ao que melhor se adapta ao teu corpo!',
      imagePill: 'Cuecas, Boxers e Pensos',
    },
    cycleProfile: {
      step: 'Passo 1 · Fala-nos sobre o teu ciclo',
      title: 'O Teu Perfil de Ciclo',
      description:
        'Seleciona a duração da menstruação e o nível geral de fluxo para calcular as tuas necessidades de produtos reutilizáveis instantaneamente.',
      durationLabel: 'Quantos dias costuma durar a menstruação?',
      durationDaysBadge: (days) => `${days} Dias`,
      daysUnit: 'Dias',
      durationNotes: {
        3: 'Um ciclo curto de 3 dias. As tuas peças são lavadas na noite do Dia 2 e estão prontas para o Dia 3.',
        4: 'Um ciclo clássico de 4 dias. As peças lavadas cobrem confortavelmente os teus últimos dias.',
        5: 'Um ciclo completo de 5 dias. As peças lavadas cobrem os Dias 3 e 4, terminando suavemente no Dia 5.',
      },
      flowLabel: 'Como descreves o teu fluxo?',
      flows: {
        1: {
          name: 'Fluxo Ligeiro',
          tag: 'Suave',
          desc: 'Dias tranquilos e ligeiros. Perfeito para cuecas menstruais respiráveis e pensos finos.',
        },
        2: {
          name: 'Fluxo Moderado',
          tag: 'Médio',
          desc: 'Fluxo regular e equilibrado. Combina cuecas e boxers com pensos para o dia.',
        },
        3: {
          name: 'Fluxo Intenso',
          tag: 'Forte',
          desc: 'Dias de maior intensidade. Máxima proteção com boxers envolventes e pensos reforçados.',
        },
      },
    },
    packs: {
      headerTitle: 'Os Teus Packs Recomendados',
      headerSoldIn: 'Vendidos em packs de 3, 5 e 7 unidades',
      headerApprox: 'Recomendação orientativa para o teu ciclo',
      pack1Eyebrow: 'Pack 1 · Cuecas e Boxers Menstruais',
      pack1Title: 'Roupa Interior Menstrual',
      pack1Subtitle: 'Vendidos juntos em packs de roupa interior de 3, 5 e 7 unidades.',
      pack1TotalLabel: 'Total',
      pack1BestLabel: 'Melhor Pack de Roupa Interior',
      pack1BufferText: (needed, excess) =>
        excess > 0
          ? `Cobre as tuas ${needed} peças de roupa interior (+${excess} de reserva).`
          : `Cobre perfeitamente as tuas ${needed} peças de roupa interior.`,
      pack1PantiesLabel: 'Cuecas Menstruais',
      pack1BoxersLabel: 'Boxers Menstruais',
      unitsSuffix: 'un.',
      pack2Eyebrow: 'Pack 2 · Pensos Menstruais Reutilizáveis',
      pack2Title: 'Pensos Reutilizáveis',
      pack2Subtitle: 'Vendidos em packs de pensos de 3, 5 e 7 unidades.',
      pack2TotalLabel: 'Total',
      pack2BestLabel: 'Melhor Pack de Pensos',
      pack2BufferText: (needed, excess) =>
        excess > 0
          ? `Cobre os teus ${needed} pensos (+${excess} penso extra).`
          : `Cobre perfeitamente os teus ${needed} pensos.`,
      pack2PadsLabel: 'Pensos de Pano Reutilizáveis',
      padsRecommendedSuffix: 'unidades recomendadas',
      investmentTitle: 'Investimento Total para o Ciclo:',
      investmentBody: (underwear, pads, total) =>
        `Vais precisar de ${underwear} Cuecas e Boxers + ${pads} Pensos (${total} peças reutilizáveis no total) para completar o ciclo sem falta de peças limpas.`,
      zeroWastePill: 'Zero Desperdício Descartável',
    },
    routine: {
      title: 'Calendário do Ciclo e Rotina de Lavagem',
      subtitle: (days) =>
        `Vê como as tuas peças reutilizáveis funcionam juntas dia e noite ao longo do teu ciclo de ${days} dias.`,
      allDays: (days) => `Todos os Dias (1–${days})`,
      dayLabel: (day) => `Dia ${day}`,
      gentleRhythmTitle: 'Um ritmo de lavagem suave:',
      gentleRhythmBody:
        'O teu pack aproximado assume que vais lavar as peças reutilizáveis uma vez ao final do segundo dia do ciclo, aguardando 12 horas de secagem ao ar livre antes de voltar a usá-las.',
      phase1Title: 'Fase 1 · Primeiro Uso',
      phase1Range: 'Dia 1 Manhã → Dia 2 Tarde',
      phase1Desc:
        'Começas com as tuas peças lavadas. Os produtos usados são guardados no saco de lavagem até ao Dia 2 às 18:00.',
      phase2Title: 'Fase 2 · Lavagem e Secagem (12h)',
      phase2Range: 'Dia 2 18:00 → Dia 3 08:00',
      phase2Desc:
        'A lavagem é feita às 18:00. Vestes roupa interior lavada para dormir enquanto as outras secam ao ar durante a noite.',
      phase3Title: 'Fase 3 · Limpas e Prontas',
      phase3Range: 'Dia 3 08:00 → Fim do Ciclo',
      phase3Desc: 'As peças lavadas estão secas e prontas na gaveta para os dias 3, 4 e 5.',
      tableColTime: 'Período',
      tableColFlow: 'Fluxo',
      tableColProtection: 'Proteção Utilizada',
      tableColStatus: 'Estado da Lavagem',
      tableColDrawer: 'Peças Limpas na Gaveta',
      blockMorning: 'Manhã',
      blockAfternoon: 'Tarde',
      blockNight: 'Noite',
      flowLight: 'Fluxo Ligeiro',
      flowMedium: 'Fluxo Moderado',
      flowHeavy: 'Fluxo Intenso',
      flowNone: 'Sem fluxo',
      itemPad: (n) => `${n}× Penso`,
      itemPanty: (n) => `${n}× Cueca`,
      itemBoxer: (n) => `${n}× Boxer`,
      itemRest: 'Descanso',
      statusCleanReady: 'Peças lavadas prontas na gaveta (08:00)',
      statusAirDrying: 'A secar ao ar durante a noite (12 horas)',
      statusFirstWear: 'Primeiro uso do ciclo (lavar no Dia 2 às 18:00)',
      statusCleanActive: 'Peças limpas em uso',
    },
    footer: {
      brandTitle: 'Ecowoman days · Cuidados Menstruais Sustentáveis',
      brandDesc:
        'Criado com empatia para corpos reais e rotinas conscientes. Baseado em princípios de desperdício zero.',
      testSuiteLabel: 'Painel de Testes Técnicos',
      allRights: 'Todos os direitos reservados.',
    },
    packCombinations: {
      packOf: (size) => `Pack de ${size}`,
      noPacks: 'Nenhum pack necessário',
    },
  },

  // ==========================================================================
  // GERMAN (DE)
  // ==========================================================================
  de: {
    header: {
      title: 'Ecowoman days',
      tagline: 'Rechner für wiederverwendbare Perioden-Sets',
      navYourCycle: 'Dein Zyklus',
      navRecommendedPacks: 'Empfohlene Pakete',
      navWashingRoutine: 'Waschroutine',
      summaryBadge: (u, p) => `${u} Periodenunterwäsche · ${p} Binden`,
      compactSummaryBadge: (u, p) => `${u} Slips · ${p} Binden`,
      languageAria: 'Sprache wählen',
    },
    hero: {
      badge: 'Ecowoman Days · Persönlicher Perioden-Set-Rechner',
      title: 'Ecowoman days',
      subtitle:
        'Stelle dein ideales Set zusammen, indem du verschiedene Modelle, Größen und Farben kombinierst. Wähle 3, 5 oder 7 Stück und finde die optimale Kombination für deine gesamte Periode.',
      friendlyNoteTitle: 'Liebevoller Hinweis:',
      friendlyNoteBody:
        'Unsere Berechnung ist eine Orientierungshilfe, um abzuschätzen, wie viele wiederverwendbare Produkte du basierend auf deiner Blutungsstärke und einem Waschgang zur Zyklusmitte benötigst. Passe die Auswahl gerne an dein persönliches Wohlbefinden an!',
      imagePill: 'Periodenslips, Boxer & Binden',
    },
    cycleProfile: {
      step: 'Schritt 1 · Erzähle uns von deinem Zyklus',
      title: 'Dein Zyklusprofil',
      description:
        'Wähle deine Periodendauer und deine typische Blutungsstärke, um deinen Bedarf an wiederverwendbaren Produkten direkt zu berechnen.',
      durationLabel: 'Wie viele Tage dauert deine Periode üblicherweise?',
      durationDaysBadge: (days) => `${days} Tage`,
      daysUnit: 'Tage',
      durationNotes: {
        3: 'Ein kürzerer 3-Tage-Zyklus. Deine Produkte werden an Tag 2 abends gewaschen und sind für Tag 3 bereit.',
        4: 'Ein klassischer 4-Tage-Zyklus. Frisch gewaschene Artikel decken die restlichen Tage entspannt ab.',
        5: 'Ein 5-Tage-Zyklus. Gewaschene Produkte decken Tag 3 und 4 ab und klingen an Tag 5 sanft ab.',
      },
      flowLabel: 'Wie stark ist deine Blutung typischerweise?',
      flows: {
        1: {
          name: 'Leichte Blutung',
          tag: 'Sanft',
          desc: 'Leichtere Tage. Perfekt für atmungsaktive Periodenslips und leichte Binden.',
        },
        2: {
          name: 'Mittlere Blutung',
          tag: 'Mäßig',
          desc: 'Ausgewogener Fluss. Nutzt bequeme Slips und Boxer mit zusätzlichen Binden für den Tag.',
        },
        3: {
          name: 'Starke Blutung',
          tag: 'Intensiv',
          desc: 'Stärkere Tage. Maximaler Schutz mit rundum schützenden Boxern und saugstarken Binden.',
        },
      },
    },
    packs: {
      headerTitle: 'Deine empfohlenen Pakete',
      headerSoldIn: 'Erhältlich in 3er-, 5er- & 7er-Sets',
      headerApprox: 'Unverbindliche Orientierung für deinen Zyklus',
      pack1Eyebrow: 'Set 1 · Periodenslips & Boxer',
      pack1Title: 'Periodenunterwäsche',
      pack1Subtitle: 'Zusammen erhältlich in Unterwäsche-Sets zu 3, 5 und 7 Stück.',
      pack1TotalLabel: 'Gesamt',
      pack1BestLabel: 'Bestes Unterwäsche-Set',
      pack1BufferText: (needed, excess) =>
        excess > 0
          ? `Deckt deine ${needed} Unterwäsche-Artikel (+${excess} Sicherheitsreserve) ab.`
          : `Deckt deine ${needed} Unterwäsche-Artikel passgenau ab.`,
      pack1PantiesLabel: 'Periodenslips',
      pack1BoxersLabel: 'Menstruations-Boxer',
      unitsSuffix: 'Stk.',
      pack2Eyebrow: 'Set 2 · Menstruationsbinden',
      pack2Title: 'Wiederverwendbare Binden',
      pack2Subtitle: 'Erhältlich in Binden-Sets zu 3, 5 und 7 Stück.',
      pack2TotalLabel: 'Gesamt',
      pack2BestLabel: 'Bestes Binden-Set',
      pack2BufferText: (needed, excess) =>
        excess > 0
          ? `Deckt deine ${needed} Binden (+${excess} zusätzliche Einlage) ab.`
          : `Deckt deine ${needed} Binden passgenau ab.`,
      pack2PadsLabel: 'Stoffbinden',
      padsRecommendedSuffix: 'Stück empfohlen',
      investmentTitle: 'Gesamtbedarf für deinen Zyklus:',
      investmentBody: (underwear, pads, total) =>
        `Du benötigst ${underwear} Periodenslips & Boxer + ${pads} Binden (${total} Produkte insgesamt), um deinen gesamten Zyklus sorgenfrei zu durchlaufen.`,
      zeroWastePill: 'Ohne Einwegmüll',
    },
    routine: {
      title: 'Zyklus-Ablauf & Waschroutine',
      subtitle: (days) =>
        `Sieh dir an, wie deine wiederverwendbaren Produkte Tag und Nacht während deines ${days}-Tage-Zyklus zusammenwirken.`,
      allDays: (days) => `Alle Tage (1–${days})`,
      dayLabel: (day) => `Tag ${day}`,
      gentleRhythmTitle: 'Ein entspannter Wasch-Rhythmus:',
      gentleRhythmBody:
        'Deine Zusammenstellung geht davon aus, dass du deine wiederverwendbaren Produkte einmal am zweiten Abend des Zyklus wäschst und ihnen 12 Stunden zum Trocknen an der Luft gibst, bevor du sie wieder trägst.',
      phase1Title: 'Phase 1 · Erste Nutzung',
      phase1Range: 'Tag 1 Vormittag → Tag 2 Abend',
      phase1Desc:
        'Du startest mit frisch gewaschenen Produkten. Getragene Artikel wandern in den Wäschebeutel bis Tag 2 um 18:00 Uhr.',
      phase2Title: 'Phase 2 · Waschen & Lufttrocknen (12h)',
      phase2Range: 'Tag 2 18:00 → Tag 3 08:00',
      phase2Desc:
        'Um 18:00 Uhr wird gewaschen. Für die Nacht ziehst du frische Periodenunterwäsche an, während der Rest über Nacht trocknet.',
      phase3Title: 'Phase 3 · Sauber & Bereit',
      phase3Range: 'Tag 3 08:00 → Zyklusende',
      phase3Desc:
        'Deine gewaschenen Sachen sind trocken und sauber im Schrank für die Tage 3, 4 und 5 bereit.',
      tableColTime: 'Zeitfenster',
      tableColFlow: 'Blutung',
      tableColProtection: 'Getragener Schutz',
      tableColStatus: 'Waschstatus',
      tableColDrawer: 'Frische Produkte im Schrank',
      blockMorning: 'Vormittag',
      blockAfternoon: 'Nachmittag',
      blockNight: 'Nacht',
      flowLight: 'Leichte Blutung',
      flowMedium: 'Mittlere Blutung',
      flowHeavy: 'Starke Blutung',
      flowNone: 'Keine Blutung',
      itemPad: (n) => `${n}× Binde`,
      itemPanty: (n) => `${n}× Slip`,
      itemBoxer: (n) => `${n}× Boxer`,
      itemRest: 'Pause',
      statusCleanReady: 'Frisch gewaschene Artikel bereit im Schrank (08:00)',
      statusAirDrying: 'Trocknet über Nacht an der Luft (12 Std.)',
      statusFirstWear: 'Erste Nutzung (Wäsche an Tag 2 um 18:00 Uhr)',
      statusCleanActive: 'Gewaschene saubere Produkte im Einsatz',
    },
    footer: {
      brandTitle: 'Ecowoman days · Nachhaltige Menstruationspflege',
      brandDesc:
        'Mit Empathie entwickelt für echte Körper und bewusste Routinen. Basierend auf Zero-Waste-Prinzipien.',
      testSuiteLabel: 'Entwickler-Testsuite',
      allRights: 'Alle Rechte vorbehalten.',
    },
    packCombinations: {
      packOf: (size) => `${size}er-Pack`,
      noPacks: 'Keine Pakete erforderlich',
    },
  },
};

/**
 * Format pack combination description dynamically according to language
 */
export function formatPackCombination(
  combo: { pack7: number; pack5: number; pack3: number },
  lang: Language
): string {
  const t = translations[lang].packCombinations;
  const parts: string[] = [];
  if (combo.pack7 > 0) parts.push(`${combo.pack7} × ${t.packOf(7)}`);
  if (combo.pack5 > 0) parts.push(`${combo.pack5} × ${t.packOf(5)}`);
  if (combo.pack3 > 0) parts.push(`${combo.pack3} × ${t.packOf(3)}`);
  return parts.join(' + ') || t.noPacks;
}
