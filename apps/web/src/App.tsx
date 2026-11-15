import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Readings from "./pages/Readings.tsx";
import Reports from "./pages/Reports.tsx";

function AppWithAuth() {
  const { user, loading, signout } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", gap: 24, justifyContent: "center", padding: 60, fontFamily: "system-ui, sans-serif" }}>
        <Login />
        <Register />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav style={styles.nav}>
        <span style={styles.user}>{user.name}</span>
        <button onClick={signout} style={styles.logoutBtn}>Log out</button>
      </nav>
      <main>
        <Readings />
        <Reports />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: 24,
  },
  user: { fontSize: 14, color: "#64748b" },
  logoutBtn: {
    padding: "6px 12px",
    fontSize: 14,
    cursor: "pointer",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 4,
  },
};

export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}
