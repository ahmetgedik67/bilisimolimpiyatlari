import { Check, ChevronRight, Clock3, Lightbulb, LockKeyhole, Sparkles, Target } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createAnswerUnlockAt, getAnswerSecondsLeft, isAnswerLocked as isAnswerLockActive } from "@/lib/answerLock";
import { THINKER_CELEBRATE_IMAGE, THINKER_NAMES, THINKER_THINKING_IMAGE } from "@/lib/thinkerGuide";
import { ThinkerImage } from "@/components/ThinkerImage";
import { getTrace35Task, TRACE_STEP_COUNT } from "@/lib/trace35";
import { trpc } from "@/lib/trpc";

type Trace100PanelProps = {
  isAuthenticated: boolean;
  savedCompletedIds: string[];
  onStepCompleted: (stepId: string) => void;
  onRouteCompleted: () => void;
};

const localStorageKey = "algoritma-atlasi-trace-35-v1";

function getSteps(ids: string[]) {
  return ids
    .map((id) => /^iz-surme35-(\d{3})$/.exec(id)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .filter((step) => step >= 1 && step <= TRACE_STEP_COUNT);
}

function getStoredSteps() {
  try {
    const raw = window.localStorage.getItem(localStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is number => Number.isInteger(item) && item >= 1 && item <= TRACE_STEP_COUNT) : [];
  } catch {
    return [];
  }
}

export function Trace100Panel({ isAuthenticated, savedCompletedIds, onStepCompleted, onRouteCompleted }: Trace100PanelProps) {
  const savedSteps = useMemo(() => getSteps(savedCompletedIds), [savedCompletedIds]);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => Array.from(new Set([...savedSteps, ...getStoredSteps()])).sort((a, b) => a - b));
  const [activeStep, setActiveStep] = useState(() => Math.min(TRACE_STEP_COUNT, Math.max(1, (getStoredSteps().sort((a, b) => b - a)[0] ?? 0) + 1)));
  const [variant, setVariant] = useState(0);
  const [hintStep, setHintStep] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [unlockAt, setUnlockAt] = useState(() => createAnswerUnlockAt(Date.now()));
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [thinkerMood, setThinkerMood] = useState<"thinking" | "celebrate">("thinking");
  const startedAtRef = useRef(Date.now());
  const answerLockedRef = useRef(true);
  const completeTraceStep = trpc.learning.completeTraceStep.useMutation();

  const currentTask = getTrace35Task(activeStep, variant);
  const isLocked = isAnswerLockActive(unlockAt, nowMs);
  const secondsLeft = getAnswerSecondsLeft(unlockAt, nowMs);
  const completedCount = completedSteps.length;
  const highestAvailable = Math.min(TRACE_STEP_COUNT, Math.max(1, (completedSteps.length ? Math.max(...completedSteps) + 1 : 1)));

  useEffect(() => {
    setCompletedSteps((current) => {
      const merged = Array.from(new Set([...current, ...savedSteps])).sort((a, b) => a - b);
      if (savedSteps.length > 0) setActiveStep((step) => step === 1 ? Math.min(TRACE_STEP_COUNT, Math.max(...merged) + 1) : step);
      return merged;
    });
  }, [savedSteps]);

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    const now = Date.now();
    answerLockedRef.current = true;
    startedAtRef.current = now;
    setNowMs(now);
    setUnlockAt(createAnswerUnlockAt(now));
    setSelectedAnswer(null);
    setHintStep(-1);
    setThinkerMood("thinking");
  }, [activeStep, variant]);

  useEffect(() => {
    if (nowMs >= unlockAt) {
      answerLockedRef.current = false;
      return;
    }
    const interval = window.setInterval(() => setNowMs(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [nowMs, unlockAt]);

  function chooseAnswer(answer: string) {
    if (answerLockedRef.current || selectedAnswer !== null) return;
    answerLockedRef.current = true;
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    setSelectedAnswer(answer);

    if (answer !== currentTask.answer) {
      if (isAuthenticated) completeTraceStep.mutate({ traceStepId: currentTask.id, durationSeconds, isCorrect: false });
      setVariant((current) => (current + 1) % 3);
      return;
    }

    if (isAuthenticated) completeTraceStep.mutate({ traceStepId: currentTask.id, durationSeconds, isCorrect: true });
    setThinkerMood("celebrate");
    setCompletedSteps((current) => Array.from(new Set([...current, activeStep])).sort((a, b) => a - b));
    onStepCompleted(currentTask.id);

    window.setTimeout(() => {
      if (activeStep === TRACE_STEP_COUNT) {
        onRouteCompleted();
      } else {
        setActiveStep(activeStep + 1);
      }
    }, 1800);
  }

  return (
    <section className="trace100-shell" aria-labelledby="trace100-title">
      <header className="trace100-head">
        <div>
          <span className="eyebrow eyebrow--ink"><Target size={14} /> 35 görev · kolaydan zora özgün rota</span>
          <h3 id="trace100-title">İz sürme kampı</h3>
          <p>Her aşama bir kod izleme becerisini sınar. Geçmiş yarışma sorularının metinleri değil, ölçtüğü kazanımlar bu özgün rotaya dönüştürüldü.</p>
        </div>
        <div className="trace100-counter" aria-live="polite"><b>{String(activeStep).padStart(2, "0")}</b><span>/ 35. görev</span><small>{completedCount} tamamlandı</small></div>
      </header>

      <div className="trace100-grid trace35-grid" aria-label="35 görevlik iz sürme ilerlemesi">
        {Array.from({ length: TRACE_STEP_COUNT }, (_, index) => {
          const step = index + 1;
          const completed = completedSteps.includes(step);
          const available = step <= highestAvailable || completed;
          return <button key={step} onClick={() => available && setActiveStep(step)} disabled={!available} className={`${step === activeStep ? "is-active" : ""} ${completed ? "is-completed" : ""}`} aria-current={step === activeStep ? "step" : undefined} aria-label={`İz sürme adımı ${step}${completed ? ", tamamlandı" : available ? ", açık" : ", kilitli"}`}>{completed ? <Check size={12} /> : step}</button>;
        })}
      </div>

      <div className="silent-task-stage trace100-stage">
        <aside className="silent-guide" aria-label="Bilge iz sürme rehberi">
          <span className="silent-guide__label">{thinkerMood === "celebrate" ? `${THINKER_NAMES.celebrate} · kutlama modu` : `${THINKER_NAMES.thinking} · düşünme modu`}</span>
          <ThinkerImage className={`robi-guide-motion robi-guide-motion--${thinkerMood}`} src={thinkerMood === "celebrate" ? THINKER_CELEBRATE_IMAGE : THINKER_THINKING_IMAGE} alt={thinkerMood === "celebrate" ? "Grace Hopper portresi; bilgisayar biliminin öncüsü kutlama modunda" : "Albert Einstein portresi; düşünür"} />
          <strong>{thinkerMood === "celebrate" ? "Harika iz sürdün!" : "Önce izle, sonra karar ver."}</strong>
          <p>{thinkerMood === "celebrate" ? "Bu aşamanın kuralını kendi izinle buldun." : "Sonucu söylemem; bakılacak değeri, koşulu ya da sayacı birlikte buluruz."}</p>
        </aside>

        <article className="code-mission" aria-labelledby="trace100-task-title">
          <div className="code-mission__header">
            <div>
              <span className="eyebrow eyebrow--coral">{String(activeStep).padStart(2, "0")} / 35 · {currentTask.skill}</span>
              <h3 id="trace100-task-title">{currentTask.challenge}</h3>
            </div>
            <div className="task-coordinates"><span className="difficulty-tag"><Target size={14} /> {activeStep <= 8 ? "başlangıç" : activeStep <= 22 ? "gelişen" : activeStep <= 30 ? "yarışma yaklaşımı" : "derin iz"}</span><small>özgün c görevi</small></div>
          </div>
          <div className="code-grid">
            <pre aria-label="C kodu örneği"><code>{currentTask.code}</code></pre>
            <div className="trace-panel">
              <span className="trace-label">Bilgenin iz sürme alanı</span>
              <p>İpucu sonucu değil, dikkat edilmesi gereken işlemi gösterir.</p>
              <button className="trace-toggle" onClick={() => setHintStep((current) => Math.min(current + 1, currentTask.hints.length - 1))} aria-expanded={hintStep >= 0} disabled={hintStep >= currentTask.hints.length - 1}>{hintStep < 0 ? "İpucu al" : hintStep === currentTask.hints.length - 1 ? "İpuçları açık" : "Bir ipucu daha"} <ChevronRight size={15} /></button>
              {hintStep >= 0 && <ol className="trace-steps" aria-label="Kademeli görev ipuçları">{currentTask.hints.slice(0, hintStep + 1).map((hint, index) => <li key={hint}><span>ipucu {index + 1}</span><b>{hint}</b></li>)}</ol>}
            </div>
          </div>
          <div className="answer-zone">
            <div>
              <span className="answer-label">Tahminini seç</span>
              <p className={`answer-wait ${isLocked ? "answer-wait--locked" : "answer-wait--ready"}`} role="status"><Clock3 size={14} />{isLocked ? <><b>{secondsLeft} sn</b> düşünme süresi: seçenekler birazdan açılacak.</> : <>Seçenekler açık. Tek bir cevap işaretle.</>}</p>
            </div>
            <div className="answer-buttons" role="group" aria-label="A ile H arasındaki olası program çıktıları">{currentTask.options.map((option, index) => {
              const choiceLabel = String.fromCharCode(65 + index);
              return <button key={option} onClick={() => chooseAnswer(option)} disabled={isLocked || selectedAnswer !== null} className={selectedAnswer === option ? (option === currentTask.answer ? "is-correct" : "is-wrong") : ""} aria-pressed={selectedAnswer === option} aria-label={`${choiceLabel} şıkkı: ${option}`}><span className="answer-choice-letter" aria-hidden="true">{choiceLabel}</span><span>{option}</span></button>;
            })}</div>
          </div>
          {selectedAnswer && <div className={`feedback-note ${selectedAnswer === currentTask.answer ? "feedback-note--success" : "feedback-note--hint"}`} role="status">{selectedAnswer === currentTask.answer ? <Check size={18} /> : <Lightbulb size={18} />}<div><strong>{selectedAnswer === currentTask.answer ? "İz tamamlandı." : "Yeni bir iz geliyor."}</strong><span>{selectedAnswer === currentTask.answer ? "Bilge kutluyor; sıradaki aşama hazırlanıyor." : "Aynı kazanım, farklı değerlerle yeniden geliyor. İpuçları da baştan açılacak."}</span></div></div>}
        </article>
      </div>
    </section>
  );
}
