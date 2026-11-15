import { RiBarChartBoxLine, RiTeamLine, RiUserAddLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api.ts";
import ReportCard, { type Report } from "../components/ReportCard.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { Input } from "../components/ui/input.tsx";
import { Select } from "../components/ui/select.tsx";
import { Label } from "../components/ui/label.tsx";
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
    api
      .doctorPatients()
      .then((data) => {
        setPatients(data.patients);
        setSelectedPatient(data.patients[0]?.id || "");
      })
      .catch((error) =>
        setAssignmentError(error instanceof Error ? error.message : "Failed to load patients")
      );
  }, [user]);

  const fetchers = useMemo<Record<string, (date: string) => Promise<Report>>>(
    () => ({
      daily: (date) => api.dailyReport(date, selectedPatient || undefined),
      "month-to-date": (date) => api.monthToDateReport(date, selectedPatient || undefined),
      monthly: (date) => api.monthlyReport(date, selectedPatient || undefined),
    }),
    [selectedPatient]
  );

  async function handleAssign(event: React.FormEvent) {
    event.preventDefault();
    setAssignmentError("");
    try {
      const data = await api.assignPatient(patientIdInput);
      setPatients((current) => [
        ...current.filter((patient) => patient.id !== data.patient.id),
        data.patient,
      ]);
      setSelectedPatient(data.patient.id);
      setPatientIdInput("");
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : "Failed to assign patient");
    }
  }

  return (
    <section className="space-y-8 border-t border-landing-border pt-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm text-landing-accent font-medium">
            <RiBarChartBoxLine className="size-4" />
            <span>Your patterns</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl text-landing-text">
            Reports that tell the story.
          </h2>
          <p className="mt-3 max-w-xl text-base text-landing-muted">
            Move from a single number to a view you can use: daily moments, month-to-date trends, and full previous-month patterns.
          </p>
        </div>
      </div>

      {user?.role === "DOCTOR" && (
        <Card className="border-landing-border bg-landing-panel p-5 text-landing-text">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-64 flex-col gap-2">
              <Label htmlFor="doctor-patient-select" className="flex items-center gap-2 text-sm text-landing-text">
                <RiTeamLine className="size-4 text-landing-accent" />
                <span>Assigned patient</span>
              </Label>
              <Select
                id="doctor-patient-select"
                value={selectedPatient}
                onChange={(event) => setSelectedPatient(event.target.value)}
              >
                <option value="">Select an assigned patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.email})
                  </option>
                ))}
              </Select>
            </div>
            <form onSubmit={handleAssign} className="flex flex-1 gap-2 lg:max-w-md">
              <Input
                value={patientIdInput}
                onChange={(event) => setPatientIdInput(event.target.value)}
                placeholder="Patient ID to assign"
                required
                className="flex-1"
              />
              <Button type="submit" variant="outline" className="gap-2">
                <RiUserAddLine className="size-4" />
                <span>Assign</span>
              </Button>
            </form>
          </div>
          {assignmentError && <p className="mt-3 text-sm text-red-300">{assignmentError}</p>}
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <ReportCard
        title={tabs.find((tab) => tab.key === activeTab)?.label || "Report"}
        fetchReport={fetchers[activeTab]}
      />
    </section>
  );
}
