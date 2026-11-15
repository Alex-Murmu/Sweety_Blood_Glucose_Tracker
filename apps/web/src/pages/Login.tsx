import { HeartPulse, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.js";
import { useAuth } from "../context/AuthContext.tsx";

export default function Login({ onSwitch }: { onSwitch?: () => void }) {
  const { signin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signin({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-landing-border bg-landing-panel text-landing-text">
      <CardHeader className="space-y-5">
        <div className="grid size-11 place-items-center rounded-xl bg-landing-accent text-landing-bg"><HeartPulse className="size-5" /></div>
        <div>
          <CardTitle className="text-3xl tracking-[-0.05em]">Welcome back</CardTitle>
          <p className="mt-2 text-sm text-landing-muted">Pick up your glucose story where you left off.</p>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Email" icon={<Mail className="size-4" />} type="email" value={email} onChange={setEmail} />
          <Field label="Password" icon={<LockKeyhole className="size-4" />} type="password" value={password} onChange={setPassword} />
          <Button type="submit" disabled={loading} className="h-11 w-full bg-landing-accent text-landing-bg hover:bg-landing-accent-strong">
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-landing-muted">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onSwitch} className="font-medium text-landing-accent underline-offset-4 hover:underline">Sign up</button>
        </p>
      </CardContent>
    </Card>
  );
}

function Field({ label, icon, type, value, onChange }: { label: string; icon: React.ReactNode; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">{icon}</span>
        <input type={type} required value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border border-landing-border bg-landing-bg pl-10 pr-3 text-landing-text outline-none ring-offset-landing-bg placeholder:text-landing-muted/60 focus:ring-2 focus:ring-landing-accent" />
      </span>
    </label>
  );
}
