import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initProject } from "./init";

vi.mock("node:child_process");
vi.mock("@inquirer/prompts", () => ({
	confirm: vi.fn(),
	input: vi.fn(),
}));

const mockCwd = "/tmp/test-project";

describe("init", () => {
	let originalCwd: string;

	beforeEach(() => {
		originalCwd = process.cwd();
		vi.spyOn(process, "cwd").mockReturnValue(mockCwd);
		rmSync(mockCwd, { recursive: true, force: true });
		mkdirSync(mockCwd, { recursive: true });
	});

	afterEach(() => {
		vi.restoreAllMocks();
		process.chdir(originalCwd);
		rmSync(mockCwd, { recursive: true, force: true });
	});

	describe("initProject", () => {
		it("should create AGENTS.md file", async () => {
			await initProject({ skipPrompts: true, skipSkills: true });

			const agentsPath = join(mockCwd, "AGENTS.md");
			expect(existsSync(agentsPath)).toBe(true);
		});

		it("should create SOUL.md file", async () => {
			await initProject({ skipPrompts: true, skipSkills: true });

			const soulPath = join(mockCwd, "SOUL.md");
			expect(existsSync(soulPath)).toBe(true);
		});

		it("should skip skills when skipSkills is true", async () => {
			const execSync = await import("node:child_process");
			const mockExecSync = vi.spyOn(execSync, "execSync");

			await initProject({ skipPrompts: true, skipSkills: true });

			expect(mockExecSync).not.toHaveBeenCalled();
		});

		it("should not overwrite existing AGENTS.md when skipPrompts is true", async () => {
			const agentsPath = join(mockCwd, "AGENTS.md");
			writeFileSync(agentsPath, "existing content");

			await initProject({ skipPrompts: true, skipSkills: true });

			const content = await import("node:fs").then((fs) =>
				fs.readFileSync(agentsPath, "utf-8"),
			);
			expect(content).toBe("existing content");
		});

		it("should not overwrite existing SOUL.md when skipPrompts is true", async () => {
			const soulPath = join(mockCwd, "SOUL.md");
			writeFileSync(soulPath, "existing content");

			await initProject({ skipPrompts: true, skipSkills: true });

			const content = await import("node:fs").then((fs) =>
				fs.readFileSync(soulPath, "utf-8"),
			);
			expect(content).toBe("existing content");
		});

		it("should use default agents when none specified", async () => {
			const execSync = await import("node:child_process");
			const mockExecSync = vi
				.spyOn(execSync, "execSync")
				.mockImplementation(() => Buffer.from(""));

			await initProject({ skipPrompts: true, skipSkills: false });

			expect(mockExecSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent opencode"),
				expect.any(Object),
			);
			expect(mockExecSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent claude-code"),
				expect.any(Object),
			);
		});

		it("should use custom agents when specified", async () => {
			const execSync = await import("node:child_process");
			const mockExecSync = vi
				.spyOn(execSync, "execSync")
				.mockImplementation(() => Buffer.from(""));

			await initProject({
				skipPrompts: true,
				skipSkills: false,
				agents: ["cursor", "cline"],
			});

			expect(mockExecSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent cursor"),
				expect.any(Object),
			);
			expect(mockExecSync).toHaveBeenCalledWith(
				expect.stringContaining("--agent cline"),
				expect.any(Object),
			);
		});

		it("should pass global flag when specified", async () => {
			const execSync = await import("node:child_process");
			const mockExecSync = vi
				.spyOn(execSync, "execSync")
				.mockImplementation(() => Buffer.from(""));

			await initProject({
				skipPrompts: true,
				skipSkills: false,
				global: true,
			});

			expect(mockExecSync).toHaveBeenCalledWith(
				expect.stringContaining("--global"),
				expect.any(Object),
			);
		});
	});
});
