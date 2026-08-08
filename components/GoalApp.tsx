"use client";

import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Tower } from "@/components/Tower";
import { useTasks } from "@/lib/useTasks";
import { INTERNAL_VERSION } from "@/lib/version";
import styles from "./GoalApp.module.css";

export function GoalApp() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <div className={styles.shell}>
      <div className={styles.atmosphere} aria-hidden>
        <div className={styles.stars} />
        <div className={styles.haze} />
        <div className={styles.ground} />
      </div>

      <main className={styles.main}>
        <section className={styles.copy}>
          <p className={styles.kicker}>Personal goal tower</p>
          <h1 className={styles.brand}>Burj-Goal</h1>
          <p className={styles.tagline}>Build your goals skyward.</p>

          <div className={styles.panel}>
            <TaskForm onAdd={addTask} />
            <div className={styles.listWrap}>
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>
          </div>
        </section>

        <section className={styles.towerPane}>
          <Tower tasks={tasks} />
        </section>
      </main>

      <p className={styles.version} aria-label={`Internal version ${INTERNAL_VERSION}`}>
        v{INTERNAL_VERSION}
      </p>
    </div>
  );
}
