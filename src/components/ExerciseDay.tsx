import { createContext, useContext, useMemo, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown'
import { remarkExerciseTasks, type TrainingDay } from '../content/exercises'
import type { ExerciseProgress } from '../state/useExerciseProgress'
import { Checkmark, CompletionButton } from './CompletionButton'

type DayContextValue = { day: TrainingDay; progress: ExerciseProgress; toggleTask: (id: string) => void }
const DayContext = createContext<DayContextValue | null>(null)

function TaskItem({ node, children, ...props }: ComponentPropsWithoutRef<'li'> & ExtraProps) {
  const context = useContext(DayContext)
  const [expanded, setExpanded] = useState(false)
  const taskId = String(node?.properties?.['data-task-id'] ?? '')
  const taskIndex = context?.day.tasks.findIndex((task) => task.id === taskId) ?? -1
  if (!context || taskIndex < 0) return <li {...props}>{children}</li>

  const done = Boolean(context.progress.completed[taskId])
  const label = `Day ${context.day.number} 第 ${taskIndex + 1} 题`
  const contentId = `${taskId}-content`

  return (
    <li {...props} className={`exercise-task ${done ? 'is-complete' : ''} ${done && !expanded ? 'is-compact' : ''}`}>
      <div className="task-row">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={done}
            aria-label={`${label}已完成`}
            onChange={() => { setExpanded(false); context.toggleTask(taskId) }}
          />
          <span className="check-circle"><Checkmark /></span>
        </label>
        <div className="task-copy" id={contentId}>{children}</div>
        {done && (
          <button
            type="button"
            className="task-review"
            aria-label={`${expanded ? '收起' : '展开'}${label}`}
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded((value) => !value)}
          >{expanded ? '收起' : '展开'}</button>
        )}
      </div>
    </li>
  )
}

const titleComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
  code: ({ children }) => <code className="inline-code">{children}</code>,
}

export function ExerciseDay({ day, progress, components }: { day: TrainingDay; progress: ExerciseProgress; components: Components }) {
  const done = Boolean(progress.completed[day.id])
  const [disclosure, setDisclosure] = useState({ done, expanded: !done })
  // Reset manual review expansion on bulk completion or undo, too.
  if (disclosure.done !== done) setDisclosure({ done, expanded: !done })
  const expanded = disclosure.done === done ? disclosure.expanded : !done
  const reduceMotion = useReducedMotion()
  const completeButton = useRef<HTMLButtonElement>(null)
  const dayComponents = useMemo(() => ({ ...components, li: TaskItem }), [components])
  const finishedTasks = day.tasks.filter((task) => progress.completed[task.id]).length
  const bodyId = `${day.id}-body`

  const toggleTask = (id: string) => {
    const completesDay = !progress.completed[id] && day.tasks.every((task) => task.id === id || progress.completed[task.id])
    if (completesDay) completeButton.current?.focus({ preventScroll: true })
    progress.toggleTask(day, id)
  }

  return (
    <article className={`day-exercise ${done ? 'is-complete' : ''}`} aria-labelledby={`${day.id}-title`}>
      <header className="day-header">
        <div className="day-heading">
          <h2 id={`${day.id}-title`}><span className="day-number">Day {day.number}</span><span className="day-title"><ReactMarkdown components={titleComponents}>{day.title}</ReactMarkdown></span></h2>
          {day.tasks.length > 0 && <span className="day-task-count">{finishedTasks} / {day.tasks.length} 题已完成</span>}
        </div>
        <div className="day-actions">
          <CompletionButton
            buttonRef={completeButton}
            label={`Day ${day.number}`}
            done={done}
            description="将当天全部练习标记为已完成，并自动收起题目。之后仍可展开复习或取消完成。"
            onChange={(completed) => progress.setDayCompleted(day, completed)}
          />
          <button
            className="day-disclosure"
            type="button"
            aria-label={`${expanded ? '收起' : '展开'} Day ${day.number} 题目`}
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={() => setDisclosure({ done, expanded: !expanded })}
          >{expanded ? '收起' : '展开'}<motion.svg viewBox="0 0 20 20" aria-hidden="true" initial={false} animate={{ rotate: expanded ? 180 : 0 }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', bounce: 0, duration: .3 }}><path d="m5 7.5 5 5 5-5" /></motion.svg></button>
        </div>
      </header>
      <motion.div
        id={bodyId}
        className="day-body"
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', bounce: 0, duration: .35 }}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="markdown-content day-content">
          <DayContext.Provider value={{ day, progress, toggleTask }}>
            <ReactMarkdown components={dayComponents} remarkPlugins={[[remarkExerciseTasks, { tasks: day.tasks }]]}>{day.markdown}</ReactMarkdown>
          </DayContext.Provider>
        </div>
      </motion.div>
    </article>
  )
}
