"use client";

import { useState, type FormEvent } from "react";
import styles from "./TaskForm.module.css";

type TaskFormProps = {
  /** Return false when the goal was not persisted so the input can be kept. */
  onAdd: (title: string) => boolean | void;
  inputId?: string;
};

/**
 * Controlled form for creating a new goal.
 * It trims whitespace, prevents empty submissions, and clears the input after a successful add.
 */
export function TaskForm({ onAdd, inputId = "goal-input" }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    const added = onAdd(title);
    if (added === false) return;
    setTitle("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={inputId}>
        New goal
      </label>
      <div className={styles.row}>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Reach the next floor…"
          maxLength={120}
          autoComplete="off"
        />
        <button className={styles.button} type="submit" disabled={!title.trim()}>
          Add floor
        </button>
      </div>
    </form>
  );
}
