// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion'), media: query,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(),
  })))
  vi.stubGlobal('scrollTo', vi.fn())
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Markdown notes', () => {
  it('opens a specific note by URL and switches notes from the file list', async () => {
    window.history.replaceState({}, '', '/notes?file=week1%2Fday2.md')
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('article', { name: '笔记 week1/day2.md' }).textContent).toContain('map 不是筛选')
    await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'week1/day3.md' }))
    expect(screen.getByRole('article', { name: '笔记 week1/day3.md' }).textContent).toContain('赋值不会复制对象')
    expect(window.location.search).toContain('week1%2Fday3.md')
  })

  it('opens the matching day note from a week and keeps the debug workbench available', async () => {
    window.history.replaceState({}, '', '/week/week-1')
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '查看 Day 2 笔记' }))
    const notesPanel = screen.getByRole('complementary', { name: '本周 Markdown 笔记' })
    expect(within(notesPanel).getByRole('article', { name: '笔记 week1/day2.md' }).textContent).toContain('map 不是筛选')
    expect(window.location.search).toContain('note=week1%2Fday2.md')

    await user.click(screen.getByRole('button', { name: '展开练习调试台，Day 2' }))
    expect(screen.queryByRole('complementary', { name: '本周 Markdown 笔记' })).toBeNull()
    expect(screen.getByRole('complementary', { name: '练习调试台' })).toBeTruthy()
  })

  it('links a running component to its matching note', async () => {
    window.history.replaceState({}, '', '/debug?file=week3%2Fday11.tsx')
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: '查看笔记' }))
    expect(screen.getByRole('article', { name: '笔记 week3/day11.md' }).textContent).toContain('React state')
  })

  it('uses a shared note for both days in a day range', async () => {
    window.history.replaceState({}, '', '/week/week-3')
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '查看 Day 15 笔记' }))
    expect(screen.getByRole('article', { name: '笔记 week3/day14-15.md' })).toBeTruthy()
  })
})
