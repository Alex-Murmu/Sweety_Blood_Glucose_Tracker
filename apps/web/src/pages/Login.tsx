import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";

export default function Login() {
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
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Log in</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p style={styles.link}>
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 400,
    margin: "60px auto",
    padding: 24,
    fontFamily: "system-ui, sans-serif",
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { padding: 8, fontSize: 14 },
  button: { padding: 10, fontSize: 14, cursor: "pointer" },
  error: { color: "red", fontSize: 14, marginBottom: 12 },
  link: { marginTop: 16, fontSize: 14, textAlign: "center" },
};
