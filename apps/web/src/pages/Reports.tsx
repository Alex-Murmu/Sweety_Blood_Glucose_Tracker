import {
  RiAlarmWarningLine,
  RiBarChartBoxLine,
  RiCheckDoubleLine,
  RiPlayCircleLine,
  RiTeamLine,
  RiUserAddLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api.ts";
import ReportCard, { type Report } from "../components/ReportCard.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { Input } from "../components/ui/input.tsx";
import { Select } from "../components/ui/select.tsx";
import { Label } from "../components/ui/label.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { toast } from "../components/ui/sonner.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const tabs = [
  { key: "daily", label: "Daily" },
  { key: "month-to-date", label: "Month to date" },
  { key: "monthly", label: "Previous month" },
];

interface ReminderSummary {
  checkedAt: string;
  totalPatients: number;
  remindedCount: number;
  patientsNeedingReadings: Array<{
    id: string;
    name: string;
    email: string;
    readingsCount: number;
    missingSlotsCount: number;
  }>;
}

export default function Reports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("daily");
  const [patients, setPatients] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [availableDirectory, setAvailableDirectory] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patientIdInput, setPatientIdInput] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [assigning, setAssigning] = useState(false);

  // BullMQ Reminder State
  const [reminderSummary, setReminderSummary] = useState<ReminderSummary | null>(null);
  const [runningReminder, setRunningReminder] = useState(false);
  const [showReminderPanel, setShowReminderPanel] = useState(false);

  useEffect(() => {
    if (user?.role !== "DOCTOR") return;

    // Load assigned patients
    api
      .doctorPatients()
      .then((data) => {
        setPatients(data.patients);
        setSelectedPatient(data.patients[0]?.id || "");
      })
      .catch((error) =>
        setAssignmentError(error instanceof Error ? error.message : "Failed to load patients")
      );

    // Load available directory
    api
      .doctorDirectory()
      .then((data) => setAvailableDirectory(data.patients || []))
      .catch(() => setAvailableDirectory([]));
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
    if (!patientIdInput.trim()) return;
    setAssignmentError("");
    setAssigning(true);
    try {
      const data = await api.assignPatient(patientIdInput.trim());
      setPatients((current) => [
        ...current.filter((patient) => patient.id !== data.patient.id),
        data.patient,
      ]);
      setSelectedPatient(data.patient.id);
      setPatientIdInput("");
      toast.success(`Assigned ${data.patient.name} (${data.patient.email})`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to assign patient";
      setAssignmentError(msg);
      toast.error(msg);
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassign(patientId: string) {
    if (!patientId) return;
    try {
      await api.unassignPatient(patientId);
      setPatients((current) => current.filter((p) => p.id !== patientId));
      setSelectedPatient((current) => (current === patientId ? "" : current));
      toast.success("Patient unassigned");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unassign patient");
    }
  }

  async function handleRunReminderCheck() {
    setRunningReminder(true);
    try {
      const result = await api.runReminders();
      setReminderSummary(result);
      setShowReminderPanel(true);
      toast.success(
        `Reminder check complete: ${result.remindedCount} of ${result.totalPatients} patients need readings.`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reminder check failed");
    } finally {
      setRunningReminder(false);
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
        <div className="space-y-4">
          <Card className="border-landing-border bg-landing-panel p-5 text-landing-text shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-64 flex-1 flex-col gap-2">
                <Label htmlFor="doctor-patient-select" className="flex items-center gap-2 text-sm text-landing-text">
                  <RiTeamLine className="size-4 text-landing-accent" />
                  <span>Assigned patient ({patients.length})</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Select
                    id="doctor-patient-select"
                    value={selectedPatient}
                    onChange={(event) => setSelectedPatient(event.target.value)}
                    className="flex-1"
                  >
                    <option value="">Select an assigned patient to view reports</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.email})
                      </option>
                    ))}
                  </Select>
                  {selectedPatient && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(selectedPatient)}
                      title="Unassign this patient"
                      className="gap-1 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                    >
                      <RiUserUnfollowLine className="size-4" />
                      <span>Unassign</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Assign Form (Accepts either Email or ID) */}
              <form onSubmit={handleAssign} className="flex flex-1 gap-2 lg:max-w-md">
                <Input
                  value={patientIdInput}
                  onChange={(event) => setPatientIdInput(event.target.value)}
                  placeholder="Patient email or ID (e.g. demo@sweety.local)"
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={assigning} variant="outline" className="gap-2">
                  <RiUserAddLine className="size-4" />
                  <span>{assigning ? "Assigning…" : "Assign"}</span>
                </Button>
              </form>

              {/* BullMQ Daily Reminder Trigger Button */}
              <Button
                type="button"
                variant="secondary"
                onClick={handleRunReminderCheck}
                disabled={runningReminder}
                className="gap-2 shrink-0 border border-landing-border"
              >
                <RiPlayCircleLine className="size-4 text-landing-accent" />
                <span>{runningReminder ? "Running reminders…" : "Check Daily Reminders (BullMQ)"}</span>
              </Button>
            </div>

            {/* Quick-assign directory helper if there are registered unassigned patients */}
            {availableDirectory.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-landing-border/60 text-xs text-landing-muted">
                <span className="font-medium text-landing-text">Quick assign:</span>
                {availableDirectory
                  .filter((p) => !patients.some((assigned) => assigned.id === p.id))
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPatientIdInput(p.email);
                      }}
                      className="rounded-md border border-landing-border bg-landing-panel-strong px-2 py-1 text-landing-muted hover:text-landing-text hover:border-landing-accent/40 cursor-pointer"
                    >
                      + {p.name} ({p.email})
                    </button>
                  ))}
              </div>
            )}

            {assignmentError && <p className="mt-3 text-sm text-red-300">{assignmentError}</p>}
          </Card>

          {/* BullMQ Daily Reminder Panel */}
          {showReminderPanel && reminderSummary && (
            <Card className="border-landing-border bg-landing-panel p-5 text-landing-text shadow-sm">
              <div className="flex items-center justify-between border-b border-landing-border pb-3">
                <div className="flex items-center gap-2">
                  <RiAlarmWarningLine className="size-5 text-amber-400" />
                  <h3 className="font-semibold text-sm">
                    BullMQ Daily Reading Reminders Status
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {reminderSummary.remindedCount} / {reminderSummary.totalPatients} need readings
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReminderPanel(false)}
                    className="text-xs text-landing-muted hover:text-landing-text h-7 px-2"
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                {reminderSummary.patientsNeedingReadings.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-landing-accent py-2">
                    <RiCheckDoubleLine className="size-4" />
                    <span>All patients have logged all 4 readings today!</span>
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-landing-muted">
                      Patients with fewer than 4 readings today (logged to background worker console):
                    </p>
                    <div className="divide-y divide-landing-border rounded-lg border border-landing-border bg-landing-bg/40 overflow-hidden">
                      {reminderSummary.patientsNeedingReadings.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-landing-panel/50"
                        >
                          <div>
                            <span className="font-medium text-landing-text">{p.name}</span>
                            <span className="ml-2 text-landing-muted">({p.email})</span>
                          </div>
                          <Badge variant="secondary" className="text-[11px]">
                            {p.readingsCount} / 4 logged ({p.missingSlotsCount} missing)
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
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
