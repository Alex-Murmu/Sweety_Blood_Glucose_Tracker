import { useState } from "react";
import { RiDashboardLine, RiLogoutBoxRLine, RiUser3Line } from "react-icons/ri";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Readings from "./pages/Readings.tsx";
import Reports from "./pages/Reports.tsx";
import { Button } from "./components/ui/button.tsx";
import { Badge } from "./components/ui/badge.tsx";
import SweetyLogo from "./components/SweetyLogo.tsx";
import Landing from "./pages/Landing.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

function AppWithAuth() {
  const { user, loading, signout } = useAuth();
  const [authView, setAuthView] = useState<"login" | "register" | null>(null);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-landing-bg text-landing-muted">
        <div className="flex flex-col items-center gap-3">
          <SweetyLogo size="md" />
          <p className="animate-pulse text-sm text-landing-muted">Connecting to your rhythm…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!authView) {
      return (
        <Landing
          onGetStarted={() => setAuthView("register")}
          onLogin={() => setAuthView("login")}
        />
      );
    }
    return (
      <div className="min-h-screen bg-landing-bg px-6 py-12 text-landing-text">
        <button
          className="mx-auto mb-8 block text-sm text-landing-muted underline-offset-4 hover:underline cursor-pointer"
          onClick={() => setAuthView(null)}
        >
          ← Back to Sweety
        </button>
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8">
          {authView === "login" ? (
            <Login onSwitch={() => setAuthView("register")} />
          ) : (
            <Register onSwitch={() => setAuthView("login")} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <nav className="border-b border-landing-border bg-landing-bg/95 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <SweetyLogo size="sm" />
          <div className="hidden items-center gap-2 text-sm text-landing-muted md:flex">
            <span className="flex items-center gap-1.5 rounded-full bg-landing-panel px-3 py-1 text-xs">
              <RiDashboardLine className="size-3.5 text-landing-accent" />
              <span>Dashboard</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-landing-text">
              <RiUser3Line className="size-3.5 text-landing-muted" />
              <span>{user.name}</span>
            </span>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {user.role}
            </Badge>
          </div>
          <Button onClick={signout} variant="outline" size="sm" className="gap-2">
            <RiLogoutBoxRLine className="size-3.5" />
            <span>Log out</span>
          </Button>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 space-y-16">
        <ErrorBoundary fallbackMessage="Unable to load daily readings.">
          <Readings />
        </ErrorBoundary>
        <ErrorBoundary fallbackMessage="Unable to load reports.">
          <Reports />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallbackMessage="An unexpected error occurred in Sweety.">
      <AuthProvider>
        <AppWithAuth />
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}
