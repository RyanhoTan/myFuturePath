import { describe, expect, it } from 'vitest'
import { parseTrainingPlan, trainingWeeks } from '../src/content/exercises'
import { readProgress } from '../src/state/useExerciseProgress'

describe('training content', () => {
  it('keeps all 30 days, including the differently formatted final exam', () => {
    expect(trainingWeeks).toHaveLength(6)
    expect(trainingWeeks.map((week) => week.days.length)).toEqual([5, 5, 5, 5, 5, 5])
    expect(trainingWeeks.flatMap((week) => week.days.map((day) => day.number))).toEqual(Array.from({ length: 30 }, (_, index) => index + 1))
    const firstDay = trainingWeeks[0].days[0]
    expect(firstDay.markdown).toContain('const numbers = [1, 2, 3, 4, 5];')
    expect(firstDay.tasks).toHaveLength(6)
    expect(firstDay.markdown).toContain('过关标准')
    expect(trainingWeeks[2].intro).toContain('export default function App()')
    expect(trainingWeeks[5].days[4].markdown).toContain('90 分钟禁止 AI')
    expect(trainingWeeks[5].days[4].markdown).not.toContain('你每天只需要记录')
    expect(trainingWeeks[5].outro).toContain('你每天只需要记录 4 个东西')
  })

  it('ignores headings and list-looking text inside code fences', () => {
    const source = '# 第 1 周：测试\n\n## Day 1 — 练习\n\n```text\n## Day 2 — 不是真实标题\n1. 不是小题\n```\n\n1. 真正的小题\n'
    const weeks = parseTrainingPlan(source)
    expect(weeks[0].days).toHaveLength(1)
    expect(weeks[0].days[0].tasks).toHaveLength(1)
    expect(weeks[0].days[0].tasks[0].label).toBe('真正的小题')
  })

  it('keeps task IDs stable when a different question is inserted', () => {
    const prefix = '# 第 1 周：测试\n\n## Day 1 — 练习\n\n'
    const original = parseTrainingPlan(prefix + '1. 原来的小题\n')[0].days[0]
    const updated = parseTrainingPlan(prefix + '1. 新的小题\n2. 原来的小题\n')[0].days[0]
    expect(original.tasks[0].id).toBe(updated.tasks[1].id)
  })
})

describe('saved progress validation', () => {
  it.each([null, '', '{broken', 'null', '[]', '{"version":2,"completed":["day-1"]}', '{"version":1,"completed":true}'])('handles invalid storage safely: %s', (value) => {
    expect(readProgress(value)).toEqual({})
  })

  it('accepts only known day and question IDs', () => {
    const taskId = trainingWeeks[0].days[0].tasks[0].id
    expect(readProgress(JSON.stringify({ version: 1, completed: ['day-1', taskId, 'missing', 3, '__proto__'] }))).toEqual({ 'day-1': true, [taskId]: true })
  })
})
