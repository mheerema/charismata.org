import { describe, it, expect } from "vitest";
import {
  GIFT_NEXT_STEPS,
  ACTIVE_CATEGORY_INTERNAL_NAMES,
} from "./gift-content";

// Regression guard for the public_name -> internal_name re-key. Before the fix,
// GIFT_NEXT_STEPS was keyed by the editable public_name, so renaming or retiring
// a category silently resolved an empty Next Step. These tests pin the contract:
// every active category resolves a non-empty Next Step via its stable
// internal_name key.

describe("GIFT_NEXT_STEPS keyed by internal_name", () => {
  it("resolves a non-empty Next Step for every active category", () => {
    for (const internalName of ACTIVE_CATEGORY_INTERNAL_NAMES) {
      const step = GIFT_NEXT_STEPS[internalName];

      expect(step, `missing Next Step for active category "${internalName}"`).toBeDefined();
      expect(step.reflect.length, `empty reflect[] for "${internalName}"`).toBeGreaterThan(0);
      expect(step.steps.length, `empty steps[] for "${internalName}"`).toBeGreaterThan(0);
      expect(step.scripture.trim().length, `empty scripture for "${internalName}"`).toBeGreaterThan(0);
    }
  });

  it("has exactly one entry per active category and no orphan keys", () => {
    const activeSet = new Set<string>(ACTIVE_CATEGORY_INTERNAL_NAMES);
    const mapKeys = Object.keys(GIFT_NEXT_STEPS);

    // Every active category is represented.
    expect(mapKeys.length).toBe(ACTIVE_CATEGORY_INTERNAL_NAMES.length);
    // No key in the map falls outside the active set (no stale/renamed leftovers).
    for (const key of mapKeys) {
      expect(activeSet.has(key), `unexpected key "${key}" in GIFT_NEXT_STEPS`).toBe(true);
    }
  });

  it("is keyed by internal_name, not public_name (renamed key would resolve nothing)", () => {
    // The old public_name keys must no longer be present.
    expect(GIFT_NEXT_STEPS["Service & Helps"]).toBeUndefined();
    expect(GIFT_NEXT_STEPS["Administration"]).toBeUndefined();
    // The internal_name keys are the live contract.
    expect(GIFT_NEXT_STEPS["service_helps"]).toBeDefined();
    expect(GIFT_NEXT_STEPS["administration"]).toBeDefined();
  });

  it("degrades gracefully for a retired/unknown category (no entry, no throw)", () => {
    // The retired "service_administration" category has no Next Step by design.
    expect(GIFT_NEXT_STEPS["service_administration"]).toBeUndefined();
    expect(() => GIFT_NEXT_STEPS["does_not_exist"]).not.toThrow();
  });
});
