import type { Task } from "./types";

export const STORAGE_KEY = "burj-goal:v1";

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

/** Persist tasks. Returns false when the write fails (quota, private mode, etc.). */
export function saveTasks(tasks: Task[]): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    // Quota or private mode — caller must not treat memory as durable.
    return false;
  }
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    (task.status === "open" || task.status === "done") &&
    typeof task.createdAt === "number" &&
    typeof task.order === "number"
  );
}
