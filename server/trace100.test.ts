import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getTrace35Task, getTraceStepId, trace35Tasks, TRACE_STEP_COUNT } from "../client/src/lib/trace35";
import { calculateTrace35ReferenceAnswer } from "./trace35Reference";

// C derleme testi yalnız gcc kurulu ortamlarda koşabilir; gcc bulunmayan
// makinelerde (ör. Windows geliştirme ortamı) test atlanır, paket temiz geçer.
const gccAvailable = (() => {
  try {
    execFileSync("gcc", ["--version"], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
})();

function standaloneProgram(code: string) {
  const cleaned = code.replace(/\n\/\/ iz sürme görevi: \d+$/, "");
  if (!cleaned.startsWith("int ") || !cleaned.includes("return")) return `#include <stdio.h>\nint main(void) {\n${cleaned}\nreturn 0;\n}`;
  const functionEnd = cleaned.indexOf("}\n") + 1;
  return `#include <stdio.h>\n${cleaned.slice(0, functionEnd)}\nint main(void) {\n${cleaned.slice(functionEnd).trim()}\nreturn 0;\n}`;
}

function compileAndRun(code: string) {
  const directory = mkdtempSync(join(tmpdir(), "algoritma-atlasi-trace-"));
  const sourcePath = join(directory, "task.c");
  const binaryPath = join(directory, "task");
  try {
    writeFileSync(sourcePath, standaloneProgram(code));
    execFileSync("gcc", ["-std=c11", sourcePath, "-o", binaryPath], { stdio: "pipe" });
    return execFileSync(binaryPath, { encoding: "utf8" }).trim();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe("35 görevlik iz sürme rotası", () => {
  it("her aşama için özgün, cevaplanabilir bir C görevi üretir", () => {
    expect(trace35Tasks).toHaveLength(TRACE_STEP_COUNT);
    expect(new Set(trace35Tasks.map((task) => task.id)).size).toBe(TRACE_STEP_COUNT);
    expect(new Set(trace35Tasks.map((task) => task.code)).size).toBe(TRACE_STEP_COUNT);
    trace35Tasks.forEach((task, index) => {
      expect(task.id).toBe(getTraceStepId(index + 1));
      expect(task.options).toHaveLength(8);
      expect(task.options.filter((option) => option === task.answer)).toHaveLength(1);
      expect(task.hints).toHaveLength(3);
    });
  });

  it("doğru yanıtı sekiz şık boyunca dengeli konumlara yerleştirir", () => {
    const answerPositions = trace35Tasks.map((task) => task.options.indexOf(task.answer));
    const positionCounts = Array.from({ length: 8 }, (_, position) => answerPositions.filter((index) => index === position).length);
    expect(positionCounts.every((count) => count > 0)).toBe(true);
    expect(Math.max(...positionCounts) - Math.min(...positionCounts)).toBeLessThanOrEqual(1);
  });

  it("ilk dokuz görevde farklı temel becerilere geçer ve rota boyunca konu tekrarını önler", () => {
    expect(new Set(trace35Tasks.slice(0, 9).map((task) => task.skill)).size).toBe(9);
    expect(new Set(trace35Tasks.map((task) => task.skill)).size).toBe(TRACE_STEP_COUNT);
  });

  it.skipIf(!gccAvailable)("35 görevin üç varyantındaki C kodunu bağımsız olarak derleyip çalıştırarak cevabı doğrular", () => {
    for (let step = 1; step <= TRACE_STEP_COUNT; step += 1) {
      for (let variant = 0; variant < 3; variant += 1) {
        const task = getTrace35Task(step, variant);
        expect(compileAndRun(task.code)).toBe(task.answer);
        expect(task.options).toHaveLength(8);
        expect(task.options.filter((option) => option === task.answer)).toHaveLength(1);
      }
    }
  });

  it("üreticiden bağımsız hesaplayıcıyla tüm görev ve varyantları karşılaştırır", () => {
    for (let step = 1; step <= TRACE_STEP_COUNT; step += 1) {
      for (let variant = 0; variant < 3; variant += 1) {
        expect(getTrace35Task(step, variant).answer).toBe(calculateTrace35ReferenceAnswer(step, variant));
      }
    }
  });

  it("yanlış yanıt sonrası kullanılacak aynı kazanımlı varyantı değiştirir", () => {
    const original = getTrace35Task(24, 0);
    const variation = getTrace35Task(24, 1);
    expect(variation.skill).toBe(original.skill);
    expect(variation.code).not.toBe(original.code);
    expect(variation.options).toContain(variation.answer);
  });
});
