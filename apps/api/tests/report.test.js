function computeStats(readings) {
    const count = readings.length;
    if (count === 0) {
        return { highest: null, lowest: null, average: null, count: 0 };
    }
    const values = readings.map((r) => r.value);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const average = Math.round((values.reduce((a, b) => a + b, 0) / count) * 10) / 10;
    return { highest, lowest, average, count };
}
describe("Report stats", () => {
    it("returns null stats and zero count for empty readings", () => {
        const result = computeStats([]);
        expect(result.count).toBe(0);
        expect(result.highest).toBeNull();
        expect(result.lowest).toBeNull();
        expect(result.average).toBeNull();
    });
    it("computes highest, lowest, average rounded to 1 decimal", () => {
        const result = computeStats([
            { value: 90 },
            { value: 140 },
            { value: 160 },
        ]);
        expect(result.count).toBe(3);
        expect(result.highest).toBe(160);
        expect(result.lowest).toBe(90);
        expect(result.average).toBe(130);
    });
    it("rounds average to 1 decimal", () => {
        const result = computeStats([
            { value: 100 },
            { value: 101 },
            { value: 102 },
        ]);
        expect(result.average).toBe(101);
    });
    it("handles single reading", () => {
        const result = computeStats([{ value: 85 }]);
        expect(result.count).toBe(1);
        expect(result.highest).toBe(85);
        expect(result.lowest).toBe(85);
        expect(result.average).toBe(85);
    });
});
export {};
//# sourceMappingURL=report.test.js.map