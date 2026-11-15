import { ClipboardPlus, FileChartColumn, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api.ts";
import ReportCard, { type Report } from "../components/ReportCard.tsx";
import { Button } from "../components/ui/button.js";
import { Card } from "../components/ui/card.js";
import { useAuth } from "../context/AuthContext.tsx";

const tabs = [
  { key: "daily", label: "Daily" },
  { key: "month-to-date", label: "Month to date" },
  { key: "monthly", label: "Previous month" },
];

export default function Reports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("daily");
  const [patients, setPatients] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patientIdInput, setPatientIdInput] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  useEffect(() => {
    if (user?.role !== "DOCTOR") return;
    api.doctorPatients().then((data) => {
      setPatients(data.patients);
      setSelectedPatient(data.patients[0]?.id || "");
    }).catch((error) => setAssignmentError(error instanceof Error ? error.message : "Failed to load patients"));
  }, [user]);

  const fetchers = useMemo<Record<string, (date: string) => Promise<Report>>>(() => ({
    daily: (date) => api.dailyReport(date, selectedPatient || undefined),
    "month-to-date": (date) => api.monthToDateReport(date, selectedPatient || undefined),
    monthly: (date) => api.monthlyReport(date, selectedPatient || undefined),
  }), [selectedPatient]);

  async function handleAssign(event: React.FormEvent) {
    event.preventDefault();
    setAssignmentError("");
    try {
      const data = await api.assignPatient(patientIdInput);
      setPatients((current) => [...current.filter((patient) => patient.id !== data.patient.id), data.patient]);
      setSelectedPatient(data.patient.id);
      setPatientIdInput("");
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : "Failed to assign patient");
    }
  }

  return (
    <section className="mt-24 space-y-8 border-t border-landing-border pt-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm text-landing-accent"><FileChartColumn className="size-4" /> Your patterns</div>
          <h2 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Reports that tell the story.</h2>
          <p className="mt-3 max-w-xl text-base text-landing-muted">Move from a single number to a view you can use.</p>
        </div>
      </div>

      {user?.role === "DOCTOR" && (
        <Card className="border-landing-border bg-landing-panel p-5 text-landing-text">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <label className="flex min-w-64 flex-col gap-2 text-xs font-medium text-landing-muted">
              <span className="flex items-center gap-2 text-sm text-landing-text"><UsersRound className="size-4 text-landing-accent" /> Assigned patient</span>
              <select value={selectedPatient} onChange={(event) => setSelectedPatient(event.target.value)} className="h-10 rounded-md border border-landing-border bg-landing-bg px-3 text-sm text-landing-text outline-none focus:ring-2 focus:ring-landing-accent">
                <option value="">Select an assigned patient</option>
                {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} ({patient.email})</option>)}
              </select>
            </label>
            <form onSubmit={handleAssign} className="flex flex-1 gap-2 lg:max-w-md">
              <input value={patientIdInput} onChange={(event) => setPatientIdInput(event.target.value)} placeholder="Patient ID to assign" required className="h-10 min-w-0 flex-1 rounded-md border border-landing-border bg-landing-bg px-3 text-sm text-landing-text outline-none placeholder:text-landing-muted/60 focus:ring-2 focus:ring-landing-accent" />
              <Button type="submit" variant="outline" className="h-10 border-landing-border bg-transparent text-landing-text hover:bg-landing-panel-strong"><ClipboardPlus className="mr-2 size-4" /> Assign</Button>
            </form>
          </div>
          {assignmentError && <p className="mt-3 text-sm text-red-300">{assignmentError}</p>}
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => <Button key={tab.key} variant={activeTab === tab.key ? "default" : "outline"} className={activeTab === tab.key ? "bg-landing-accent text-landing-bg hover:bg-landing-accent-strong" : "border-landing-border bg-transparent text-landing-muted hover:bg-landing-panel hover:text-landing-text"} onClick={() => setActiveTab(tab.key)}>{tab.label}</Button>)}
      </div>
      <ReportCard title={tabs.find((tab) => tab.key === activeTab)?.label || "Report"} fetchReport={fetchers[activeTab]} />
    </section>
  );
}
