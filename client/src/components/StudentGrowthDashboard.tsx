import { ROBI_IMAGE } from "@/lib/robiGuide";
import { ArrowUpRight, BrainCircuit, CheckCircle2, Flame, Target } from "lucide-react";
import { RobiImage } from "@/components/RobiImage";
import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useState } from "react";

type StudentGrowthDashboardProps = {
  ageBand: "5-6" | "7-8";
  completedMissionIds: string[];
  merakPuani: number;
  activeMissionTitle: string;
  isAuthenticated: boolean;
  accountRole?: "teacher" | "student" | null;
  assignedMission?: { missionId: string; note: string } | null;
  accountKey?: string;
};

const dailyMissions = [
  { id: "iz-surme", title: "Bir kod izini tamamla", prompt: "İlk değişen değeri kendi cümlenle söyle." },
  { id: "bellek-kutulari", title: "Bir bellek kutusu incele", prompt: "Değişkenin önceki ve sonraki değerini yaz." },
  { id: "karar-kapilari", title: "Bir karar kapısı aç", prompt: "Koşulu doğru/yanlış diye gerekçelendir." },
  { id: "tekrar-parkuru", title: "Bir döngüyü turlara ayır", prompt: "Sayaç değerlerini tek tek sırala." },
  { id: "dizi-kiyisi", title: "Bir dizi indeksini bul", prompt: "İndeks sayımının neden sıfırdan başladığını açıkla." },
  { id: "kural-makinesi", title: "Bir fonksiyon kuralı kur", prompt: "Girdiyi parametreye yerleştirip sonucu tahmin et." },
] as const;

const skills = [
  { label: "Akış ve değişken", missionIds: ["iz-surme", "bellek-kutulari"] },
  { label: "Koşul kurma", missionIds: ["karar-kapilari"] },
  { label: "Döngü düşüncesi", missionIds: ["tekrar-parkuru"] },
  { label: "Dizi ve fonksiyon", missionIds: ["dizi-kiyisi", "kural-makinesi"] },
] as const;

