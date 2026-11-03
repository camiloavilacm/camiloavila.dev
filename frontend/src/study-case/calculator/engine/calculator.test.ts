/**
 * Automated Unit Tests for Ecowoman Menstrual Product Pack Calculator
 */

import { describe, it, expect } from 'vitest';
import {
  getRequirements,
  getBestPack,
  getOptimalPackCombination,
  simulateCycleTimeline,
  SPREADSHEET_SCENARIOS,
  USAGE_RULES,
} from './calculator';
import { PeriodDays, FlowLevel, ProductRequirements } from './types';

describe('1. Baseline Rules & Spreadsheet Verification', () => {
  it('should match the spreadsheet business rules for morning, afternoon, and night', () => {
    // Flow 1
    expect(USAGE_RULES.morning[1]).toEqual({ pad: 1, panty: 1, boxer: 0 });
    expect(USAGE_RULES.afternoon[1]).toEqual({ pad: 0, panty: 1, boxer: 0 });
    expect(USAGE_RULES.night[1]).toEqual({ pad: 0, panty: 1, boxer: 0 });

    // Flow 2
    expect(USAGE_RULES.morning[2]).toEqual({ pad: 1, panty: 0, boxer: 1 });
    expect(USAGE_RULES.afternoon[2]).toEqual({ pad: 1, panty: 1, boxer: 0 });
    expect(USAGE_RULES.night[2]).toEqual({ pad: 0, panty: 0, boxer: 1 });

    // Flow 3
    expect(USAGE_RULES.morning[3]).toEqual({ pad: 1, panty: 0, boxer: 1 });
    expect(USAGE_RULES.afternoon[3]).toEqual({ pad: 1, panty: 0, boxer: 1 });
    expect(USAGE_RULES.night[3]).toEqual({ pad: 0, panty: 0, boxer: 1 });
  });

  it('should contain all 9 spreadsheet profiles (Mujer 1 to 9)', () => {
    const keys = ['3_1', '3_2', '3_3', '4_1', '4_2', '4_3', '5_1', '5_2', '5_3'];
    for (const key of keys) {
      expect(SPREADSHEET_SCENARIOS[key]).toBeDefined();
    }
  });
});

describe('2. All 9 Scenarios & Deterministic Inventory Requirements', () => {
  const daysList: PeriodDays[] = [3, 4, 5];
  const flowList: FlowLevel[] = [1, 2, 3];

  for (const days of daysList) {
    for (const flow of flowList) {
      it(`computes deterministic non-negative integer requirements for Days=${days}, Flow=${flow}`, () => {
        const req = getRequirements(days, flow);
        expect(req.pad).toBeGreaterThanOrEqual(0);
        expect(req.panty).toBeGreaterThanOrEqual(0);
        expect(req.boxer).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(req.pad)).toBe(true);
        expect(Number.isInteger(req.panty)).toBe(true);
        expect(Number.isInteger(req.boxer)).toBe(true);

        // Re-running must produce the exact same result (pure deterministic)
        const req2 = getRequirements(days, flow);
        expect(req2).toEqual(req);
      });
    }
  }

  it('computes expected requirements for Mujer 1 (3 days, Flow 1)', () => {
    const req = getRequirements(3, 1);
    expect(req).toEqual({ pad: 3, panty: 3, boxer: 3 });
  });
});

