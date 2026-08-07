"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loadTasks, saveTasks } from "./storage";
import type { Task } from "./types";

type Listener = () => void;

let memoryTasks: Task[] | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readTasks(): Task[] {
  if (memoryTasks === null) {
    memoryTasks = loadTasks();
  }
  return memoryTasks;
}

function writeTasks(next: Task[]) {
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

export function useTasks() {
  const tasks = useSyncExternalStore(subscribe, readTasks, getServerSnapshot);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const prev = readTasks();
    const nextOrder =
      prev.length === 0 ? 0 : Math.max(...prev.map((t) => t.order)) + 1;

    writeTasks([
      ...prev,
      {
        id: createId(),
        title: trimmed,
        status: "open",
        createdAt: Date.now(),
        order: nextOrder,
      },
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    writeTasks(
      readTasks().map((task) =>
        task.id === id
          ? { ...task, status: task.status === "done" ? "open" : "done" }
          : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    const remaining = readTasks().filter((task) => task.id !== id);
    writeTasks(
      remaining
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
