"use client";

import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEY, loadTasks, saveTasks } from "./storage";
import type { Task } from "./types";

type Listener = () => void;

let memoryTasks: Task[] | null = null;
const listeners = new Set<Listener>();
let crossTabSyncAttached = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function syncFromStorage() {
  memoryTasks = loadTasks();
  emit();
}

function ensureCrossTabSync() {
  if (typeof window === "undefined" || crossTabSyncAttached) return;
  crossTabSyncAttached = true;
  window.addEventListener("storage", (event) => {
    if (event.storageArea !== window.localStorage) return;
    // key === null means Storage.clear() in another document
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    syncFromStorage();
  });
}

function subscribe(listener: Listener): () => void {
  ensureCrossTabSync();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readTasks(): Task[] {
  if (memoryTasks === null) {
    memoryTasks = loadTasks();
  }
  return memoryTasks;
}

/** Apply a mutation against the latest persisted tasks to avoid clobbering other tabs. */
function mutateTasks(recipe: (prev: Task[]) => Task[]) {
  const prev = loadTasks();
  const next = recipe(prev);
  memoryTasks = next;
  saveTasks(next);
  emit();
}

const EMPTY_TASKS: Task[] = [];

function getServerSnapshot(): Task[] {
  return EMPTY_TASKS;
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Shared task-state hook for the app.
 * It keeps the current list in sync with localStorage and broadcasts changes to the UI.
 */
export function useTasks() {
  const tasks = useSyncExternalStore(subscribe, readTasks, getServerSnapshot);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    mutateTasks((prev) => {
      const nextOrder =
        prev.length === 0 ? 0 : Math.max(...prev.map((t) => t.order)) + 1;

      return [
        ...prev,
        {
          id: createId(),
          title: trimmed,
          status: "open",
          createdAt: Date.now(),
          order: nextOrder,
        },
      ];
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    mutateTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "done" ? "open" : "done" }
          : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    mutateTasks((prev) =>
      prev
        .filter((task) => task.id !== id)
        .sort((a, b) => a.order - b.order)
        .map((task, index) => ({ ...task, order: index })),
    );
  }, []);

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return {
    tasks: sortedTasks,
    addTask,
    toggleTask,
    deleteTask,
  };
}
