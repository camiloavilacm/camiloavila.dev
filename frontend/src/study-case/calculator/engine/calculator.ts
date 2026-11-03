/**
 * Ecowoman Deterministic Calculation Engine & Pack Recommender
 * Separate pack configurations for:
 * 1. Bragas & Boxers (Underwear packs of 3, 5, 7)
 * 2. Compresas (Reusable pad packs of 3, 5, 7)
 */

import type {
  FlowLevel,
  PeriodDays,
  ProductRequirements,
  TimeBlock,
  TimelineBlockState,
  PackCombination,
  PackRecommendation,
  CategoryPackRecommendation,
  PackSize,
} from './types';

// ============================================================================
// CONFIGURABLE CONSTANTS & RULES
// ============================================================================

export const AVAILABLE_PACK_SIZES: PackSize[] = [3, 5, 7];

export const TIME_BLOCKS: { id: TimeBlock; label: string; timeRange: string }[] = [
  { id: 'morning', label: 'Morning', timeRange: '08:00–14:00' },
  { id: 'afternoon', label: 'Afternoon', timeRange: '14:00–18:00' },
  { id: 'night', label: 'Night', timeRange: '18:00–08:00' },
];

/**
 * Friendly washing assumption text:
 */
export const WASHING_ASSUMPTION_TEXT =
  "Your approximate pack assumes you'll wash your reusable products once on the second evening of your cycle, allowing 12 hours for air-drying before wearing them again.";

/**
 * Business Rule matrix ("Regla de negocio" from spreadsheet):
 * Maps (TimeBlock, FlowLevel) -> Product requirements for that single block.
 * Flow 1 = Light / Suave
 * Flow 2 = Medium / Moderado
 * Flow 3 = Heavy / Fuerte
 * Flow 0 = None / No
 */
export const USAGE_RULES: Record<TimeBlock, Record<number, ProductRequirements>> = {
  morning: {
    0: { pad: 0, panty: 0, boxer: 0 },
    1: { pad: 1, panty: 1, boxer: 0 }, // 1 panty + 1 pad
    2: { pad: 1, panty: 0, boxer: 1 }, // 1 pad + 1 boxer
    3: { pad: 1, panty: 0, boxer: 1 }, // 1 pad + 1 boxer
  },
  afternoon: {
    0: { pad: 0, panty: 0, boxer: 0 },
    1: { pad: 0, panty: 1, boxer: 0 }, // 1 panty
    2: { pad: 1, panty: 1, boxer: 0 }, // 1 panty + 1 pad
    3: { pad: 1, panty: 0, boxer: 1 }, // 1 pad + 1 boxer
  },
  night: {
    0: { pad: 0, panty: 0, boxer: 0 },
    1: { pad: 0, panty: 1, boxer: 0 }, // 1 panty
    2: { pad: 0, panty: 0, boxer: 1 }, // 1 boxer
    3: { pad: 0, panty: 0, boxer: 1 }, // 1 boxer
  },
};

/**
 * Spreadsheet scenario schedules from "Cantidad de Compresas por flujo y dias.xlsx":
 * Exact day-by-day flow for all 9 scenarios (Mujer 1 to 9).
 */
export interface DaySchedule {
  morning: number;
  afternoon: number;
  night: number;
}

