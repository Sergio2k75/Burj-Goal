"use client";

import type { Task } from "@/lib/types";
import styles from "./TaskList.module.css";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * Renders the current goals in a stable order, with toggle and delete controls for each item.
 * Completed goals are visually marked and the list is sorted from highest-order floor to lowest.
 */
export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className={styles.empty}>
        Each goal becomes a floor. Light the windows by completing them.
      </p>
    );
  }

  const ascending = [...tasks].sort((a, b) => b.order - a.order);

  return (
    <ul className={styles.list} aria-label="Goals">
      {ascending.map((task, index) => {
        const floorNumber = tasks.length - index;
        const done = task.status === "done";

        return (
          <li key={task.id} className={`${styles.item} ${done ? styles.done : ""}`}>
            <span className={styles.floorNum} aria-hidden>
              F{floorNumber}
            </span>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => onToggle(task.id)}
              aria-pressed={done}
              aria-label={done ? `Mark "${task.title}" open` : `Complete "${task.title}"`}
            >
              <span className={styles.lamp} />
              <span className={styles.title}>{task.title}</span>
            </button>
            <button
              type="button"
              className={styles.delete}
              onClick={() => onDelete(task.id)}
              aria-label={`Delete "${task.title}"`}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
