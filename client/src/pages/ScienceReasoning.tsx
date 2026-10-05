import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Lightbulb, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { RobiImage } from "@/components/RobiImage";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ROBI_IMAGE } from "@/lib/robiGuide";
import { SCIENCE_QUESTIONS } from "@/lib/scienceQuestions";

const STORAGE_KEY = "bilfen-bilim-zeka-progress";
const SOUND_KEY = "bilfen-bilim-zeka-sound";

function playCorrectSound() {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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

export default function ScienceReasoning() {
  const [step, setStep] = useState(() => Number(localStorage.getItem(STORAGE_KEY) || 0));
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [unlockAt, setUnlockAt] = useState(() => Date.now() + 10000);
  const [remaining, setRemaining] = useState(10);
  const [finished, setFinished] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintNotice, setHintNotice] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem(SOUND_KEY) !== "off");
  const { user } = useAuth();
  const account = trpc.account.status.useQuery(undefined, { enabled: Boolean(user) });
  const [celebrate, setCelebrate] = useState(false);
  const recordResult = trpc.learning.recordScienceResult.useMutation();
  const useHint = trpc.learning.useScienceHint.useMutation({
    onSuccess: result => {
      if (result.success) { setHintUsed(true); setHintLevel(1); setHintNotice(`İpucu kullanıldı. ${result.penalty} puan düşüldü.`); }
      else setHintNotice(result.reason ?? "Bu ipucu şu anda kullanılamıyor.");
    },
    onError: error => setHintNotice(error.message),
  });
  const question = SCIENCE_QUESTIONS[Math.min(step, SCIENCE_QUESTIONS.length - 1)];
  const isLocked = remaining > 0 && !selected;
  const progress = Math.min(100, Math.round((step / SCIENCE_QUESTIONS.length) * 100));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, Math.ceil((unlockAt - Date.now()) / 1000))), 250);
    return () => window.clearInterval(timer);
  }, [unlockAt]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, String(step)); }, [step]);

  const nextQuestion = () => {
    if (step >= SCIENCE_QUESTIONS.length - 1) { setFinished(true); return; }
    setStep(value => value + 1); setSelected(null); setHintLevel(0); setHintUsed(false); setHintNotice(""); setCelebrate(false); setUnlockAt(Date.now() + 10000); setRemaining(10);
  };

  const choose = (option: string) => {
    if (isLocked || selected) return;
    setSelected(option);
    if (account.data?.role === "student") recordResult.mutate({ questionId: question.id, skill: question.category, isCorrect: option === question.answer, durationSeconds: Math.max(0, 10 - remaining) });
    if (option === question.answer) { setScore(value => value + 1); if (soundEnabled) playCorrectSound(); setCelebrate(true); window.setTimeout(() => setCelebrate(false), 2600); }
  };

  const restart = () => {     setStep(0); setScore(0); setSelected(null); setHintLevel(0); setHintUsed(false); setHintNotice(""); setCelebrate(false); setFinished(false); setUnlockAt(Date.now() + 10000); setRemaining(10); };

  if (finished) return <main className="science-page"><section className="science-result"><RobiImage src={ROBI_IMAGE} alt="Robi, bilim ve zekâ rehberi" /><span className="eyebrow eyebrow--ink">20 soruluk rota tamamlandı</span><h1>Merakın güçlü bir iz bıraktı.</h1><p>{score} / {SCIENCE_QUESTIONS.length} soruyu doğru yanıtladın. Yanlışlar bir sonraki denemede kullanacağın yeni ipuçlarıdır.</p><div className="science-result__actions"><button className="science-button science-button--primary" onClick={restart}><RotateCcw size={16} /> Yeniden başla</button><a className="science-button" href="/">Atlas’a dön <ArrowRight size={16} /></a></div></section></main>;

  return <main className="science-page">
    <header className="science-topbar"><a href="/" className="science-back"><ArrowLeft size={16} /> Atlas’a dön</a><div><span>BİLFEN · ALGORİTMA ATLASI</span><strong>Bilim ve Zekâ</strong></div><span className="science-count">{step + 1} / 20</span></header>
    <section className="science-hero"><div><span className="eyebrow eyebrow--ink"><Sparkles size={14} /> Ek keşif modülü</span><h1>Bilimsel düşün,<br /><em>zekânı işlet.</em></h1><p>Bilge Kunduz’un bilgi işlemsel düşünme yaklaşımından ilham alan, özgün 20 soruluk akıl yürütme rotası.</p></div><div className="science-hero__guide"><RobiImage src={ROBI_IMAGE} alt="Robi, bilim ve zekâ rehberi" /><div><span>ROBİ’NİN İŞARETİ</span><strong>Önce gözlemle, sonra bağ kur.</strong></div></div></section>
    <div className="science-progress" aria-label={`${step} soru tamamlandı`}><span style={{ width: `${progress}%` }} /></div>
    {celebrate && <div className="science-celebration" role="status" aria-live="polite"><div className="science-confetti" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ ["--i" as string]: index } as React.CSSProperties} />)}</div><RobiImage src={ROBI_IMAGE} alt="Robi kutlama yapıyor" /><strong>Harika iz sürdün!</strong><span>Robi seninle gurur duyuyor.</span><button type="button" className="science-sound-toggle" onClick={() => { const next = !soundEnabled; setSoundEnabled(next); localStorage.setItem(SOUND_KEY, next ? "on" : "off"); }} aria-pressed={soundEnabled} aria-label={soundEnabled ? "Doğru cevap sesini kapat" : "Doğru cevap sesini aç"}>{soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />} {soundEnabled ? "Sesi kapat" : "Sesi aç"}</button></div>}
    <section className="science-layout"><aside className="science-aside"><span className="science-kicker">{question.category}</span><h2>{question.title}</h2><p>Her soruda verilen bilgiyi ayır, sonra en küçük kanıtla ilerle.</p><div className="science-steps"><span>01</span> Gözlemi ayır<span>02</span> İlişkiyi kur<span>03</span> Kararı sınayarak seç</div></aside>
      <article className="science-card"><div className="science-card__meta"><span><Clock3 size={15} /> {isLocked ? `${remaining} sn sonra seçenekler açılacak` : "Seçenekler açık"}</span><span>{question.number} / 20</span></div><h2>{question.prompt}</h2><div className="science-options" role="group" aria-label="Cevap seçenekleri">{question.options.map((option, index) => <button key={option} disabled={isLocked || !!selected} className={`${selected === option ? (option === question.answer ? "is-correct" : "is-wrong") : ""} ${selected && option === question.answer ? "is-answer" : ""}`} onClick={() => choose(option)}><b>{String.fromCharCode(65 + index)}</b><span>{option}</span></button>)}</div><div className="science-card__footer"><button className="science-hint" onClick={() => useHint.mutate({ questionId: question.id })} disabled={isLocked || !!selected || hintUsed || useHint.isPending}><Lightbulb size={16} /> {useHint.isPending ? "İpucu hazırlanıyor…" : "İpucu · 5 puan"}</button>{hintNotice && <p className="science-hint__notice" role="status">{hintNotice}</p>}{hintLevel > 0 && <p className="science-hint__text" role="status">{question.hints[hintLevel - 1]}</p>}{selected && <p className={`science-feedback ${selected === question.answer ? "is-good" : "is-bad"}`} role="status">{selected === question.answer ? <><Check size={16} /> Doğru iz. {question.explanation}</> : <>Bu seçim bu gözlemle örtüşmüyor. {question.explanation}</>}</p>}{selected && <button className="science-next" onClick={nextQuestion}>{step === SCIENCE_QUESTIONS.length - 1 ? "Sonucu gör" : "Sonraki soruya geç"} <ArrowRight size={16} /></button>}</div></article>
    </section><p className="science-source-note">Bu modül, Bilge Kunduz/Bebras kaynaklarının konu ve beceri yapısından esinlenen özgün bir Bilfen eğitim çalışmasıdır; resmî yarışma sorularını kopyalamaz.</p>
  </main>;
}
