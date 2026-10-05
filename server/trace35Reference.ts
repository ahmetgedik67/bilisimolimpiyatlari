/**
 * Bu hesaplayıcı, istemci görev üreticisinden bağımsızdır ve yalnızca test
 * referansı olarak kullanılır. Her adımın eğitim spesifikasyonundaki giriş
 * değerleri ile işlem kuralını ikinci kez hesaplar; istemci verisini içe almaz.
 */
export function calculateTrace35ReferenceAnswer(step: number, variant = 0): string {
  const v = Math.max(0, Math.trunc(variant)) % 3;
  switch (step) {
    case 1: return String(6 + 4 * v);
    case 2: return String(10 + 3 * v);
    case 3: return `${7 + 3 * v} ${5 + 2 * v}`;
    case 4: return String((3 + v) * (2 + v) + 1 + v);
    case 5: { const value = 17 + 6 * v; const divisor = 5 + v; return `${Math.trunc(value / divisor)} ${value % divisor}`; }
    case 6: return `${8 + 2 * v} ${4 - v}`;
    case 7: return v === 2 ? "A" : "B";
    case 8: return v === 1 ? "T" : "E";
    case 9: return v === 0 ? "B" : "A";
    case 10: return v === 1 ? "A" : "B";
    case 11: return ["A", "B", "C"][v];
    case 12: return String(4 + v);
    case 13: return String([18, 30, 45][v]);
    case 14: return "5";
    case 15: return String([4, 4, 5][v]);
    case 16: return String([6, 12, 12][v]);
    case 17: return String(7 + 5 * v);
    case 18: return String(9 + 3 * v);
    case 19: return "0";
    case 20: return String([2, 2, 1][v]);
    case 21: return String((3 + v) * (2 + v) + 1);
    case 22: return String(13 + 4 * v);
    case 23: return String([3, 3, 4][v]);
    case 24: return String((11 + 4 * v) % 10);
    case 25: return String(Math.trunc((245 + 111 * v) / 10) % 10);
    case 26: return String(((1 + v) << 3) + ((16 + 8 * v) >> 2));
    case 27: return String(3 + 4 * v);
    case 28: return String(12 + 3 * v);
    case 29: return String([0, 1, 4][v]);
    case 30: return String(v === 1 || v === 2 ? 0 : 1);
    case 31: return String(6 + 2 * v);
    case 32: return String([3, 2, 2][v]);
    case 33: return String(4 + 2 * v);
    case 34: return String((14 + 3 * v) % 6);
    case 35: return String([8, 13, 21][v]);
    default: throw new Error(`Referans hesaplayıcı için geçersiz görev: ${step}`);
  }
}
