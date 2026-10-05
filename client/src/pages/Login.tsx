import { Button } from "@/components/ui/button";
import { ROBI_IMAGE, robiMessages } from "@/lib/robiGuide";
import { RobiImage } from "@/components/RobiImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Award, KeyRound, ShieldCheck } from "lucide-react";
import { AVATAR_OPTIONS, getAvatar } from "@shared/avatars";
import { BILFEN_CAMPUSES, STUDENT_TRACK_LABELS } from "@shared/campuses";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function Login() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notice, setNotice] = useState("");
  const status = trpc.account.status.useQuery(undefined, { enabled: Boolean(user) });
  const isStudentAccount = status.data?.role === "student";
  const profileQuery = trpc.learning.profile.useQuery(undefined, { enabled: isStudentAccount });
  const login = trpc.account.login.useMutation({
    onSuccess: result => setLocation(result.account.role === "teacher" ? "/ogretmen" : "/"),
    onError: error => setNotice(error.message),
  });
  const setAvatar = trpc.learning.setAvatar.useMutation({
    onSuccess: () => {
      setNotice("Avatarın güncellendi.");
      void profileQuery.refetch();
    },
    onError: error => setNotice(error.message),
  });
  const changePassword = trpc.account.changePassword.useMutation({
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setNotice("Parolan güncellendi.");
      void status.refetch();
    },
    onError: error => setNotice(error.message),
  });

  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    setNotice("");
    login.mutate({ username, password });
  };
  const submitPassword = (event: FormEvent) => {
    event.preventDefault();
    setNotice("");
    changePassword.mutate({ currentPassword, newPassword });
  };

  if (loading || (user && status.isLoading)) {
    return <main className="min-h-screen grid place-items-center bg-[#f6f2e8] text-[#173d59]">Hesap durumu hazırlanıyor…</main>;
  }

  const localAccount = status.data;
  return (
    <main className="min-h-screen bg-[#f6f2e8] px-4 py-10 text-[#173d59]">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.05fr]">
        <section className="rounded-[2rem] bg-[#0d4d64] p-8 text-white shadow-xl sm:p-12">
          <p className="mb-5 font-mono text-xs tracking-[0.16em] text-[#f1d36b]">BİLFEN · ALGORİTMA ATLASI</p>
          <h1 className="font-serif text-5xl leading-[0.92] sm:text-6xl">Rotana<br />güvenle dön.</h1>
          <p className="mt-7 max-w-md leading-7 text-white/80">Öğrenciler kullanıcı adı ve parolayla ilerlemelerini kaydeder. Öğretmenler sınıf hesaplarını ve rota ilerlemelerini tek yerden yönetir.</p>
          <Link href="/" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#f1d36b]"><ArrowLeft size={16} /> Atlas rotasına dön</Link>
          <aside className="mt-10 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4" aria-label="Robi hesap rehberi"><RobiImage src={ROBI_IMAGE} alt="Robi, Bilfen Algoritma Atlası ders rehberi" className="h-16 w-16 object-contain" loading="eager" /><div><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#f1d36b]">{robiMessages.hero.label}</span><strong className="mt-1 block text-sm">{robiMessages.hero.title}</strong><p className="mt-1 text-xs leading-5 text-white/70">{robiMessages.hero.body}</p></div></aside>
        </section>

        <section className="rounded-[2rem] border border-[#d9d1bd] bg-white p-7 shadow-sm sm:p-10">
          {localAccount ? (
            <>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 text-[#0d7e67]" />
                <div><p className="font-mono text-xs tracking-[0.14em] text-[#7d735e]">HESAP AÇIK</p><h2 className="mt-1 text-2xl font-bold">{localAccount.username}</h2></div>
              </div>
              {localAccount.role === "student" && profileQuery.data?.studentGroup && <section className="profile-campus-card" aria-label="Öğrenci kampüs ve grup bilgileri"><div><p className="profile-kicker">BİLFEN ÖĞRENCİ GRUBU</p><h3>{BILFEN_CAMPUSES.find(campus => campus.key === profileQuery.data.studentGroup.campusKey)?.name ?? profileQuery.data.studentGroup.campusKey}</h3></div><div className="profile-campus-card__meta"><span>{profileQuery.data.studentGroup.gradeLevel}. sınıf</span><span>{STUDENT_TRACK_LABELS[profileQuery.data.studentGroup.track]}</span></div></section>}
              {localAccount.role === "student" && (
                <section className="profile-avatar-picker" aria-labelledby="avatar-baslik">
                  <div className="profile-avatar-picker__heading"><div><p className="profile-kicker">PROFİL İŞARETİN</p><h3 id="avatar-baslik">Kendine bir avatar seç</h3></div><span className="profile-avatar-preview" style={{ backgroundColor: `${getAvatar(profileQuery.data?.profile.avatarKey).tone}18`, color: getAvatar(profileQuery.data?.profile.avatarKey).tone }} role="img" aria-label={`Seçili avatar: ${getAvatar(profileQuery.data?.profile.avatarKey).label}`}>{getAvatar(profileQuery.data?.profile.avatarKey).symbol}</span></div>
                  <p className="profile-avatar-picker__copy">Bu işaret ana sayfadaki İlk 20 sıralamasında adının yanında görünür.</p>
                  <div className="profile-avatar-grid" role="group" aria-label="Avatar seçenekleri">
                    {AVATAR_OPTIONS.map(avatar => <button key={avatar.key} type="button" className={`profile-avatar-option ${profileQuery.data?.profile.avatarKey === avatar.key ? "is-selected" : ""}`} onClick={() => setAvatar.mutate({ avatarKey: avatar.key })} aria-pressed={profileQuery.data?.profile.avatarKey === avatar.key} aria-label={`${avatar.label} avatarını seç`} style={{ backgroundColor: `${avatar.tone}14`, color: avatar.tone }} disabled={setAvatar.isPending}><span aria-hidden="true">{avatar.symbol}</span><small>{avatar.label}</small></button>)}
                  </div>
                </section>
              )}
              {profileQuery.data?.scienceProgress && <section className="profile-science-progress" aria-labelledby="science-progress-title"><div className="profile-science-progress__header"><div><p className="profile-kicker">BİLİM VE ZEKÂ USTASI</p><h3 id="science-progress-title">Rozete giden iz</h3></div><strong>{profileQuery.data.scienceProgress.correctCount}/{profileQuery.data.scienceProgress.total}</strong></div><div className="profile-science-progress__track" role="progressbar" aria-label="Bilim ve Zekâ rozeti ilerlemesi" aria-valuemin={0} aria-valuemax={20} aria-valuenow={profileQuery.data.scienceProgress.correctCount}><i style={{ width: `${Math.min(100, profileQuery.data.scienceProgress.correctCount / 20 * 100)}%` }} /></div><p>{profileQuery.data.scienceProgress.remaining > 0 ? `Rozet için ${profileQuery.data.scienceProgress.remaining} doğru cevap daha gerekiyor.` : "Rozeti kazandın; bu başarı profilinde sergileniyor."}</p></section>}
              {profileQuery.data?.badges?.some(badge => badge.badgeKey === "bilim-zeka-ustasi") && <section className="profile-science-badge" aria-label="Bilim ve Zekâ Ustası rozeti"><Award size={22} /><div><p className="profile-kicker">ÖZEL BAŞARI ROZETİ</p><h3>Bilim ve Zekâ Ustası</h3><span>20 sorunun tamamını doğru izlerle tamamladın.</span></div></section>}
              {localAccount.mustChangePassword && <p role="status" className="mt-6 rounded-xl bg-[#fff3cf] p-4 text-sm text-[#735d1c]">Bu geçici paroladır. Devam etmeden önce kendi parolanı belirle.</p>}
              <form onSubmit={submitPassword} autoComplete="off" className="mt-7 space-y-5">
                <div><Label htmlFor="currentPassword">Mevcut parola</Label><Input id="currentPassword" name="local-current-password" autoComplete="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></div>
                <div><Label htmlFor="newPassword">Yeni parola</Label><Input id="newPassword" name="local-new-password" autoComplete="new-password" type="password" minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></div>
                <Button className="w-full" disabled={changePassword.isPending}>{changePassword.isPending ? "Güncelleniyor…" : "Parolayı değiştir"}</Button>
              </form>
              {localAccount.role === "teacher" && <Button variant="outline" className="mt-4 w-full" onClick={() => setLocation("/ogretmen")}>Öğretmen paneline git</Button>}
              <Button variant="ghost" className="mt-2 w-full" onClick={async () => { await logout(); window.location.assign("/giris?oturum=kapandi"); }}>Oturumu kapat</Button>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3"><KeyRound className="mt-1 text-[#0d7e67]" /><div><p className="font-mono text-xs tracking-[0.14em] text-[#7d735e]">ÖĞRENCİ · ÖĞRETMEN</p><h2 className="mt-1 text-2xl font-bold">Kullanıcı adıyla giriş</h2></div></div>
              <form onSubmit={submitLogin} autoComplete="off" className="mt-7 space-y-5">
                <div><Label htmlFor="username">Kullanıcı adı</Label><Input id="username" name="local-login-identifier" autoComplete="off" autoCapitalize="none" spellCheck={false} value={username} onChange={e => setUsername(e.target.value)} placeholder="ornek.ogrenci" required /></div>
                <div><Label htmlFor="password">Parola</Label><Input id="password" name="local-login-secret" autoComplete="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <Button className="w-full" disabled={login.isPending}>{login.isPending ? "Giriş yapılıyor…" : "Giriş yap"}</Button>
              </form>
              <div className="my-7 h-px bg-[#e7e1d4]" />
              <p className="text-sm leading-6 text-[#6b6456]">İlk öğretmen hesabını platform yöneticisi oluşturur. Yönetici hesabınız varsa Manus ile giriş yapın.</p>
              <Button type="button" variant="outline" className="mt-4 w-full" onClick={startLogin}>Yönetici girişi</Button>
            </>
          )}
          {notice && <p role="status" className="mt-5 rounded-xl bg-[#eef5f2] p-3 text-sm text-[#265f50]">{notice}</p>}
        </section>
      </div>
    </main>
  );
}
