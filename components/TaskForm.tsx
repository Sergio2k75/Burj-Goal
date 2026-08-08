"use client";

import { useState, type FormEvent } from "react";
import styles from "./TaskForm.module.css";

type TaskFormProps = {
  onAdd: (title: string) => void;
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
    onAdd(title);
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
