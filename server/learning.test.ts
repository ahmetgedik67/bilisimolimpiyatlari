import { describe, expect, it } from "vitest";
import { calculateTrialScore, deriveBadgeKeys, mergeMissionCompletion } from "./learning";

describe("mergeMissionCompletion", () => {
  it("adds a newly completed mission and its reward once", () => {
    expect(mergeMissionCompletion("[]", 10, "iz-surme", 15)).toEqual({
      completedMissionIds: ["iz-surme"],
      merakPuani: 25,
      isNew: true,
    });
  });

  it("does not reward the same mission twice", () => {
    expect(mergeMissionCompletion('["iz-surme"]', 25, "iz-surme", 15)).toEqual({
      completedMissionIds: ["iz-surme"],
      merakPuani: 25,
      isNew: false,
    });
  });

  it("recovers from malformed stored mission data", () => {
    expect(mergeMissionCompletion("not-json", 0, "karar-kapilari", 15)).toEqual({
      completedMissionIds: ["karar-kapilari"],
      merakPuani: 15,
      isNew: true,
    });
  });

  it("calculates the four-choice net using a three-wrong penalty", () => {
    expect(calculateTrialScore(3, 3, 1)).toEqual({
      correctCount: 3,
      wrongCount: 3,
      blankCount: 1,
      netMilli: 2000,
    });
  });

  it("unlocks badges from real progress thresholds", () => {
    expect(deriveBadgeKeys(4, true)).toEqual(["ilk-iz", "dortlu-yol", "deneme-kasifi"]);
  });
});
