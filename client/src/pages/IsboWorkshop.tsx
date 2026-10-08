import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ListChecks,
  MessageSquare,
  Pause,
  Play,
  Puzzle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { RobiImage } from "@/components/RobiImage";
import { ROBI_IMAGE } from "@/lib/robiGuide";
import { ISBO_EXAM_QUESTIONS } from "@/lib/isboExamQuestions";
import { ISBO_DRILL_QUESTIONS, type AnimStep, type IsboQuestion } from "@/lib/isboQuestions";

const PROGRESS_KEY = "bilfen-isbo-atolyesi-progress";
const SOUND_KEY = "bilfen-isbo-atolyesi-sound";

type Mode = "sinav" | "alistirma";
type ProgressMap = Record<string, "correct" | "wrong">;

const PHASE_ICONS = [BookOpen, Puzzle, Eye, MessageSquare, ListChecks] as const;

function playCorrectSound() {
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const now = context.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.08 + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.24);
  });
  window.setTimeout(() => void context.close(), 700);
}

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

/** Animasyon adımını türe göre sahneye döker. */
function AnimStage({ question, step }: { question: IsboQuestion; step: AnimStep }) {
  const { kind } = question.animation;

  if (kind === "counter") {
    return (
      <div className="isbo-stage">
        <div className="isbo-counter">
          <span className="isbo-counter__label">{step.boxLabel ?? "kutu"}</span>
          <strong className="isbo-counter__value">{step.boxValue ?? "—"}</strong>
          {step.boxDelta && <em className="isbo-counter__delta">{step.boxDelta}</em>}
        </div>
        {step.vars && (
          <div className="isbo-vars">
            {step.vars.map((v) => (
              <span key={v.name} className={v.highlight ? "is-hi" : ""}>
                <b>{v.name}</b> {v.value}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (kind === "binary") {
    return (
      <div className="isbo-stage">
        <div className="isbo-bits">
          {(step.bits ?? []).map((b, i) => (
            <span key={i} className={`isbo-bit is-${b.role}`}>
              {b.bit}
            </span>
          ))}
        </div>
        {step.binaryNote && <p className="isbo-stage__note">{step.binaryNote}</p>}
      </div>
    );
  }

  if (kind === "flow") {
    return (
      <div className="isbo-stage">
        <div className="isbo-flow">
          <div className={`isbo-gate ${step.flowState === "true" ? "is-yes" : "is-no"}`}>
            <span>Kapı</span>
            <strong>{step.flowLeft ?? "?"}</strong>
            <em>{step.flowState === "true" ? "EVET ✓" : "HAYIR ✗"}</em>
          </div>
          <ArrowRight size={22} className="isbo-flow__arrow" />
          <div className="isbo-gate is-next">
            <span>Sonraki</span>
            <strong>{step.flowRight ?? "—"}</strong>
          </div>
        </div>
        {step.vars && (
          <div className="isbo-vars">
            {step.vars.map((v) => (
              <span key={v.name} className={v.highlight ? "is-hi" : ""}>
                <b>{v.name}</b> {v.value}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (kind === "grid" && step.grid) {
    const { cols, robot, trail } = step.grid;
    const cellCount = Math.max(9, robot + 1, trail.length + 1);
    const rows = Math.ceil(cellCount / cols);
    return (
      <div className="isbo-stage">
        <div className="isbo-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: rows * cols }, (_, i) => (
            <span key={i} className={`${trail.includes(i) ? "is-trail" : ""} ${i === robot ? "is-robot" : ""}`}>
              {i === robot ? "🤖" : ""}
            </span>
          ))}
        </div>
        {step.vars && (
          <div className="isbo-vars">
            {step.vars.map((v) => (
              <span key={v.name} className={v.highlight ? "is-hi" : ""}>
                <b>{v.name}</b> {v.value}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (kind === "trace") {
    return (
      <div className="isbo-stage isbo-stage--wide">
        <pre className="isbo-code">
          {(question.animation.codeLines ?? []).map((line, i) => (
            <code key={i} className={step.line === i ? "is-active" : ""}>
              {line || " "}
            </code>
          ))}
        </pre>
        <div className="isbo-output">
          <span>çıktı</span>
          <strong>{step.output ?? "—"}</strong>
        </div>
      </div>
    );
  }

  if (kind === "sequence") {
    return (
      <div className="isbo-stage">
        <div className="isbo-strip">
          {(question.animation.cells ?? []).map((cell, i) => (
            <span key={i} className={(step.active ?? []).includes(i) ? "is-hi" : ""}>
              {cell}
            </span>
          ))}
        </div>
        {step.vars && (
          <div className="isbo-vars">
            {step.vars.map((v) => (
              <span key={v.name} className={v.highlight ? "is-hi" : ""}>
                <b>{v.name}</b> {v.value}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (kind === "sets") {
    const [labelA, labelB] = question.animation.setLabels ?? ["Küme A", "Küme B"];
    return (
      <div className="isbo-stage">
        <div className="isbo-sets">
          <div className="isbo-set">
            <span>{labelA}</span>
            <div>
              {(question.animation.setA ?? []).map((ch, i) => (
                <b key={i} className={(step.hiA ?? []).includes(i) ? "is-hi" : ""}>
                  {ch}
                </b>
              ))}
            </div>
          </div>
          <div className="isbo-set">
            <span>{labelB}</span>
            <div>
              {(question.animation.setB ?? []).map((ch, i) => (
                <b key={i} className={(step.hiB ?? []).includes(i) ? "is-hi" : ""}>
                  {ch}
                </b>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "swap") {
    return (
      <div className="isbo-stage">
        <div className="isbo-strip">
          {(step.tokens ?? []).map((t, i) => (
            <span
              key={i}
              className={`${(step.hi ?? []).includes(i) ? "is-hi" : ""} ${(step.lock ?? []).includes(i) ? "is-locked" : ""}`}
            >
              {t}
            </span>
          ))}
        </div>
        {question.animation.target && (
          <p className="isbo-stage__note">Hedef dizilim: {question.animation.target.join(" ")}</p>
        )}
      </div>
    );
  }

  if (kind === "graph" && question.animation.graph) {
    const { nodes, edges } = question.animation.graph;
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const pathSet = new Set(step.pathNodes ?? []);
    const edgeSet = new Set(step.pathEdges ?? []);
    return (
      <div className="isbo-stage">
        <svg className="isbo-graph" viewBox="0 0 300 170" role="img" aria-label={question.animation.heading}>
          {edges.map((e, i) => {
            const a = nodeById.get(e.a);
            const b = nodeById.get(e.b);
            if (!a || !b) return null;
            return (
              <g key={i} className={edgeSet.has(i) ? "is-path" : ""}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4}>
                  {e.w}
                </text>
              </g>
            );
          })}
          {nodes.map((n) => (
            <g key={n.id} className={pathSet.has(n.id) ? "is-path" : ""}>
              <circle cx={n.x} cy={n.y} r={15} />
              <text x={n.x} y={n.y + 4}>
                {n.id}
              </text>
            </g>
          ))}
        </svg>
        {step.total && (
          <div className="isbo-output">
            <span>rota toplamı</span>
            <strong>{step.total}</strong>
          </div>
        )}
      </div>
    );
  }

  if (kind === "table") {
    const rows = question.animation.rows ?? [];
    return (
      <div className="isbo-stage isbo-stage--wide">
        <div className="isbo-table">
          {rows.map((row, i) => (
            <div key={i} className={row.state ? `is-${row.state}` : ""}>
              {row.cells.map((cell, j) => (
                <span key={j}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function IsboWorkshop() {
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("bilfen-isbo-mode") as Mode) === "alistirma" ? "alistirma" : "sinav");
  const [indices, setIndices] = useState<Record<Mode, number>>({ sinav: 0, alistirma: 0 });
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem(SOUND_KEY) !== "off");
  const [celebrate, setCelebrate] = useState(false);

  const questions = mode === "sinav" ? ISBO_EXAM_QUESTIONS : ISBO_DRILL_QUESTIONS;
  const qIndex = indices[mode];
  const question = questions[Math.min(qIndex, questions.length - 1)];
  const status = progress[question.id];
  const step = question.animSteps[Math.min(stepIdx, question.animSteps.length - 1)];
  const isLastPhase = phaseIdx === 4;

  const solved = useMemo(
    () => questions.filter((q) => progress[q.id]).length,
    [questions, progress],
  );
  const correctCount = useMemo(
    () => questions.filter((q) => progress[q.id] === "correct").length,
    [questions, progress],
  );
  const progressPct = Math.round((solved / questions.length) * 100);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("bilfen-isbo-mode", mode);
  }, [mode]);

  // Oynat: animasyon adımlarını otomatik ilerlet.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIdx((current) => {
        if (current >= question.animSteps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1700);
    return () => window.clearInterval(timer);
  }, [playing, question.animSteps.length]);

  const gotoQuestion = (next: number) => {
    const clamped = Math.max(0, Math.min(questions.length - 1, next));
    setIndices((current) => ({ ...current, [mode]: clamped }));
    setPhaseIdx(0);
    setStepIdx(0);
    setPlaying(false);
    setCelebrate(false);
    setSelected(progress[questions[clamped].id] ? questions[clamped].answer : null);
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setPhaseIdx(0);
    setStepIdx(0);
    setPlaying(false);
    setCelebrate(false);
    setSelected(null);
  };

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === question.answer;
    setProgress((current) => ({ ...current, [question.id]: correct ? "correct" : "wrong" }));
    if (correct) {
      if (soundEnabled) playCorrectSound();
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 2600);
    }
  };

  const retry = () => {
    setProgress((current) => {
      const next = { ...current };
      delete next[question.id];
      return next;
    });
    setSelected(null);
    setCelebrate(false);
  };

  return (
    <main className="isbo-page">
      <header className="isbo-topbar">
        <a href="/" className="isbo-back">
          <ArrowLeft size={16} /> Atlas'a dön
        </a>
        <div>
          <span>BİLFEN · ALGORİTMA ATLASI</span>
          <strong>İSBO Soru Atölyesi</strong>
        </div>
        <span className="isbo-count">
          {qIndex + 1} / {questions.length}
        </span>
      </header>

      <section className="isbo-hero">
        <div>
          <span className="eyebrow eyebrow--ink">
            <Sparkles size={14} /> 2024 ön eleme · ortaokul bilgisayar
          </span>
          <h1>
            Soruyu çözme,<br />
            <em>önce anla.</em>
          </h1>
          <p>
            Her soru beş adımda incelenir: <b>Oku</b> → <b>Ayıştır</b> → <b>İzle</b> →{" "}
            <b>Yorumla</b> → <b>Yanıtla</b>. Animasyonu izle, gerekçelendir, sonra işaretle.
          </p>
          <div className="isbo-modes" role="tablist" aria-label="Soru seti seçimi">
            <button role="tab" aria-selected={mode === "sinav"} className={mode === "sinav" ? "is-active" : ""} onClick={() => switchMode("sinav")}>
              Sınav soruları <small>25 soru</small>
            </button>
            <button role="tab" aria-selected={mode === "alistirma"} className={mode === "alistirma" ? "is-active" : ""} onClick={() => switchMode("alistirma")}>
              Alıştırma <small>5 özgün soru</small>
            </button>
          </div>
        </div>
        <div className="isbo-hero__guide">
          <RobiImage src={ROBI_IMAGE} alt="Robi, İSBO atölyesi rehberi" />
          <div>
            <span>ROBİ'NİN İŞARETİ</span>
            <strong>Önce izle, sonra gerekçelendir.</strong>
            <div className="isbo-stats">
              <span>
                <b>{solved}</b>/{questions.length} çözülen
              </span>
              <span>
                <b>{correctCount}</b> doğru
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="isbo-progress" aria-label={`${solved} soru tamamlandı`}>
        <span style={{ width: `${progressPct}%` }} />
      </div>

      <nav className="isbo-rail" aria-label="Soru seçimi">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => gotoQuestion(i)}
            className={`${i === qIndex ? "is-current" : ""} ${progress[q.id] === "correct" ? "is-done" : ""} ${progress[q.id] === "wrong" ? "is-missed" : ""}`}
            title={q.topic}
          >
            {progress[q.id] === "correct" ? <Check size={11} /> : q.number}
          </button>
        ))}
      </nav>

      <article className="isbo-card">
        <div className="isbo-card__meta">
          <span>
            {question.section ? `${question.section} · ` : ""}
            {question.topic}
          </span>
          <span>Soru {question.number}</span>
        </div>

        <div className="isbo-phases" role="tablist" aria-label="İnceleme aşamaları">
          {question.phases.map((phase, i) => {
            const Icon = PHASE_ICONS[i];
            return (
              <button
                key={phase.id}
                role="tab"
                aria-selected={phaseIdx === i}
                className={phaseIdx === i ? "is-active" : ""}
                onClick={() => {
                  setPhaseIdx(i);
                  setPlaying(false);
                }}
              >
                <Icon size={14} /> {phase.title}
              </button>
            );
          })}
        </div>

        {question.sectionNote && phaseIdx === 0 && <p className="isbo-section-note">{question.sectionNote}</p>}

        <div className="isbo-phasebody">
          {phaseIdx === 0 && (
            <>
              <p className="isbo-prompt">{question.prompt}</p>
              {question.image && (
                <img className="isbo-question-img" src={`${import.meta.env.BASE_URL}${question.image}`} alt={`İSBO 2024 soru ${question.number}`} loading="lazy" />
              )}
              {question.code && <pre className="isbo-code isbo-code--static">{question.code}</pre>}
            </>
          )}

          {phaseIdx === 1 && (
            <>
              <p className="isbo-bodytext">{question.phases[1].body}</p>
              {question.phases[1].cards && (
                <div className="isbo-cards">
                  {question.phases[1].cards.map((card) => (
                    <div key={card.label}>
                      <span>{card.label}</span>
                      <strong>{card.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {phaseIdx === 2 && (
            <>
              <p className="isbo-bodytext">{question.phases[2].body}</p>
              <div className="isbo-player">
                <div className="isbo-player__head">
                  <strong>{question.animation.heading}</strong>
                  <div className="isbo-player__controls">
                    <button
                      onClick={() => {
                        setStepIdx(0);
                        setPlaying(true);
                      }}
                      aria-label="Baştan oynat"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Duraklat" : "Oynat"}>
                      {playing ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      onClick={() => {
                        setPlaying(false);
                        setStepIdx((s) => Math.max(0, s - 1));
                      }}
                      aria-label="Önceki adım"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setPlaying(false);
                        setStepIdx((s) => Math.min(question.animSteps.length - 1, s + 1));
                      }}
                      aria-label="Sonraki adım"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <AnimStage question={question} step={step} />
                <p className="isbo-stepnote">
                  <b>{step.label}</b> {step.note}
                </p>
                <div className="isbo-dots" aria-label={`Adım ${stepIdx + 1} / ${question.animSteps.length}`}>
                  {question.animSteps.map((_, i) => (
                    <button
                      key={i}
                      className={i === stepIdx ? "is-active" : i < stepIdx ? "is-past" : ""}
                      onClick={() => {
                        setPlaying(false);
                        setStepIdx(i);
                      }}
                      aria-label={`Adım ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {phaseIdx === 3 && <p className="isbo-bodytext">{question.phases[3].body}</p>}

          {phaseIdx === 4 && (
            <>
              <p className="isbo-bodytext">{question.phases[4].body}</p>
              <div className="isbo-options" role="group" aria-label="Cevap seçenekleri">
                {question.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const label = question.optionNotes?.[index] ?? option;
                  const isPicked = selected === option;
                  const isAnswer = option === question.answer;
                  const cls = isPicked ? (isAnswer ? "is-correct" : "is-wrong") : selected && isAnswer ? "is-answer" : "";
                  return (
                    <button key={option} disabled={Boolean(selected)} className={cls} onClick={() => choose(option)}>
                      <b>{letter}</b>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
              {selected && (
                <div className={`isbo-feedback ${selected === question.answer ? "is-good" : "is-bad"}`} role="status">
                  <p>
                    {selected === question.answer ? (
                      <>
                        <Check size={16} /> Doğru!{" "}
                      </>
                    ) : (
                      <></>
                    )}
                    {question.explanation}
                  </p>
                  <div>
                    <button onClick={retry}>
                      <RotateCcw size={14} /> Yeniden dene
                    </button>
                    {qIndex < questions.length - 1 && (
                      <button className="isbo-next" onClick={() => gotoQuestion(qIndex + 1)}>
                        Sonraki soru <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="isbo-card__footer">
          <button onClick={() => gotoQuestion(qIndex - 1)} disabled={qIndex === 0}>
            <ChevronLeft size={14} /> Önceki
          </button>
          <span>{isLastPhase ? "İşaretledin mi? Gerekçelendirdiğin cevap kalıcıdır." : "Aşamaları sırayla ilerle."}</span>
          <button onClick={() => gotoQuestion(qIndex + 1)} disabled={qIndex === questions.length - 1}>
            Sonraki <ChevronRight size={14} />
          </button>
        </footer>
      </article>

      {celebrate && (
        <div className="isbo-celebration" role="status" aria-live="polite">
          <div className="isbo-confetti" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} style={{ ["--i" as string]: index } as React.CSSProperties} />
            ))}
          </div>
          <RobiImage src={ROBI_IMAGE} alt="Robi kutlama yapıyor" />
          <strong>Harika gerekçelendirme!</strong>
          <span>Robi seninle gurur duyuyor.</span>
          <button
            type="button"
            className="isbo-sound-toggle"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              localStorage.setItem(SOUND_KEY, next ? "on" : "off");
            }}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? "Doğru cevap sesini kapat" : "Doğru cevap sesini aç"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />} {soundEnabled ? "Sesi kapat" : "Sesi aç"}
          </button>
        </div>
      )}

      <p className="isbo-source-note">
        Bu atölye, İSBO 2024 ortaokul bilgisayar ön eleme sınavının kamuya açık soru görsellerini eğitim amaçlı
        adım adım inceler; çözümler Bilfen'in önerilen çözümleridir ve resmî cevap anahtarı ile
        karşılaştırılabilir. Alıştırma soruları özgündür.
      </p>
    </main>
  );
}