export function StudentGrowthDashboard({
  ageBand,
  completedMissionIds,
  merakPuani,
  activeMissionTitle,
  isAuthenticated,
  accountRole = null,
  assignedMission = null,
  accountKey = "guest",
}: StudentGrowthDashboardProps) {
  const dayKey = new Date().toISOString().slice(0, 10);
  const dailyStorageKey = `algoritma-atlasi-daily-task-v1:${accountKey}`;
  const [dailyState, setDailyState] = useState<{ day: string; missionId: string; completed: boolean } | null>(null);
  const selectedMissionId = dailyState?.missionId ?? dailyMissions[new Date().getDate() % dailyMissions.length].id;
  const dailyInput = useMemo(() => ({ taskDate: dayKey, missionId: selectedMissionId }), [dayKey, selectedMissionId]);
  const canPersistDailyTask = isAuthenticated && accountRole === "student";
  const dailyTask = trpc.learning.dailyTask.useQuery(dailyInput, { enabled: canPersistDailyTask });
  const completedCount = completedMissionIds.length;
  const routePercent = Math.round((completedCount / 6) * 100);
  const masteredSkills = skills.filter(skill => skill.missionIds.every(id => completedMissionIds.includes(id))).length;
  const canPersistPractice = isAuthenticated && accountRole === "student";
  const practiceQuery = trpc.learning.practice.useQuery(undefined, { enabled: canPersistPractice });
  const spendHintMutation = trpc.learning.spendHint.useMutation({ onSuccess: next => practiceQuery.refetch() });
  const recordPracticeMutation = trpc.learning.recordPractice.useMutation({ onSuccess: () => practiceQuery.refetch() });
  const completeDailyTaskMutation = trpc.learning.completeDailyTask.useMutation({ onSuccess: task => { setDailyState({ day: task.taskDate, missionId: task.missionId, completed: task.completed }); if (canPersistPractice) recordPracticeMutation.mutate(); } });
  const [guestHintBudget, setGuestHintBudget] = useState(3);
  const hintBudget = canPersistPractice ? (practiceQuery.data?.hintBudget ?? 3) : guestHintBudget;
  const streak = canPersistPractice ? (practiceQuery.data?.streak ?? Math.min(7, completedCount)) : Math.min(7, completedCount);
  const spendHint = () => { if (canPersistPractice) spendHintMutation.mutate(); else setGuestHintBudget(value => Math.max(0, value - 1)); };
  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(dailyStorageKey) ?? "null") as { day?: string; missionId?: string; completed?: boolean } | null;
      const missionId = stored?.day === dayKey && dailyMissions.some(mission => mission.id === stored.missionId) ? stored.missionId! : dailyMissions[new Date().getDate() % dailyMissions.length].id;
      setDailyState({ day: dayKey, missionId, completed: stored?.day === dayKey && stored?.missionId === missionId ? Boolean(stored.completed) : false });
    } catch {
      setDailyState({ day: dayKey, missionId: dailyMissions[new Date().getDate() % dailyMissions.length].id, completed: false });
    }
  }, [dailyStorageKey, dayKey]);
  const dailyMission = dailyMissions.find(mission => mission.id === selectedMissionId) ?? dailyMissions[0];
  useEffect(() => {
    if (dailyTask.data) setDailyState({ day: dailyTask.data.taskDate, missionId: dailyTask.data.missionId, completed: dailyTask.data.completed });
  }, [dailyTask.data]);
  const dailyCompleted = dailyTask.data?.completed ?? dailyState?.completed ?? false;
  const assignedMissionTitle = assignedMission?.missionId.replaceAll("-", " ");
  const completeDailyTask = () => {
    if (dailyCompleted) return;
    if (canPersistDailyTask) {
      completeDailyTaskMutation.mutate(dailyInput);
      return;
    }
    const next = { day: dayKey, missionId: dailyMission.id, completed: true };
    setDailyState(next);
    window.localStorage.setItem(dailyStorageKey, JSON.stringify(next));
  };

  return (
    <section className="growth-dashboard" aria-labelledby="gelisim-baslik">
      <div className="growth-dashboard__intro">
        <div>
          <span className="eyebrow eyebrow--ink"><BrainCircuit size={14} /> Öğrenci gelişim panosu</span>
          <h2 id="gelisim-baslik">İzini gör, bir sonraki hamleni seç.</h2>
          <p>{isAuthenticated ? "Bugünkü çalışman hesabına kaydediliyor; küçük ilerlemeler zamanla güçlü bir rotaya dönüşür." : "Giriş yaptığında görevlerin, puanın ve rozetlerin hesabında kalır."}</p>
        </div>
        <div className="growth-dashboard__robi" aria-label="Robi gelişim rehberi">
          <RobiImage src={ROBI_IMAGE} alt="Robi, öğrencinin gelişim rehberi" loading="lazy" />
          <div><span>Robi'nin planı</span><strong>Bugün: {activeMissionTitle}</strong><small>Önce bir görevi sakinlikle tamamla.</small></div>
        </div>
      </div>

      <article className={`daily-task ${dailyCompleted ? "daily-task--done" : ""}`} aria-label="Bugünün görevi"><div><span className="growth-section-heading">bugünün görevi</span><h3>{dailyMission.title}</h3><p>{dailyMission.prompt}</p></div><div className="daily-task__action"><span>{dailyCompleted ? "Tamamlandı" : "1 küçük adım"}</span><button type="button" onClick={completeDailyTask} disabled={dailyCompleted || completeDailyTaskMutation.isPending}>{dailyCompleted ? <CheckCircle2 size={18} /> : completeDailyTaskMutation.isPending ? "Kaydediliyor…" : "Görevi tamamladım"}</button></div></article>

      {assignedMission && <article className="daily-task daily-task--assigned" aria-label="Öğretmen görevi"><div><span className="growth-section-heading">öğretmeninden görev</span><h3>{assignedMissionTitle}</h3><p>{assignedMission.note}</p></div><span className="daily-task__action">Başlamak için rota kartını aç.</span></article>}

      <section className="growth-practice" aria-labelledby="ritim-baslik"><div><span className="growth-section-heading">oyunlaştırılmış çalışma ritmi</span><h3 id="ritim-baslik">Her gün küçük bir iz bırak.</h3><p>Serini koru, ipucunu stratejik kullan ve süreli denemeye hazırlandığını hisset.</p></div><div className="growth-practice__stats"><strong>{streak} gün</strong><span>görev serisi</span><strong>{hintBudget}/3</strong><span>Robi ipucu bütçesi</span></div><div className="growth-practice__actions"><button type="button" onClick={spendHint} disabled={hintBudget === 0}>Bir ipucu kullan</button><a href="#deneme-ussu">Süreli antrenmana geç <ArrowUpRight size={15} /></a></div></section>

      <div className="growth-metrics" aria-label="Gelişim özeti">
        <article><span><Target size={16} /> Rota</span><strong>{completedCount} / 6</strong><small>%{routePercent} tamamlandı</small></article>
        <article><span><Flame size={16} /> Merak puanı</span><strong>{merakPuani}</strong><small>Her doğru iz +15 puan</small></article>
        <article><span><CheckCircle2 size={16} /> Ustalık</span><strong>{masteredSkills} / {skills.length}</strong><small>Beceri alanı</small></article>
      </div>

      <div className="growth-dashboard__lower">
        <div className="skill-map"><div className="growth-section-heading"><span>beceri haritası</span><small>{ageBand}. sınıf rotası</small></div>{skills.map(skill => { const done = skill.missionIds.filter(id => completedMissionIds.includes(id)).length; const percent = Math.round((done / skill.missionIds.length) * 100); return <div className="skill-row" key={skill.label}><div><b>{skill.label}</b><small>{done}/{skill.missionIds.length} görev</small></div><div className="skill-track" role="progressbar" aria-label={`${skill.label} ilerlemesi`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><i style={{ width: `${percent}%` }} /></div></div>; })}</div>
        <div className="growth-coach"><span className="growth-section-heading">3 adımlı çalışma planı</span><ol><li><b>Oku</b><small>Kodu satır satır takip et.</small></li><li><b>İşaretle</b><small>Değişen değeri kendi notunla bul.</small></li><li><b>Açıkla</b><small>Doğru cevaptan sonra kuralı bir cümleyle anlat.</small></li></ol><a href="#ana-gorev">Göreve dön <ArrowUpRight size={15} /></a></div>
      </div>
    </section>
  );
}
