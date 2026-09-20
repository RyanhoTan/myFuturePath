// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { trainingWeeks } from '../src/content/exercises'
import { PROGRESS_KEY } from '../src/state/useExerciseProgress'

const firstDay = trainingWeeks[0].days[0]
const dayBody = (number: number) => document.getElementById(`day-${number}-body`)!
const savedIds = (): string[] => JSON.parse(localStorage.getItem(PROGRESS_KEY)!).completed

async function confirmCompletion(user: ReturnType<typeof userEvent.setup>) {
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '确认完成', exact: true }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

async function completeDay(user: ReturnType<typeof userEvent.setup>, day: number) {
  await user.click(screen.getByRole('button', { name: `标记完成 Day ${day}`, exact: true }))
  await confirmCompletion(user)
}

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/week/week-1')
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion'), media: query,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(),
  })))
  vi.stubGlobal('scrollTo', vi.fn())
  // JSDOM has no native dialog implementation. Browser focus containment is not simulated here.
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function () { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function () { this.removeAttribute('open') } })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('exercise completion', () => {
  it('renders actual exercises and VS Code syntax highlighting in both themes', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(within(dayBody(1)).getAllByRole('checkbox')).toHaveLength(6)
    const code = dayBody(1).querySelector('.code-window')!
    expect(code.textContent).toContain('const numbers = [1, 2, 3, 4, 5];')
    expect(code.querySelectorAll('.token').length).toBeGreaterThan(10)
    expect(document.querySelector('.app-shell')!.classList.contains('theme-dark')).toBe(false)
    await user.click(screen.getByRole('button', { name: '切换深色主题' }))
    expect(document.querySelector('.app-shell')!.classList.contains('theme-dark')).toBe(true)
    expect(code.querySelector('pre')!.style.background).toBe('rgb(31, 31, 34)')
    expect(localStorage.getItem('myFuturePath-theme')).toBe('dark')
  })

  it('saves each checkbox, marks and compacts it, and restores it on reload', async () => {
    const user = userEvent.setup()
    const view = render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: 'Day 1 第 1 题已完成' }) as HTMLInputElement
    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)
    expect(checkbox.closest('li')!.classList.contains('is-complete')).toBe(true)
    expect(checkbox.closest('li')!.classList.contains('is-compact')).toBe(true)
    expect(savedIds()).toContain(firstDay.tasks[0].id)
    expect(savedIds()).not.toContain(firstDay.id)
    await user.click(screen.getByRole('button', { name: '展开Day 1 第 1 题' }))
    expect(checkbox.closest('li')!.classList.contains('is-compact')).toBe(false)
    view.unmount()
    render(<App />)
    const restored = screen.getByRole('checkbox', { name: 'Day 1 第 1 题已完成' }) as HTMLInputElement
    expect(restored.checked).toBe(true)
    expect(restored.closest('li')!.classList.contains('is-compact')).toBe(true)
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('false')
    await user.click(restored)
    expect(restored.checked).toBe(false)
    expect(restored.closest('li')!.classList.contains('is-complete')).toBe(false)
    expect(savedIds()).toEqual([])
  })

  it('completes and auto-collapses a day, restores it, then allows review and undo', async () => {
    const user = userEvent.setup()
    const view = render(<App />)
    await completeDay(user, 1)
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('true')
    expect(dayBody(1).hasAttribute('inert')).toBe(true)
    expect(savedIds()).toEqual(expect.arrayContaining([firstDay.id, ...firstDay.tasks.map((task) => task.id)]))
    expect(screen.getByRole('status').textContent).toContain('1 / 5')
    view.unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: '取消完成 Day 1', exact: true }).getAttribute('aria-pressed')).toBe('true')
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('true')
    await user.click(screen.getByRole('button', { name: '展开 Day 1 题目', exact: true }))
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('false')
    expect(savedIds()).toContain(firstDay.id)
    await user.click(screen.getByRole('checkbox', { name: 'Day 1 第 2 题已完成' }))
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('false')
    expect(savedIds()).not.toContain(firstDay.id)
    expect(savedIds()).toContain(firstDay.tasks[0].id)
    expect(screen.getByRole('button', { name: '标记完成 Day 1', exact: true }).getAttribute('aria-pressed')).toBe('false')
  })

  it('auto-collapses after the last individual task and moves keyboard focus out of the hidden content', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (let index = 1; index <= firstDay.tasks.length; index++) {
      const checkbox = screen.getByRole('checkbox', { name: `Day 1 第 ${index} 题已完成` })
      checkbox.focus()
      await user.keyboard(' ')
    }
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('true')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '取消完成 Day 1', exact: true }))
    expect(savedIds()).toContain(firstDay.id)
  })

  it('supports code-only days and keeps other days and weeks untouched on undo', async () => {
    const user = userEvent.setup()
    render(<App />)
    await completeDay(user, 4)
    await completeDay(user, 1)
    await user.click(screen.getByRole('button', { name: '取消完成 Day 1', exact: true }))
    expect(savedIds()).toEqual(['day-4'])
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
    await user.click(screen.getByRole('link', { name: '返回训练计划' }))
    expect(screen.queryByRole('status')).toBeNull()
    await user.click(screen.getByRole('link', { name: /异步 JavaScript/ }))
    await completeDay(user, 6)
    expect(savedIds()).toContain('day-4')
    expect(savedIds()).toContain('day-6')
    expect(screen.getByRole('status').textContent).toContain('1 / 5')
  })

  it('synchronizes updates and clearing from another tab', () => {
    render(<App />)
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_KEY, newValue: JSON.stringify({ version: 1, completed: ['day-4'] }) })))
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: null, newValue: null })))
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('false')
  })

  it('shows a save error without losing the current interactive state', async () => {
    const user = userEvent.setup()
    const setItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === PROGRESS_KEY) throw new DOMException('Storage full', 'QuotaExceededError')
      return setItem.call(this, key, value)
    })
    render(<App />)
    await completeDay(user, 4)
    expect(screen.getByRole('alert').textContent).toContain('暂时无法保存到本地')
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
    await user.click(screen.getByRole('button', { name: '取消完成 Day 4', exact: true }))
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('false')
  })
})

