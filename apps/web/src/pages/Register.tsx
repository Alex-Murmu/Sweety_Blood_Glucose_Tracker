import { HeartPulse, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.js";
import { useAuth } from "../context/AuthContext.tsx";

export default function Register({ onSwitch }: { onSwitch?: () => void }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ name, email, password, role });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-landing-border bg-landing-panel text-landing-text">
      <CardHeader className="space-y-5">
        <div className="grid size-11 place-items-center rounded-xl bg-landing-accent text-landing-bg"><HeartPulse className="size-5" /></div>
        <div>
          <CardTitle className="text-3xl tracking-[-0.05em]">Create your account</CardTitle>
          <p className="mt-2 text-sm text-landing-muted">A calmer home for your daily glucose routine.</p>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Name" icon={<UserRound className="size-4" />} value={name} onChange={setName} />
          <Field label="Email" icon={<Mail className="size-4" />} type="email" value={email} onChange={setEmail} />
          <label className="block space-y-2 text-sm font-medium">
            <span>Account type</span>
            <select value={role} onChange={(event) => setRole(event.target.value as "PATIENT" | "DOCTOR")} className="h-11 w-full rounded-md border border-landing-border bg-landing-bg px-3 text-landing-text outline-none focus:ring-2 focus:ring-landing-accent">
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </label>
          <Field label="Password" icon={<LockKeyhole className="size-4" />} type="password" value={password} onChange={setPassword} />
          <Button type="submit" disabled={loading} className="h-11 w-full bg-landing-accent text-landing-bg hover:bg-landing-accent-strong">
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-landing-muted">
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} className="font-medium text-landing-accent underline-offset-4 hover:underline">Log in</button>
        </p>
      </CardContent>
    </Card>
  );
}

function Field({ label, icon, type = "text", value, onChange }: { label: string; icon: React.ReactNode; type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">{icon}</span>
        <input type={type} required minLength={type === "password" ? 6 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border border-landing-border bg-landing-bg pl-10 pr-3 text-landing-text outline-none focus:ring-2 focus:ring-landing-accent" />
      </span>
    </label>
  );
}
