import { RiLockPasswordLine, RiMailLine } from "react-icons/ri";
import { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Label } from "../components/ui/label.tsx";
import { Input } from "../components/ui/input.tsx";
import SweetyLogo from "../components/SweetyLogo.tsx";
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
    <Card className="w-full max-w-md border-landing-border bg-landing-panel text-landing-text shadow-xl">
      <CardHeader className="space-y-4">
        <SweetyLogo size="md" />
        <div>
          <CardTitle className="text-3xl tracking-[-0.05em]">Welcome back</CardTitle>
          <CardDescription className="mt-1.5">
            Pick up your glucose rhythm where you left off.
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
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">
                <RiMailLine className="size-4" />
              </span>
              <Input
                id="login-email"
                type="email"
                required
                placeholder="demo@sweety.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-landing-muted">
                <RiLockPasswordLine className="size-4" />
              </span>
              <Input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="h-11 rounded-full w-full mt-2">
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-landing-muted">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-landing-accent underline-offset-4 hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
