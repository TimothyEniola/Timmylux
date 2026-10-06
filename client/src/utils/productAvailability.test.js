import test from "node:test";
import assert from "node:assert/strict";
import {
  getEstimatedCompletionDate,
  getMadeToOrderTimeline,
} from "./productAvailability.js";

test("uses the configured production lead time", () => {
  const purchasedAt = new Date("2026-10-06T12:00:00Z");
  const timeline = getMadeToOrderTimeline(
    { available: false, estimatedBuildDays: 10 },
    purchasedAt
  );

  assert.equal(timeline.days, 10);
  assert.equal(timeline.estimatedCompletionDate, "2026-10-16T12:00:00.000Z");
});

test("falls back to 14 days when the lead time is missing or invalid", () => {
  const purchasedAt = new Date("2026-10-06T12:00:00Z");

  assert.equal(
    getEstimatedCompletionDate({ available: false }, purchasedAt),
    "2026-10-20T12:00:00.000Z"
  );
  assert.equal(
    getEstimatedCompletionDate({ available: false, estimatedBuildDays: -2 }, purchasedAt),
    "2026-10-20T12:00:00.000Z"
  );
});

test("returns no timeline for an available product", () => {
  const timeline = getMadeToOrderTimeline({ available: true, estimatedBuildDays: 5 });

  assert.deepEqual(timeline, {
    days: 0,
    estimatedCompletionDate: null,
  });
});
