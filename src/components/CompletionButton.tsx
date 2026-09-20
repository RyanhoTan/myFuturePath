import { useEffect, useId, useRef, useState, type Ref } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export function Checkmark() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10 3.5 3.5 7.5-7" /></svg>
}

type Confirmation = { completed: boolean; title: string; description: string }

function CompletionDialog({ confirmation, onConfirm, onCancel }: {
  confirmation: Confirmation
  onConfirm: () => void
  onCancel: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const backdropPress = useRef(false)
  const settled = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const reduceMotion = useReducedMotion()

  const resolve = (action: () => void) => {
    // Ignore duplicate clicks, including clicks during the exit animation after cancellation.
    if (settled.current) return
    settled.current = true
    action()
  }

  useEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    cancelRef.current?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="completion-dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); resolve(onCancel) }}
      onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget }}
      onClick={(event) => { if (backdropPress.current && event.target === event.currentTarget) resolve(onCancel) }}
    >
      <motion.div
        className="completion-dialog-panel"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : .97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : .97 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', bounce: 0, duration: .25 }}
      >
        <h2 id={titleId}>{confirmation.title}</h2>
        <p id={descriptionId}>{confirmation.description}</p>
        <div className="completion-dialog-actions">
          <button ref={cancelRef} type="button" onClick={() => resolve(onCancel)}>取消</button>
          <button className="confirm-action" type="button" onClick={() => resolve(onConfirm)}>{confirmation.completed ? '确认完成' : '确认取消完成'}</button>
        </div>
      </motion.div>
    </dialog>
  )
}

export function CompletionButton({ label, done, description, resetDescription, onChange, variant = 'day', buttonRef }: {
  label: string
  done: boolean
  description: string
  resetDescription?: string
  onChange: (completed: boolean) => void
  variant?: 'day' | 'week'
  buttonRef?: Ref<HTMLButtonElement>
}) {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const actionLabel = `${done ? '取消完成' : '标记完成'} ${label}`

  const requestChange = () => {
    if (done && !resetDescription) {
      onChange(false)
      return
    }
    setConfirmation({
      completed: !done,
      title: done ? `取消${label}的完成状态？` : `确认完成 ${label}？`,
      description: done ? resetDescription! : description,
    })
  }

  return (
    <>
      <button
        ref={buttonRef}
        className={`day-complete ${variant === 'week' ? 'week-complete' : ''}`}
        type="button"
        aria-label={actionLabel}
        title={actionLabel}
        aria-pressed={done}
        aria-haspopup={!done || resetDescription ? 'dialog' : undefined}
        onClick={requestChange}
      >
        <span className="check-circle"><Checkmark /></span>
        {done ? (variant === 'week' ? '整周已完成' : '已完成') : (variant === 'week' ? '整周标记完成' : '标记完成')}
      </button>
      <AnimatePresence>
        {confirmation && <CompletionDialog
          confirmation={confirmation}
          onCancel={() => setConfirmation(null)}
          onConfirm={() => {
            // Set the requested value explicitly: another tab may have updated it while the dialog was open.
            onChange(confirmation.completed)
            setConfirmation(null)
          }}
        />}
      </AnimatePresence>
    </>
  )
}
