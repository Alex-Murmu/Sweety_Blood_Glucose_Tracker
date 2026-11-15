import { RiLockPasswordLine, RiMailLine, RiUser3Line } from "react-icons/ri";
import { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Label } from "../components/ui/label.tsx";
import { Input } from "../components/ui/input.tsx";
import { Select } from "../components/ui/select.tsx";
import SweetyLogo from "../components/SweetyLogo.tsx";
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
    <Card className="w-full max-w-md border-landing-border bg-landing-panel text-landing-text shadow-xl">
      <CardHeader className="space-y-4">
        <SweetyLogo size="md" />
        <div>
          <CardTitle className="text-3xl tracking-[-0.05em]">Create your account</CardTitle>
          <CardDescription className="mt-1.5">
            A calmer home for your daily glucose rhythm.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Full name</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">
                <RiUser3Line className="size-4" />
              </span>
              <Input
                id="register-name"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">
                <RiMailLine className="size-4" />
              </span>
              <Input
                id="register-email"
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-role">Account type</Label>
            <Select
              id="register-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "PATIENT" | "DOCTOR")}
            >
              <option value="PATIENT">Patient (Track personal readings)</option>
              <option value="DOCTOR">Doctor (View assigned patients)</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password (at least 6 characters)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">
                <RiLockPasswordLine className="size-4" />
              </span>
              <Input
                id="register-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="h-11 w-full mt-2">
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-landing-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-landing-accent underline-offset-4 hover:underline cursor-pointer"
          >
            Log in
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
