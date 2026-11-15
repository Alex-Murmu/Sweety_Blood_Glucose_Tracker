import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ReportCard, { type Report } from "./ReportCard.js";

// Mock ReadingChart because Recharts ResponsiveContainer needs DOM measurements
vi.mock("./ReadingChart", () => ({
  default: () => <div data-testid="mock-reading-chart">Chart</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ReportCard", () => {
  it("renders report successfully when API returns a wrapped report object", async () => {
    const wrappedReport = {
      success: true,
      report: {
        type: "daily",
        date: "2026-11-16T00:00:00.000Z",
        readings: [
          { id: "1", date: "2026-11-16T08:00:00.000Z", slot: "MORNING", value: 95 },
          { id: "2", date: "2026-11-16T13:00:00.000Z", slot: "AFTER_LUNCH", value: 140 },
        ],
        highest: 140,
        lowest: 95,
        average: 117.5,
        count: 2,
      },
    };

    const fetchReport = vi.fn().mockResolvedValue(wrappedReport as unknown as Report);

    render(<ReportCard title="Daily" fetchReport={fetchReport} />);

    await waitFor(() => {
      expect(screen.getAllByText(/140\s*mg\/dl/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/95\s*mg\/dl/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("117.5 mg/dl")).toBeInTheDocument();
      expect(screen.getByText("Morning (fasting)")).toBeInTheDocument();
      expect(screen.getByText("After lunch")).toBeInTheDocument();
    });
  });

  it("shows friendly empty state when there are no readings", async () => {
    const emptyReport: Report = {
      type: "daily",
      date: "2026-11-16T00:00:00.000Z",
      readings: [],
      highest: null,
      lowest: null,
      average: null,
      count: 0,
    };

    const fetchReport = vi.fn().mockResolvedValue(emptyReport);

    render(<ReportCard title="Daily" fetchReport={fetchReport} />);

    expect(await screen.findByText("No readings in this period.")).toBeInTheDocument();
    expect(screen.getByText("Add a reading to start seeing your pattern.")).toBeInTheDocument();
  });

  it("shows error alert when fetch fails", async () => {
    const fetchReport = vi.fn().mockRejectedValue(new Error("Network timeout"));

    render(<ReportCard title="Daily" fetchReport={fetchReport} />);

    expect(await screen.findByText("Network timeout")).toBeInTheDocument();
  });
});
