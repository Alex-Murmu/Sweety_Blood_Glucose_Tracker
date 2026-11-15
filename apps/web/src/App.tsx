import { useState } from "react";
import { HeartPulse, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Readings from "./pages/Readings.tsx";
import Reports from "./pages/Reports.tsx";
import { Button } from "./components/ui/button.js";
import Landing from "./pages/Landing.tsx";

function AppWithAuth() {
  const { user, loading, signout } = useAuth();
  const [authView, setAuthView] = useState<"login" | "register" | null>(null);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-landing-bg text-landing-muted">Loading…</div>
    );
  }

  if (!user) {
    if (!authView) {
      return <Landing onGetStarted={() => setAuthView("register")} onLogin={() => setAuthView("login")} />;
    }
    return (
      <div className="min-h-screen bg-landing-bg px-6 py-12 text-landing-text">
        <button className="mx-auto mb-8 block text-sm text-landing-muted underline-offset-4 hover:underline" onClick={() => setAuthView(null)}>
          ← Back to Sweety
        </button>
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8">
          {authView === "login" ? <Login onSwitch={() => setAuthView("register")} /> : <Register onSwitch={() => setAuthView("login")} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <nav className="border-b border-landing-border bg-landing-bg/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-landing-accent text-landing-bg"><HeartPulse className="size-4" /></span>
          <span>Sweety</span>
        </div>
        <div className="hidden items-center gap-2 text-sm text-landing-muted md:flex">
          <span className="rounded-full bg-landing-panel px-3 py-1.5"><LayoutDashboard className="mr-2 inline size-3.5" />Dashboard</span>
          <span className="rounded-full px-3 py-1.5"><UserRound className="mr-2 inline size-3.5" />{user.name}</span>
        </div>
        <Button onClick={signout} variant="outline" size="sm" className="border-landing-border bg-transparent text-landing-text hover:bg-landing-panel">
          <LogOut className="mr-2 size-3.5" /> Log out
        </Button>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <Readings />
        <Reports />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}