export const SPREADSHEET_SCENARIOS: Record<string, DaySchedule[]> = {
  // Mujer 1: 3 days, Flow 1
  '3_1': [
    { morning: 1, afternoon: 1, night: 1 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 1, afternoon: 1, night: 1 },
  ],
  // Mujer 2: 3 days, Flow 2
  '3_2': [
    { morning: 2, afternoon: 2, night: 2 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 1, afternoon: 1, night: 1 },
  ],
  // Mujer 3: 3 days, Flow 3
  '3_3': [
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
  ],
  // Mujer 4: 4 days, Flow 1
  '4_1': [
    { morning: 1, afternoon: 1, night: 1 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 2, afternoon: 2, night: 2 },
    { morning: 1, afternoon: 1, night: 1 },
  ],
  // Mujer 5: 4 days, Flow 2
  '4_2': [
    { morning: 1, afternoon: 1, night: 1 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 2, afternoon: 2, night: 2 },
  ],
  // Mujer 6: 4 days, Flow 3
  '4_3': [
    { morning: 2, afternoon: 2, night: 2 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
  ],
  // Mujer 7: 5 days, Flow 1
  '5_1': [
    { morning: 1, afternoon: 2, night: 2 },
    { morning: 1, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 2, afternoon: 3, night: 3 },
    { morning: 1, afternoon: 0, night: 0 },
  ],
  // Mujer 8: 5 days, Flow 2
  '5_2': [
    { morning: 1, afternoon: 2, night: 2 },
    { morning: 2, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 1, afternoon: 0, night: 0 },
  ],
  // Mujer 9: 5 days, Flow 3
  '5_3': [
    { morning: 2, afternoon: 2, night: 2 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 3, afternoon: 3, night: 3 },
    { morning: 2, afternoon: 2, night: 2 },
    { morning: 2, afternoon: 2, night: 2 },
  ],
};

// ============================================================================
// SCHEDULE RESOLVER (Strictly follows Excel spreadsheet matrix)
// ============================================================================

export function getFlowForBlock(
  day: number,
  block: TimeBlock,
  totalDays: PeriodDays,
  flowLevel: FlowLevel
): number {
  if (day < 1 || day > totalDays) return 0;

  const key = `${totalDays}_${flowLevel}`;
  const scenario = SPREADSHEET_SCENARIOS[key];
  if (!scenario || day > scenario.length) {
    return flowLevel;
  }

  const daySchedule = scenario[day - 1];
  return daySchedule[block] ?? flowLevel;
}

export function getRequirementsForBlock(
  day: number,
  block: TimeBlock,
  totalDays: PeriodDays,
  flowLevel: FlowLevel
): ProductRequirements {
  const flow = getFlowForBlock(day, block, totalDays, flowLevel);
  const rule = USAGE_RULES[block][flow] || { pad: 0, panty: 0, boxer: 0 };
  return { ...rule };
}

// ============================================================================
// MINIMUM INVENTORY REQUIREMENT CALCULATION
// ============================================================================

export function getRequirements(days: number, flow: number): ProductRequirements {
  const validDays = Math.min(Math.max(Math.round(days), 3), 5) as PeriodDays;
  const validFlow = Math.min(Math.max(Math.round(flow), 1), 3) as FlowLevel;

  const uPre: ProductRequirements = { pad: 0, panty: 0, boxer: 0 };
  const uNight2: ProductRequirements = { pad: 0, panty: 0, boxer: 0 };
  const uPost: ProductRequirements = { pad: 0, panty: 0, boxer: 0 };

  for (let d = 1; d <= validDays; d++) {
    for (const b of TIME_BLOCKS) {
      const req = getRequirementsForBlock(d, b.id, validDays, validFlow);

      if (d === 1 || (d === 2 && (b.id === 'morning' || b.id === 'afternoon'))) {
        uPre.pad += req.pad;
        uPre.panty += req.panty;
        uPre.boxer += req.boxer;
      } else if (d === 2 && b.id === 'night') {
        uNight2.pad += req.pad;
        uNight2.panty += req.panty;
        uNight2.boxer += req.boxer;
      } else {
        uPost.pad += req.pad;
        uPost.panty += req.panty;
        uPost.boxer += req.boxer;
      }
    }
  }

  return {
    pad: Math.max(uPre.pad, uPost.pad) + uNight2.pad,
    panty: Math.max(uPre.panty, uPost.panty) + uNight2.panty,
    boxer: Math.max(uPre.boxer, uPost.boxer) + uNight2.boxer,
  };
}

// ============================================================================
// TIMELINE DISCRETE SIMULATION
// ============================================================================

export function simulateCycleTimeline(
  days: PeriodDays,
  flowLevel: FlowLevel,
  inventory?: ProductRequirements
): TimelineBlockState[] {
  const reqs = inventory || getRequirements(days, flowLevel);
  const timeline: TimelineBlockState[] = [];

  const clean = { ...reqs };
  const inLaundry = { pad: 0, panty: 0, boxer: 0 };
  const permanentlyDirty = { pad: 0, panty: 0, boxer: 0 };

  const flowLabels = ['Rest', 'Light Flow', 'Medium Flow', 'Heavy Flow'];

  for (let d = 1; d <= days; d++) {
    for (const b of TIME_BLOCKS) {
      const flow = getFlowForBlock(d, b.id, days, flowLevel);
      const needs = getRequirementsForBlock(d, b.id, days, flowLevel);

      let eventNote: string | undefined;

      // Day 3 morning: laundry finished drying at 08:00
      if (d === 3 && b.id === 'morning') {
        clean.pad += inLaundry.pad;
        clean.panty += inLaundry.panty;
        clean.boxer += inLaundry.boxer;
        inLaundry.pad = 0;
        inLaundry.panty = 0;
        inLaundry.boxer = 0;
        eventNote = 'Fresh washed products ready to wear at 08:00';
      }

      let phase: 'pre_wash' | 'washing_drying' | 'post_wash' = 'pre_wash';
      if (d === 2 && b.id === 'night') {
        phase = 'washing_drying';
      } else if (d >= 3) {
        phase = 'post_wash';
      }

      clean.pad -= needs.pad;
      clean.panty -= needs.panty;
      clean.boxer -= needs.boxer;

      if (d === 2 && b.id === 'afternoon') {
        eventNote = 'Washing started at 18:00 (12h dry cycle)';
      }

      if (d === 1 || (d === 2 && b.id === 'morning')) {
        inLaundry.pad += needs.pad;
        inLaundry.panty += needs.panty;
        inLaundry.boxer += needs.boxer;
      } else if (d === 2 && b.id === 'afternoon') {
        inLaundry.pad += needs.pad;
        inLaundry.panty += needs.panty;
        inLaundry.boxer += needs.boxer;
      } else if (d === 2 && b.id === 'night') {
        permanentlyDirty.pad += needs.pad;
        permanentlyDirty.panty += needs.panty;
        permanentlyDirty.boxer += needs.boxer;
      } else {
        permanentlyDirty.pad += needs.pad;
        permanentlyDirty.panty += needs.panty;
        permanentlyDirty.boxer += needs.boxer;
      }

      timeline.push({
        day: d,
        block: b.id,
        blockLabel: b.label,
        timeRange: b.timeRange,
        flow,
        flowLabel: flowLabels[flow] || 'Normal',
        needs: { ...needs },
        phase,
        cleanRemaining: { ...clean },
        inUse: { ...needs },
        inLaundry: { ...inLaundry },
        permanentlyDirty: { ...permanentlyDirty },
        eventNote,
      });
    }
  }

  return timeline;
}

// ============================================================================
// PACK COMBINATIONS OPTIMIZER (Packs of 7, 5, and 3)
// ============================================================================

/**
 * Finds the optimal combination of 7, 5, and 3-packs to cover target units needed.
 * - Prioritizes exact unit matches (zero excess)
 * - Minimizes surplus units
 * - Minimizes total number of packs needed (e.g. 7 + 3 over 5 + 5 or 3 + 3 + 3 + 1)
 * - Prioritizes larger pack sizes (7 > 5 > 3)
 */
export function getOptimalPackCombination(totalUnits: number): PackCombination {
  if (totalUnits <= 0) {
    return {
      pack7: 0,
      pack5: 0,
      pack3: 0,
      totalCapacity: 0,
      excessUnits: 0,
      totalPacks: 0,
      description: '0 packs needed',
    };
  }

  let bestCombination: {
    pack7: number;
    pack5: number;
    pack3: number;
    totalCapacity: number;
    excessUnits: number;
    totalPacks: number;
  } | null = null;

  let bestScore = Infinity;

  // Upper bound on packs
  const max7 = Math.ceil(totalUnits / 7) + 1;
  const max5 = Math.ceil(totalUnits / 5) + 1;
  const max3 = Math.ceil(totalUnits / 3) + 1;

  for (let p7 = 0; p7 <= max7; p7++) {
    for (let p5 = 0; p5 <= max5; p5++) {
      for (let p3 = 0; p3 <= max3; p3++) {
        const capacity = 7 * p7 + 5 * p5 + 3 * p3;
        if (capacity < totalUnits) continue;

        const excess = capacity - totalUnits;
        const totalPacks = p7 + p5 + p3;
        if (totalPacks === 0) continue;

        // Score formula:
        // Priority 1: minimize excess units (excess * 1000)
        // Priority 2: minimize number of packs (totalPacks * 50)
        // Priority 3: prioritize largest pack size (prefer 7 over 5 and 3)
        const score = excess * 1000 + totalPacks * 50 - (p7 * 10 + p5 * 2);

        if (score < bestScore) {
          bestScore = score;
          bestCombination = {
            pack7: p7,
            pack5: p5,
            pack3: p3,
            totalCapacity: capacity,
            excessUnits: excess,
            totalPacks,
          };
        }
      }
    }
  }

  const res = bestCombination || {
    pack7: 0,
    pack5: 0,
    pack3: Math.ceil(totalUnits / 3),
    totalCapacity: Math.ceil(totalUnits / 3) * 3,
    excessUnits: Math.ceil(totalUnits / 3) * 3 - totalUnits,
    totalPacks: Math.ceil(totalUnits / 3),
  };

  const parts: string[] = [];
  if (res.pack7 > 0) parts.push(`${res.pack7} × Pack of 7`);
  if (res.pack5 > 0) parts.push(`${res.pack5} × Pack of 5`);
  if (res.pack3 > 0) parts.push(`${res.pack3} × Pack of 3`);

  const description = parts.join(' + ') || 'No packs';

  return {
    ...res,
    description,
  };
}

/**
 * Main pack recommender for Ecowoman:
 * Categorizes and calculates separate 3, 5, 7 pack bundles for:
 * 1. Underwear (Bragas & Boxers combined)
 * 2. Compresas (Reusable pads)
 */
export function getBestPack(requirements: ProductRequirements): PackRecommendation {
  const totalUnderwearNeeded = requirements.panty + requirements.boxer;
  const totalPadsNeeded = requirements.pad;
  const totalUnitsNeeded = totalUnderwearNeeded + totalPadsNeeded;

  const underwearCombination = getOptimalPackCombination(totalUnderwearNeeded);
  const padsCombination = getOptimalPackCombination(totalPadsNeeded);

  const underwearPack: CategoryPackRecommendation = {
    category: 'underwear',
    title: 'Bragas & Boxers Menstruales',
    subtitle: 'Underwear Pack (3, 5 & 7 units)',
    totalUnitsNeeded: totalUnderwearNeeded,
    items: {
      panty: requirements.panty,
      boxer: requirements.boxer,
    },
    packCombination: underwearCombination,
  };

  const padsPack: CategoryPackRecommendation = {
    category: 'pads',
    title: 'Compresas Reutilizables',
    subtitle: 'Reusable Pads Pack (3, 5 & 7 units)',
    totalUnitsNeeded: totalPadsNeeded,
    items: {
      pad: requirements.pad,
    },
    packCombination: padsCombination,
  };

  return {
    requirements,
    totalUnderwearNeeded,
    totalPadsNeeded,
    totalUnitsNeeded,
    underwearPack,
    padsPack,
  };
}
