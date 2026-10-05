export const ANSWER_LOCK_DURATION_MS = 10_000;

export function createAnswerUnlockAt(now: number): number {
  return now + ANSWER_LOCK_DURATION_MS;
}

export function getAnswerSecondsLeft(unlockAt: number, now: number): number {
  return Math.max(0, Math.ceil((unlockAt - now) / 1000));
}

export function isAnswerLocked(unlockAt: number, now: number): boolean {
  return getAnswerSecondsLeft(unlockAt, now) > 0;
}
