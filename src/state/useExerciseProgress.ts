import { useCallback, useEffect, useRef, useState } from 'react'
import { trainingWeeks, type TrainingDay } from '../content/exercises'

export const PROGRESS_KEY = 'myFuturePath-exercise-progress-v1'
export type CompletedExercises = Record<string, true>

const validIds = new Set(trainingWeeks.flatMap((week) => week.days.flatMap((day) => [day.id, ...day.tasks.map((task) => task.id)])))

export function readProgress(value: string | null): CompletedExercises {
  if (!value) return {}
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('completed' in parsed) || !Array.isArray(parsed.completed)) return {}
    return Object.fromEntries(parsed.completed.filter((id): id is string => typeof id === 'string' && validIds.has(id)).map((id) => [id, true]))
  } catch {
    return {}
  }
}

function loadProgress() {
  try {
    return readProgress(window.localStorage.getItem(PROGRESS_KEY))
  } catch {
    return {}
  }
}

export function useExerciseProgress() {
  const [completed, setCompleted] = useState<CompletedExercises>(loadProgress)
  const current = useRef(completed)
  const [saveError, setSaveError] = useState(false)

  const save = useCallback((next: CompletedExercises) => {
    current.current = next
    setCompleted(next)
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, completed: Object.keys(next) }))
      setSaveError(false)
    } catch {
      setSaveError(true)
    }
  }, [])

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== PROGRESS_KEY && event.key !== null) return
      const next = readProgress(event.newValue)
      current.current = next
      setCompleted(next)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const toggleDay = useCallback((day: TrainingDay) => {
    const next = { ...current.current }
    const done = !next[day.id]
    for (const id of [day.id, ...day.tasks.map((task) => task.id)]) {
      if (done) next[id] = true
      else delete next[id]
    }
    save(next)
  }, [save])

  const toggleTask = useCallback((day: TrainingDay, taskId: string) => {
    if (!day.tasks.some((task) => task.id === taskId)) return
    const next = { ...current.current }
    if (next[taskId]) delete next[taskId]
    else next[taskId] = true
    if (day.tasks.every((task) => next[task.id])) next[day.id] = true
    else delete next[day.id]
    save(next)
  }, [save])

  return { completed, saveError, toggleDay, toggleTask }
}

export type ExerciseProgress = ReturnType<typeof useExerciseProgress>