describe('3. Laundry & Drying Assumptions Invariant', () => {
  it('guarantees clean inventory is never negative across any time block (simulation test)', () => {
    const daysList: PeriodDays[] = [3, 4, 5];
    const flowList: FlowLevel[] = [1, 2, 3];

    for (const days of daysList) {
      for (const flow of flowList) {
        const req = getRequirements(days, flow);
        const timeline = simulateCycleTimeline(days, flow, req);

        for (const block of timeline) {
          expect(
            block.cleanRemaining.pad,
            `Pad deficit at Day ${block.day} ${block.block}`
          ).toBeGreaterThanOrEqual(0);
          expect(
            block.cleanRemaining.panty,
            `Panty deficit at Day ${block.day} ${block.block}`
          ).toBeGreaterThanOrEqual(0);
          expect(
            block.cleanRemaining.boxer,
            `Boxer deficit at Day ${block.day} ${block.block}`
          ).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('demonstrates that reducing any requirement by 1 unit causes an inventory shortage', () => {
    const days: PeriodDays = 3;
    const flow: FlowLevel = 1;
    const optimal = getRequirements(days, flow);

    if (optimal.pad > 0) {
      const reducedPad = { ...optimal, pad: optimal.pad - 1 };
      const timeline = simulateCycleTimeline(days, flow, reducedPad);
      expect(timeline.some((b) => b.cleanRemaining.pad < 0)).toBe(true);
    }

    if (optimal.panty > 0) {
      const reducedPanty = { ...optimal, panty: optimal.panty - 1 };
      const timeline = simulateCycleTimeline(days, flow, reducedPanty);
      expect(timeline.some((b) => b.cleanRemaining.panty < 0)).toBe(true);
    }

    if (optimal.boxer > 0) {
      const reducedBoxer = { ...optimal, boxer: optimal.boxer - 1 };
      const timeline = simulateCycleTimeline(days, flow, reducedBoxer);
      expect(timeline.some((b) => b.cleanRemaining.boxer < 0)).toBe(true);
    }
  });

  it('verifies that products washed at Day 2 18:00 only return at Day 3 08:00', () => {
    const timeline = simulateCycleTimeline(3, 1);
    const day2Night = timeline.find((b) => b.day === 2 && b.block === 'night')!;
    const day3Morning = timeline.find((b) => b.day === 3 && b.block === 'morning')!;

    expect(day2Night.phase).toBe('washing_drying');
    expect(day2Night.inLaundry.pad).toBeGreaterThan(0);
    expect(day3Morning.phase).toBe('post_wash');
    expect(day3Morning.inLaundry.pad).toBe(0);
  });
});

describe('4. Pack Combinations Optimizer (Packs of 3, 5, 7)', () => {
  it('correctly recommends Pack of 7 + Pack of 3 for 10 units (User Example)', () => {
    const combo = getOptimalPackCombination(10);
    expect(combo.pack7).toBe(1);
    expect(combo.pack3).toBe(1);
    expect(combo.pack5).toBe(0);
    expect(combo.totalCapacity).toBe(10);
    expect(combo.excessUnits).toBe(0);
    expect(combo.description).toBe('1 × Pack of 7 + 1 × Pack of 3');
  });

  it('correctly recommends Pack of 5 + Pack of 3 for 8 units', () => {
    const combo = getOptimalPackCombination(8);
    expect(combo.pack5).toBe(1);
    expect(combo.pack3).toBe(1);
    expect(combo.totalCapacity).toBe(8);
    expect(combo.excessUnits).toBe(0);
  });

  it('correctly recommends single Pack of 7 for 7 units', () => {
    const combo = getOptimalPackCombination(7);
    expect(combo.pack7).toBe(1);
    expect(combo.totalCapacity).toBe(7);
    expect(combo.excessUnits).toBe(0);
  });

  it('correctly recommends 2 × Pack of 3 for 6 units', () => {
    const combo = getOptimalPackCombination(6);
    expect(combo.pack3).toBe(2);
    expect(combo.totalCapacity).toBe(6);
    expect(combo.excessUnits).toBe(0);
  });

  it('correctly recommends 1 × Pack of 5 for 5 units', () => {
    const combo = getOptimalPackCombination(5);
    expect(combo.pack5).toBe(1);
    expect(combo.totalCapacity).toBe(5);
    expect(combo.excessUnits).toBe(0);
  });

  it('correctly recommends Pack of 7 + Pack of 5 for 12 units', () => {
    const combo = getOptimalPackCombination(12);
    expect(combo.pack7).toBe(1);
    expect(combo.pack5).toBe(1);
    expect(combo.totalCapacity).toBe(12);
    expect(combo.excessUnits).toBe(0);
  });

  it('correctly recommends 2 × Pack of 7 for 14 units', () => {
    const combo = getOptimalPackCombination(14);
    expect(combo.pack7).toBe(2);
    expect(combo.totalCapacity).toBe(14);
    expect(combo.excessUnits).toBe(0);
  });

  it('handles zero or negative units gracefully', () => {
    const combo = getOptimalPackCombination(0);
    expect(combo.totalCapacity).toBe(0);
    expect(combo.totalPacks).toBe(0);
  });
});

describe('5. Full Ecowoman Recommender Integration', () => {
  it('integrates cycle requirements into separate underwear and pad packs', () => {
    const req: ProductRequirements = { pad: 4, panty: 3, boxer: 3 }; // 6 underwear (3 panty + 3 boxer), 4 pads
    const rec = getBestPack(req);

    expect(rec.totalUnderwearNeeded).toBe(6);
    expect(rec.totalPadsNeeded).toBe(4);
    expect(rec.totalUnitsNeeded).toBe(10);

    // Underwear: 6 units -> 2 × Pack of 3 (exact 6)
    expect(rec.underwearPack.packCombination.totalCapacity).toBe(6);
    expect(rec.underwearPack.packCombination.description).toBe('2 × Pack of 3');

    // Pads: 4 units -> 1 × Pack of 5 (5 units, 1 buffer)
    expect(rec.padsPack.packCombination.totalCapacity).toBe(5);
    expect(rec.padsPack.packCombination.description).toBe('1 × Pack of 5');

    expect(rec.requirements.pad).toBe(4);
    expect(rec.requirements.panty).toBe(3);
    expect(rec.requirements.boxer).toBe(3);
  });
});