describe('confirmation dialogs', () => {
  it('does not change state before confirmation, and cancellation preserves partial progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Day 1 第 1 题已完成' }))
    const snapshot = localStorage.getItem(PROGRESS_KEY)
    const trigger = screen.getByRole('button', { name: '标记完成 Day 1', exact: true })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: '确认完成 Day 1？' })
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: '取消', exact: true }))
    expect(document.body.style.overflow).toBe('hidden')
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('false')
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(snapshot)
    await user.click(within(dialog).getByRole('button', { name: '取消', exact: true }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).not.toBe('hidden')
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(snapshot)
  })

  it('handles native Escape cancellation and backdrop clicks without writing progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: '标记完成 Day 1', exact: true })
    await user.click(trigger)
    // A real browser emits cancel when Escape is pressed on a modal dialog.
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(trigger)
    await user.click(trigger)
    await user.click(screen.getByRole('dialog'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull()
  })

  it('supports explicit keyboard confirmation and returns focus after collapsing the day', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: '标记完成 Day 4', exact: true })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(document.activeElement?.textContent).toBe('取消')
    await user.tab()
    expect(document.activeElement?.textContent).toBe('确认完成')
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
  })

  it('does not invert completion if another tab updates progress while confirmation is open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '标记完成 Day 4', exact: true }))
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_KEY, newValue: JSON.stringify({ version: 1, completed: ['day-4'] }) })))
    await confirmCompletion(user)
    expect(savedIds()).toContain('day-4')
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
  })

  it('cannot commit through a stale confirm button after cancellation has begun', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '标记完成 Day 4', exact: true }))
    const dialog = within(screen.getByRole('dialog'))
    const cancel = dialog.getByRole('button', { name: '取消', exact: true })
    const confirm = dialog.getByRole('button', { name: '确认完成', exact: true })
    act(() => { fireEvent.click(cancel); fireEvent.click(confirm) })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull()
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('false')
  })
})

