"use client";

import type { CSSProperties } from "react";
import type { Task } from "@/lib/types";
import styles from "./Floor.module.css";

type FloorProps = {
  task: Task;
  index: number;
  total: number;
};

/**
 * Lower floors stay broad. The shaft eases inward toward the crown,
 * closer to a real tower's setbacks than a straight pyramid.
 */
export function facadeWidth(index: number, total: number): number {
  if (total <= 1) return 100;
  const t = index / (total - 1);
  // Stay broad through the lower floors, then pinch toward the crown.
  return (1 - Math.pow(t, 1.65) * 0.5) * 100;
}

type PaneKind = "dark" | "ember" | "curtained" | "warm" | "lit" | "bright";

function paneKind(index: number, pane: number, isDone: boolean): PaneKind {
  const n = (index * 17 + pane * 5) % 13;
  if (isDone) {
    if (n === 0) return "curtained";
    if (n === 1) return "dark";
    if (n < 4) return "bright";
    if (n < 8) return "warm";
    return "lit";
  }
  if (n === 3 || n === 10) return "ember";
  return "dark";
}

const PANE_CLASS: Record<PaneKind, string> = {
  dark: styles.paneDark,
  ember: styles.paneEmber,
  curtained: styles.paneCurtained,
  warm: styles.paneWarm,
  lit: styles.paneLit,
  bright: styles.paneBright,
};

/**
 * One goal, drawn as a floor of curtain wall in three-quarter view:
 * glass panes, a metal corner, and a shadowed return wall.
 */
export function Floor({ task, index, total }: FloorProps) {
  const width = facadeWidth(index, total);
  const cols = Math.max(5, Math.min(12, Math.round(width / 8)));
  const rows = total > 10 ? 1 : total > 6 ? 2 : 3;
  const isDone = task.status === "done";

  const style = {
    width: `${width}%`,
    animationDelay: `${index * 45}ms`,
    "--cols": String(cols),
    "--rows": String(rows),
    "--depth": (width / 100).toFixed(3),
  } as CSSProperties;

  return (
    <div
      className={`${styles.floor} ${isDone ? styles.done : styles.open}`}
      style={style}
      title={task.title}
      data-floor={index + 1}
    >
      <div className={styles.cornice} aria-hidden />
      <div className={styles.body}>
        <div className={styles.front}>
          <div className={styles.mullions} aria-hidden>
            {Array.from({ length: cols * rows }, (_, pane) => {
              const kind = paneKind(index, pane, isDone);
              return (
                <span
                  key={pane}
                  className={`${styles.pane} ${PANE_CLASS[kind]}`}
                  style={{ animationDelay: `${(pane % cols) * 40}ms` }}
                />
              );
            })}
          </div>
          <div className={styles.sheen} aria-hidden />
        </div>
        <div className={styles.corner} aria-hidden />
        <div className={styles.side} aria-hidden />
      </div>
    </div>
  );
}
