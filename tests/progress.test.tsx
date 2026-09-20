// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { trainingWeeks } from '../src/content/exercises'
import { PROGRESS_KEY } from '../src/state/useExerciseProgress'

const firstDay = trainingWeeks[0].days[0]
const dayBody = (number: number) => document.getElementById(`day-${number}-body`)!
const savedIds = (): string[] => JSON.parse(localStorage.getItem(PROGRESS_KEY)!).completed

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/week/week-1')
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion'), media: query,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(),
  })))
  vi.stubGlobal('scrollTo', vi.fn())
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
    await user.click(screen.getByRole('button', { name: '标记完成 Day 1', exact: true }))
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
    await user.click(screen.getByRole('button', { name: '标记完成 Day 4', exact: true }))
    await user.click(screen.getByRole('button', { name: '标记完成 Day 1', exact: true }))
    await user.click(screen.getByRole('button', { name: '取消完成 Day 1', exact: true }))
    expect(savedIds()).toEqual(['day-4'])
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
    await user.click(screen.getByRole('link', { name: '返回训练计划' }))
    expect(screen.queryByRole('status')).toBeNull()
    await user.click(screen.getByRole('link', { name: /异步 JavaScript/ }))
    await user.click(screen.getByRole('button', { name: '标记完成 Day 6', exact: true }))
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
    await user.click(screen.getByRole('button', { name: '标记完成 Day 4', exact: true }))
    expect(screen.getByRole('alert').textContent).toContain('暂时无法保存到本地')
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('true')
    await user.click(screen.getByRole('button', { name: '取消完成 Day 4', exact: true }))
    expect(dayBody(4).getAttribute('aria-hidden')).toBe('false')
  })
})
