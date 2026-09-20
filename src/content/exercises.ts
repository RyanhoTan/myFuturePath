import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from 'mdast'
import trainingPlan from './training-plan.md?raw'

export type ExerciseTask = { id: string; label: string; offset: number }
export type TrainingDay = {
  id: string
  number: number
  title: string
  markdown: string
  tasks: ExerciseTask[]
}
export type TrainingWeek = {
  number: number
  intro: string
  days: TrainingDay[]
  outro: string
}

const parser = unified().use(remarkParse)

// IDs depend on the day and task text, not the current position in a week.
function textId(text: string) {
  let hash = 2166136261
  for (const character of text.trim().replace(/\s+/g, ' ')) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619)
  }
  return (hash >>> 0).toString(36)
}

function trimSection(markdown: string) {
  return markdown.trim().replace(/(?:\n\s*)?---\s*$/, '').trim()
}

function extractTasks(dayId: string, markdown: string): ExerciseTask[] {
  const tasks: ExerciseTask[] = []
  const duplicates = new Map<string, number>()
  for (const block of parser.parse(markdown).children) {
    if (block.type !== 'list') continue
    for (const item of block.children) {
      const offset = item.position!.start.offset!
      const source = markdown.slice(offset, item.position!.end.offset)
      const label = source.replace(/^(?:\d+[.)]|[-*+])\s+/, '').trim()
      const hash = textId(label)
      const occurrence = (duplicates.get(hash) ?? 0) + 1
      duplicates.set(hash, occurrence)
      tasks.push({ id: `${dayId}-task-${hash}-${occurrence}`, label, offset })
    }
  }
  return tasks
}

export function parseTrainingPlan(source: string): TrainingWeek[] {
  const headings = parser.parse(source).children.filter((node) => node.type === 'heading')
  const weekHeadings = headings.filter((node) => /^# 第 \d+ 周：/.test(source.slice(node.position!.start.offset!, node.position!.end.offset)))

  return weekHeadings.map((heading, index) => {
    const start = heading.position!.end.offset!
    const end = weekHeadings[index + 1]?.position!.start.offset ?? source.length
    const weekSource = source.slice(start, end)
    const weekNodes = parser.parse(weekSource).children
    const dayHeadings = weekNodes.filter((node) => node.type === 'heading' && /^#{1,2} Day \d+/.test(weekSource.slice(node.position!.start.offset!, node.position!.end.offset)))
    const lastDayStart = dayHeadings.at(-1)?.position!.start.offset ?? 0
    // Keep the shared introduction and final reflection outside daily completion.
    const outroStart = weekNodes.find((node) => node.type === 'heading' && node.depth === 1 && node.position!.start.offset! > lastDayStart)?.position!.start.offset ?? weekSource.length

    const days = dayHeadings.map((dayHeading, dayIndex) => {
      const headingSource = weekSource.slice(dayHeading.position!.start.offset!, dayHeading.position!.end.offset)
      const [, number, title] = headingSource.match(/^#{1,2} Day (\d+)\s*[—：:]\s*(.*)$/)!
      const id = `day-${number}`
      const markdown = trimSection(weekSource.slice(dayHeading.position!.end.offset!, dayHeadings[dayIndex + 1]?.position!.start.offset ?? outroStart))
      return { id, number: Number(number), title, markdown, tasks: extractTasks(id, markdown) }
    })

    return {
      number: index + 1,
      intro: trimSection(weekSource.slice(0, dayHeadings[0]?.position!.start.offset ?? 0)),
      days,
      outro: trimSection(weekSource.slice(outroStart)),
    }
  })
}

export const trainingWeeks = parseTrainingPlan(trainingPlan)

// Only real list items become checkable. Code, output examples and prose stay intact.
export function remarkExerciseTasks({ tasks }: { tasks: ExerciseTask[] }) {
  return (tree: Root) => {
    const byOffset = new Map(tasks.map((task) => [task.offset, task.id]))
    for (const block of tree.children) {
      if (block.type !== 'list') continue
      for (const item of block.children) {
        const id = byOffset.get(item.position!.start.offset!)
        if (id) item.data = { ...item.data, hProperties: { 'data-task-id': id } }
      }
    }
  }
}
