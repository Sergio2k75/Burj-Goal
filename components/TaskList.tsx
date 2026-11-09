"use client";

import { useEffect, useRef, useState } from "react";
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
        return (
          <GoalItem
            key={task.id}
            task={task}
            floorNumber={floorNumber}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
}

type GoalItemProps = {
  task: Task;
  floorNumber: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function GoalItem({ task, floorNumber, onToggle, onDelete }: GoalItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClipped, setIsClipped] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const done = task.status === "done";
  const titleId = `goal-title-${task.id}`;

  useEffect(() => {
    const title = titleRef.current;
    if (!title || expanded) return;

    const updateClipping = () => {
      setIsClipped(title.scrollWidth > title.clientWidth);
    };

    updateClipping();
    const observer = new ResizeObserver(updateClipping);
    observer.observe(title);

    return () => observer.disconnect();
  }, [expanded, task.title]);

  return (
    <li
      className={`${styles.item} ${done ? styles.done : ""} ${isClipped ? styles.long : ""}`}
    >
      <span className={styles.floorNum} aria-hidden>
        F{floorNumber}
      </span>
      <div className={styles.goalDetails}>
        <button
          type="button"
          className={`${styles.toggle} ${expanded ? styles.toggleExpanded : ""}`}
          onClick={() => onToggle(task.id)}
          aria-pressed={done}
          aria-label={done ? `Mark "${task.title}" open` : `Complete "${task.title}"`}
        >
          <span className={styles.lamp} />
          <span
            id={titleId}
            ref={titleRef}
            className={`${styles.title} ${expanded ? styles.expandedTitle : ""}`}
          >
            {task.title}
          </span>
        </button>
        {isClipped && (
          <button
            type="button"
            className={styles.expand}
            onClick={() => setExpanded(!expanded)}
            aria-controls={titleId}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? `Show less of "${task.title}"`
                : `Show full goal "${task.title}"`
            }
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
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
}
