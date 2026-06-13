import { describe, expect, it } from "vitest";
import {
  formatOpeningHoursTimeString,
  parseOpeningHoursTimeString,
} from "./opening-hours-time";

describe("opening-hours-time", () => {
  it("parses closed days", () => {
    expect(parseOpeningHoursTimeString("Closed")).toEqual({
      closed: true,
      opens: 10 * 60,
      closes: 20 * 60,
    });
  });

  it("parses open ranges with an en dash", () => {
    expect(parseOpeningHoursTimeString("10 am–8 pm")).toEqual({
      closed: false,
      opens: 10 * 60,
      closes: 20 * 60,
    });
  });

  it("formats open and closed schedules", () => {
    expect(
      formatOpeningHoursTimeString({
        closed: false,
        opens: 10 * 60,
        closes: 20 * 60,
      }),
    ).toBe("10 am–8 pm");
    expect(
      formatOpeningHoursTimeString({
        closed: true,
        opens: 10 * 60,
        closes: 20 * 60,
      }),
    ).toBe("Closed");
  });
});
