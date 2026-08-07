"use client";

import type { Task } from "@/lib/types";
import styles from "./Floor.module.css";

type FloorProps = {
  task: Task;
  index: number;
  total: number;
};

export function Floor({ task, index, total }: FloorProps) {
  const taper = 1 - (index / Math.max(total, 1)) * 0.45;
  const windowCount = Math.max(3, Math.min(7, Math.round(4 + taper * 3)));
  const isDone = task.status === "done";

  return (
    <div
      className={`${styles.floor} ${isDone ? styles.done : styles.open}`}
      style={{
        width: `${taper * 100}%`,
        animationDelay: `${index * 40}ms`,
      }}
      title={task.title}
      data-floor={index + 1}
    >
      <div className={styles.ledge} />
      <div className={styles.windows} aria-hidden>
        {Array.from({ length: windowCount }, (_, i) => (
          <span
            key={i}
            className={`${styles.window} ${isDone ? styles.lit : styles.dim}`}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
