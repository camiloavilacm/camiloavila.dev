/**
 * Types for the Ecowoman Menstrual Product Pack Calculator
 * Bragas & Boxers are sold together in underwear packs of 3, 5, 7.
 * Compresas (pads) are sold separately in pad packs of 3, 5, 7.
 */

export type ProductType = 'pad' | 'panty' | 'boxer';

export type TimeBlock = 'morning' | 'afternoon' | 'night';

export type FlowLevel = 1 | 2 | 3;

export type PeriodDays = 3 | 4 | 5;

export interface ProductRequirements {
  pad: number; // Compresas
  panty: number; // Bragas
  boxer: number; // Boxers
}

export type PackSize = 3 | 5 | 7;

export interface PackCombination {
  pack7: number;
  pack5: number;
  pack3: number;
  totalCapacity: number;
  excessUnits: number;
  totalPacks: number;
  description: string;
}

export interface CategoryPackRecommendation {
  category: 'underwear' | 'pads';
  title: string;
  subtitle: string;
  totalUnitsNeeded: number;
  items: {
    pad?: number;
    panty?: number;
    boxer?: number;
  };
  packCombination: PackCombination;
}

export interface PackRecommendation {
  requirements: ProductRequirements;
  totalUnderwearNeeded: number; // bragas + boxers
  totalPadsNeeded: number; // compresas
  totalUnitsNeeded: number; // underwear + pads
  underwearPack: CategoryPackRecommendation;
  padsPack: CategoryPackRecommendation;
}

export type TimelinePhase = 'pre_wash' | 'washing_drying' | 'post_wash';

export interface TimelineBlockState {
  day: number;
  block: TimeBlock;
  blockLabel: string;
  timeRange: string;
  flow: number; // 0 = none, 1 = suave/light, 2 = moderado/medium, 3 = fuerte/heavy
  flowLabel: string;
  needs: ProductRequirements;
  phase: TimelinePhase;
  cleanRemaining: ProductRequirements;
  inUse: ProductRequirements;
  inLaundry: ProductRequirements;
  permanentlyDirty: ProductRequirements;
  eventNote?: string;
}
