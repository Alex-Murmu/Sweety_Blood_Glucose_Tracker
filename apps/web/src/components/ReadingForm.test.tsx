import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ReadingForm from "./ReadingForm.js";
import { api } from "../api.js";

vi.mock("../api", () => ({
  api: {
    createReading: vi.fn(),
    updateReading: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ReadingForm", () => {
  it("shows the required-value validation message", async () => {
    render(<ReadingForm onSuccess={vi.fn()} />);
    fireEvent.submit(screen.getByRole("button", { name: "Add" }).closest("form")!);
    expect(await screen.findByText("Please enter a glucose value.")).toBeInTheDocument();
    expect(api.createReading).not.toHaveBeenCalled();
  });

  it("submits a valid reading", async () => {
    vi.mocked(api.createReading).mockResolvedValue({ success: true });
    const onSuccess = vi.fn();
    render(<ReadingForm onSuccess={onSuccess} initialDate="2026-11-15" />);
    fireEvent.change(screen.getByLabelText("Value (mg/dl)"), { target: { value: "120" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(() => expect(api.createReading).toHaveBeenCalledWith({
      date: "2026-11-15T00:00:00.000Z",
      slot: "MORNING",
      value: 120,
    }));
    expect(onSuccess).toHaveBeenCalledWith("2026-11-15");
  });

  it("submits an updated reading when in edit mode", async () => {
    vi.mocked(api.updateReading).mockResolvedValue({ success: true });
    const onSuccess = vi.fn();
    render(
      <ReadingForm
        onSuccess={onSuccess}
        editingId="reading-123"
        initialDate="2026-11-15"
        initialSlot="AFTER_LUNCH"
        initialValue={135}
      />
    );
    expect(screen.getByDisplayValue("135")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Value (mg/dl)"), { target: { value: "142" } });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    await waitFor(() => expect(api.updateReading).toHaveBeenCalledWith("reading-123", {
      date: "2026-11-15T00:00:00.000Z",
      slot: "AFTER_LUNCH",
      value: 142,
    }));
    expect(onSuccess).toHaveBeenCalledWith("2026-11-15");
  });

  it("calls onCancel when Cancel button is clicked in edit mode", () => {
    const onCancel = vi.fn();
    render(
      <ReadingForm
        onSuccess={vi.fn()}
        onCancel={onCancel}
        editingId="reading-123"
        initialDate="2026-11-15"
        initialValue={130}
      />
    );
    const cancelButtons = screen.getAllByRole("button", { name: /Cancel/i });
    expect(cancelButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(cancelButtons[0]);
    expect(onCancel).toHaveBeenCalled();
  });
});
