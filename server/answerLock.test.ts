import { describe, expect, it } from "vitest";
import { ANSWER_LOCK_DURATION_MS, createAnswerUnlockAt, getAnswerSecondsLeft, isAnswerLocked } from "../client/src/lib/answerLock";

describe("answer lock", () => {
  it("locks a newly shown task for exactly ten seconds", () => {
    const shownAt = 1_000_000;
    const unlockAt = createAnswerUnlockAt(shownAt);

    expect(unlockAt).toBe(shownAt + ANSWER_LOCK_DURATION_MS);
    expect(isAnswerLocked(unlockAt, shownAt + 9_999)).toBe(true);
    expect(getAnswerSecondsLeft(unlockAt, shownAt + 9_999)).toBe(1);
    expect(isAnswerLocked(unlockAt, unlockAt)).toBe(false);
    expect(getAnswerSecondsLeft(unlockAt, unlockAt)).toBe(0);
  });
});
