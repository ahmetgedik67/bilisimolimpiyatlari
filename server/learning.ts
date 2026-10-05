export type MissionCompletion = {
  completedMissionIds: string[];
  merakPuani: number;
  isNew: boolean;
};

export type TrialScore = {
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  netMilli: number;
};

function parseMissionIds(rawMissionIds: string): string[] {
  try {
    const parsed: unknown = JSON.parse(rawMissionIds);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/** Bir görev için puan yalnızca ilk tamamlamada eklenir. */
export function mergeMissionCompletion(
  rawMissionIds: string,
  currentPoints: number,
  missionId: string,
  reward: number,
): MissionCompletion {
  const completedMissionIds = parseMissionIds(rawMissionIds);
  if (completedMissionIds.includes(missionId)) {
    return { completedMissionIds, merakPuani: currentPoints, isNew: false };
  }

  return {
    completedMissionIds: [...completedMissionIds, missionId],
    merakPuani: currentPoints + reward,
    isNew: true,
  };
}

export function calculateTrialScore(correctCount: number, wrongCount: number, blankCount: number): TrialScore {
  return {
    correctCount,
    wrongCount,
    blankCount,
    // Şartname, dört seçenekli sorularda üç yanlışın bir doğruyu götürdüğünü belirtir.
    netMilli: Math.round((correctCount - wrongCount / 3) * 1000),
  };
}

export function deriveBadgeKeys(completedMissionCount: number, hasTrialResult: boolean): string[] {
  const badges: string[] = [];
  if (completedMissionCount >= 1) badges.push("ilk-iz");
  if (completedMissionCount >= 4) badges.push("dortlu-yol");
  if (completedMissionCount >= 6) badges.push("atlas-ustasi");
  if (hasTrialResult) badges.push("deneme-kasifi");
  return badges;
}
