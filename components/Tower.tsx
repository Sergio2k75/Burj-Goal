"use client";

import type { Task } from "@/lib/types";
import { Floor } from "./Floor";
import styles from "./Tower.module.css";

type TowerProps = {
  tasks: Task[];
};

/**
 * Visual tower that maps the current task list to a stack of floors.
 * The caption summarises how many floors are lit so far.
 */
export function Tower({ tasks }: TowerProps) {
  const floors = [...tasks].sort((a, b) => b.order - a.order);
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className={styles.stage} aria-label="Goal tower">
      <div className={styles.skyline} aria-hidden />
      <div className={`${styles.tower} ${total === 0 ? styles.empty : ""}`}>
        <div className={styles.spire} aria-hidden>
          <span className={styles.needle} />
          <span className={styles.cap} />
        </div>

        <div className={styles.shaft}>
          {total === 0 && (
            <div className={styles.placeholder}>
              <div className={styles.stubFloor} />
              <div className={styles.stubFloor} />
              <div className={styles.stubFloor} />
            </div>
          )}
          {floors.map((task, visualIndex) => (
            <Floor
              key={task.id}
              task={task}
              index={total - 1 - visualIndex}
              total={total}
            />
          ))}
        </div>

        <div className={styles.podium} aria-hidden>
          <div className={styles.podiumTier} />
          <div className={styles.podiumTier} />
          <div className={styles.podiumBase} />
        </div>
      </div>

      <p className={styles.caption}>
        {total === 0
          ? "Foundation ready — add your first goal"
          : `${doneCount} of ${total} floors lit`}
      </p>
    </div>
  );
}