describe('week completion', () => {
  it('marks a week from its home card without navigating, persists it, and reflects it on the details page', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/')
    const view = render(<App />)
    const trigger = screen.getByRole('button', { name: '标记完成 第 1 周', exact: true })
    expect(trigger.closest('a')).toBeNull()
    await user.click(trigger)
    expect(window.location.pathname).toBe('/')
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull()
    expect(screen.getByRole('dialog').textContent).toContain('5 天及全部小题')
    await confirmCompletion(user)
    const expected = trainingWeeks[0].days.flatMap((day) => [day.id, ...day.tasks.map((task) => task.id)])
    expect(savedIds().sort()).toEqual(expected.sort())
    expect(trigger.getAttribute('aria-pressed')).toBe('true')
    expect(trigger.closest('.plan-card')!.classList.contains('is-complete')).toBe(true)
    view.unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: '取消完成 第 1 周', exact: true }).getAttribute('aria-pressed')).toBe('true')
    await user.click(screen.getByRole('link', { name: 'JS 数组、对象、函数' }))
    expect(window.location.pathname).toBe('/week/week-1')
    expect(screen.getByRole('status').textContent).toContain('5 / 5')
    for (const day of trainingWeeks[0].days) expect(dayBody(day.number).getAttribute('aria-hidden')).toBe('true')
    await user.click(screen.getByRole('button', { name: '展开 Day 1 题目', exact: true }))
    await user.click(screen.getByRole('checkbox', { name: 'Day 1 第 1 题已完成' }))
    expect(screen.getByRole('button', { name: '标记完成 第 1 周', exact: true }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('status').textContent).toContain('4 / 5')
    // A manually expanded day must still collapse on a subsequent bulk completion.
    await user.click(screen.getByRole('button', { name: '标记完成 第 1 周', exact: true }))
    await confirmCompletion(user)
    expect(dayBody(1).getAttribute('aria-hidden')).toBe('true')
  })

  it('confirms cancelling a whole week and leaves other weeks untouched', async () => {
    const user = userEvent.setup()
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, completed: ['day-6'] }))
    render(<App />)
    await user.click(screen.getByRole('button', { name: '标记完成 第 1 周', exact: true }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '取消', exact: true }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(savedIds()).toEqual(['day-6'])
    await user.click(screen.getByRole('button', { name: '标记完成 第 1 周', exact: true }))
    await confirmCompletion(user)
    expect(savedIds()).toContain('day-6')
    await user.click(screen.getByRole('button', { name: '取消完成 第 1 周', exact: true }))
    expect(screen.getByRole('dialog').textContent).toContain('包括之前单独完成的小题')
    expect(screen.getByRole('status').textContent).toContain('5 / 5')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '确认取消完成' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(savedIds()).toEqual(['day-6'])
    expect(screen.getByRole('status').textContent).toContain('0 / 5')
    for (const day of trainingWeeks[0].days) expect(dayBody(day.number).getAttribute('aria-hidden')).toBe('false')
  })

  it('derives week completion from existing individual day progress without a migration', async () => {
    const user = userEvent.setup()
    for (const day of trainingWeeks[0].days.slice(0, 4)) {
      const saved = localStorage.getItem(PROGRESS_KEY) ? savedIds() : []
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, completed: [...saved, day.id, ...day.tasks.map((task) => task.id)] }))
    }
    render(<App />)
    expect(screen.getByRole('button', { name: '标记完成 第 1 周', exact: true }).getAttribute('aria-pressed')).toBe('false')
    await completeDay(user, 5)
    expect(screen.getByRole('button', { name: '取消完成 第 1 周', exact: true }).getAttribute('aria-pressed')).toBe('true')
    expect(savedIds().filter((id) => id.startsWith('week-'))).toEqual([])
  })
})
