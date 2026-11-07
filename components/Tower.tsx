"use client";

import type { CSSProperties } from "react";
import type { Task } from "@/lib/types";
import { Floor, facadeWidth } from "./Floor";
import styles from "./Tower.module.css";

type TowerProps = {
  tasks: Task[];
};

const SKYLINE = [
  { left: "1%", width: "6%", height: "48%" },
  { left: "8%", width: "3.5%", height: "74%" },
  { left: "12.5%", width: "8%", height: "40%" },
  { left: "21%", width: "4.5%", height: "58%" },
  { left: "73%", width: "5%", height: "64%" },
  { left: "79%", width: "8.5%", height: "36%" },
  { left: "88.5%", width: "4%", height: "52%" },
  { left: "93.5%", width: "5%", height: "30%" },
];

const STUBS = ["60%", "76%", "92%"];

/**
 * Visual tower that maps the current task list to a stack of floors.
 * The caption summarises how many floors are lit so far.
 */
export function Tower({ tasks }: TowerProps) {
  const floors = [...tasks].sort((a, b) => b.order - a.order);
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const crown =
    total === 0
      ? 24
      : Math.min(32, Math.max(18, facadeWidth(total - 1, total) * 0.5));

  const sceneStyle = {
    "--stories": String(total === 0 ? 3 : total),
    "--crown": `${crown}%`,
  } as CSSProperties;

  return (
    <div className={styles.stage} aria-label="Goal tower">
      <div className={styles.scene} style={sceneStyle}>
        <div className={styles.city} aria-hidden>
          {SKYLINE.map((block) => (
            <span
              key={`${block.left}-${block.height}`}
              className={styles.block}
              style={{
                left: block.left,
                width: block.width,
                height: block.height,
              }}
            />
          ))}
        </div>

        <div className={`${styles.tower} ${total === 0 ? styles.empty : ""}`}>
          <div className={styles.spire} aria-hidden>
            <span className={styles.beacon} />
            <span className={styles.crossbar} />
            <span className={styles.needle} />
            <span className={styles.mastBand} />
            <span className={styles.mast} />
            <span className={styles.mastBandWide} />
            <span className={styles.collar} />
            <span className={styles.lantern}>
              <span className={styles.lanternGlass} />
            </span>
          </div>

          <div className={styles.shaft}>
            {total === 0 && (
              <div className={styles.placeholder}>
                {STUBS.map((width) => (
                  <div
                    key={width}
                    className={styles.stubFloor}
                    style={{ width }}
                  >
                    <div className={styles.stubFront} />
                    <div className={styles.stubCorner} />
                    <div className={styles.stubSide} />
                  </div>
                ))}
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
            <div className={styles.lobby}>
              <div className={styles.lobbyFront}>
                <span className={styles.canopy} />
                <span className={styles.shop} />
                <span className={styles.door} />
                <span className={styles.shop} />
              </div>
              <div className={styles.lobbySide} />
            </div>
            <div className={styles.terrace}>
              <div className={styles.terraceFront} />
              <div className={styles.terraceSide} />
            </div>
            <div className={styles.plaza}>
              <span className={styles.bollard} />
              <span className={styles.bollard} />
            </div>
          </div>

          <div className={styles.contact} aria-hidden />
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
