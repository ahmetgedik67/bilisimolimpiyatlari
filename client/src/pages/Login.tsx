import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen grid place-items-center bg-[#f6f2e8] px-4 py-10 text-[#173d59]">
      <div className="w-full max-w-sm rounded-2xl border border-[#d9d1bd] bg-white p-7 shadow-sm">
        {localAccount ? (
          <>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-[#0d7e67]" size={18} />
              <div><p className="font-mono text-xs tracking-[0.14em] text-[#7d735e]">HESAP AÇIK</p><h1 className="mt-1 text-xl font-bold">{localAccount.username}</h1></div>
            </div>
            {localAccount.mustChangePassword && <p role="status" className="mt-5 rounded-xl bg-[#fff3cf] p-4 text-sm text-[#735d1c]">Bu geçici paroladır. Devam etmeden önce kendi parolanı belirle.</p>}
            <form onSubmit={submitPassword} autoComplete="off" className="mt-6 space-y-4">
              <div><Label htmlFor="currentPassword">Mevcut parola</Label><Input id="currentPassword" name="local-current-password" autoComplete="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></div>
              <div><Label htmlFor="newPassword">Yeni parola</Label><Input id="newPassword" name="local-new-password" autoComplete="new-password" type="password" minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></div>
              <Button className="w-full" disabled={changePassword.isPending}>{changePassword.isPending ? "Güncelleniyor…" : "Parolayı değiştir"}</Button>
            </form>
            <Button variant="ghost" className="mt-2 w-full" onClick={async () => { await logout(); window.location.assign("/giris?oturum=kapandi"); }}>Oturumu kapat</Button>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3"><KeyRound className="mt-1 text-[#0d7e67]" size={18} /><div><p className="font-mono text-xs tracking-[0.14em] text-[#7d735e]">ÖĞRETMEN · YÖNETİCİ</p><h1 className="mt-1 text-xl font-bold">Yönetici girişi</h1></div></div>
            <p className="mt-3 text-sm leading-6 text-[#6b6456]">Bu alan yalnız öğretmen ve yönetici hesapları içindir. Eğitim içeriklerine giriş yapmadan erişilebilir.</p>
            <form onSubmit={submitLogin} autoComplete="off" className="mt-6 space-y-4">
              <div><Label htmlFor="username">Kullanıcı adı</Label><Input id="username" name="local-login-identifier" autoComplete="off" autoCapitalize="none" spellCheck={false} value={username} onChange={e => setUsername(e.target.value)} placeholder="ornek.ogretmen" required /></div>
              <div><Label htmlFor="password">Parola</Label><Input id="password" name="local-login-secret" autoComplete="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              <Button className="w-full" disabled={login.isPending}>{login.isPending ? "Giriş yapılıyor…" : "Giriş yap"}</Button>
            </form>
          </>
        )}
        {notice && <p role="status" className="mt-4 rounded-xl bg-[#eef5f2] p-3 text-sm text-[#265f50]">{notice}</p>}
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6b6456] hover:text-[#173d59]"><ArrowLeft size={14} /> Siteye dön</Link>
      </div>
    </main>
  );
}
