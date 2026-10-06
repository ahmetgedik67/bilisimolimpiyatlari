import { Button } from "@/components/ui/button";
import { ROBI_IMAGE, robiMessages } from "@/lib/robiGuide";
import { RobiImage } from "@/components/RobiImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
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
  const login = trpc.account.login.useMutation({
    onSuccess: () => setLocation("/"),
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
          <p className="mt-7 max-w-md leading-7 text-white/80">Bu alan yalnız öğretmen ve yönetici hesapları içindir. Öğrenciler ve tüm ziyaretçiler eğitim içeriklerine giriş yapmadan erişebilir.</p>
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
              {localAccount.mustChangePassword && <p role="status" className="mt-6 rounded-xl bg-[#fff3cf] p-4 text-sm text-[#735d1c]">Bu geçici paroladır. Devam etmeden önce kendi parolanı belirle.</p>}
              <form onSubmit={submitPassword} autoComplete="off" className="mt-7 space-y-5">
                <div><Label htmlFor="currentPassword">Mevcut parola</Label><Input id="currentPassword" name="local-current-password" autoComplete="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></div>
                <div><Label htmlFor="newPassword">Yeni parola</Label><Input id="newPassword" name="local-new-password" autoComplete="new-password" type="password" minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></div>
                <Button className="w-full" disabled={changePassword.isPending}>{changePassword.isPending ? "Güncelleniyor…" : "Parolayı değiştir"}</Button>
              </form>
              <Button variant="ghost" className="mt-2 w-full" onClick={async () => { await logout(); window.location.assign("/giris?oturum=kapandi"); }}>Oturumu kapat</Button>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3"><KeyRound className="mt-1 text-[#0d7e67]" /><div><p className="font-mono text-xs tracking-[0.14em] text-[#7d735e]">ÖĞRETMEN · YÖNETİCİ</p><h2 className="mt-1 text-2xl font-bold">Kullanıcı adıyla giriş</h2></div></div>
              <form onSubmit={submitLogin} autoComplete="off" className="mt-7 space-y-5">
                <div><Label htmlFor="username">Kullanıcı adı</Label><Input id="username" name="local-login-identifier" autoComplete="off" autoCapitalize="none" spellCheck={false} value={username} onChange={e => setUsername(e.target.value)} placeholder="ornek.ogretmen" required /></div>
                <div><Label htmlFor="password">Parola</Label><Input id="password" name="local-login-secret" autoComplete="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <Button className="w-full" disabled={login.isPending}>{login.isPending ? "Giriş yapılıyor…" : "Giriş yap"}</Button>
              </form>
              <div className="my-7 h-px bg-[#e7e1d4]" />
              <p className="text-sm leading-6 text-[#6b6456]">Öğrenci girişi bulunmamaktadır; eğitim içeriklerine giriş yapmadan erişilebilir. Hesap oluşturma ve parola sıfırlama işlemleri Bilfen Bilişim Teknolojileri yöneticisi tarafından yapılır.</p>
            </>
          )}
          {notice && <p role="status" className="mt-5 rounded-xl bg-[#eef5f2] p-3 text-sm text-[#265f50]">{notice}</p>}
        </section>
      </div>
    </main>
  );
}
