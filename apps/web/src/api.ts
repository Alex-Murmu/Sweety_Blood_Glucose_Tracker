const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `Request failed (${res.status})`);
  }

  return res.json();
}

export const api = {
  signup: (data: { name: string; email: string; password: string; role?: "PATIENT" | "DOCTOR" }) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  getReadings: (date?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (date) params.set("date", date);
    return request(`/readings?${params.toString()}`);
  },
  createReading: (data: { date: string; slot: string; value: number }) =>
    request("/readings", { method: "POST", body: JSON.stringify(data) }),
  updateReading: (id: string, data: Partial<{ date: string; slot: string; value: number }>) =>
    request(`/readings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteReading: (id: string) => request(`/readings/${id}`, { method: "DELETE" }),

  dailyReport: (date?: string, patientId?: string) => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (patientId) params.set("patientId", patientId);
    return request(`/reports/daily?${params.toString()}`);
  },
  monthToDateReport: (date?: string, patientId?: string) => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (patientId) params.set("patientId", patientId);
    return request(`/reports/month-to-date?${params.toString()}`);
  },
  monthlyReport: (date?: string, patientId?: string) => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (patientId) params.set("patientId", patientId);
    return request(`/reports/monthly?${params.toString()}`);
  },
  doctorPatients: () => request("/doctors/patients"),
  assignPatient: (patientId: string) =>
    request("/doctors/patients", { method: "POST", body: JSON.stringify({ patientId }) }),
};
