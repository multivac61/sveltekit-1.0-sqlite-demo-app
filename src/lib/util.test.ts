import {it, expect} from "vitest";
import { ms_to_hhmmss, hhmmss_to_ms } from "./util";

it("ms convert to 00:00", () => {
	const zero = "00:00"; 
	expect(ms_to_hhmmss(1)).toBe(zero);
	expect(ms_to_hhmmss(50)).toBe(zero);
	expect(ms_to_hhmmss(100)).toBe(zero);
});

it("should convert seconds to hh:mm", () => {
	expect(ms_to_hhmmss(1_000)).toBe("00:01");
});

it("should convert minutes to mm:ss format", () => {
	expect(ms_to_hhmmss(61_000)).toBe("01:01");
});

it("should convert hours to hh:mm:ss format", () => {
	expect(ms_to_hhmmss(60_000 * 60 + 1_000)).toBe("01:00:01");
});

it("should convert hours to hh:mm:ss format", () => {
	expect(ms_to_hhmmss(60_000 * 60 + 42_000)).toBe("01:00:42");
});

it("should convert hours to hh:mm:ss format", () => {
	expect(hhmmss_to_ms("01:00:01")).toBe(60_000 * 60 + 1_000);
});

it("should convert hours to hh:mm:ss format", () => {
	expect(hhmmss_to_ms("00:00:01")).toBe(1_000);
});

it("should convert hours to hh:mm:ss format", () => {
	expect(hhmmss_to_ms("00:01")).toBe(1_000);
});