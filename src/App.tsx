import { useEffect, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { trainingWeeks, type TrainingWeek } from './content/exercises'
import { ExerciseDay } from './components/ExerciseDay'
import { CompletionButton } from './components/CompletionButton'
import { useExerciseProgress, type ExerciseProgress } from './state/useExerciseProgress'
import './App.css'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('xml', markup)

type WeekPlan = {
  id: string
  week: string
  title: string
  description: string
  topics: string[]
  color: 'coral' | 'mint' | 'lavender' | 'yellow'
}

const plans: WeekPlan[] = [
  { id: 'week-1', week: '01', title: 'JS 数组、对象、函数', description: '建立数据处理与不可变更新的直觉。', topics: ['map / filter / find', '对象引用与展开', '函数与回调'], color: 'coral' },
  { id: 'week-2', week: '02', title: '异步 JavaScript', description: '理解 Promise、执行顺序和请求流程。', topics: ['Promise', 'async / await', '事件循环', '模拟接口'], color: 'mint' },
  { id: 'week-3', week: '03', title: 'React 基础裸写', description: '每天从空 App 开始练习状态与事件。', topics: ['useState', '条件与列表渲染', '表单', 'Todo'], color: 'lavender' },
  { id: 'week-4', week: '04', title: 'React 状态设计', description: '区分真正的 state 与可以计算的数据。', topics: ['购物车', '搜索与筛选', 'Tabs', 'useEffect'], color: 'yellow' },
  { id: 'week-5', week: '05', title: '真实接口开发', description: '从手动请求过渡到 React Query。', topics: ['GET 请求', '搜索与分页', 'useQuery', 'mutation'], color: 'coral' },
  { id: 'week-6', week: '06', title: 'TS、Git 与工程化', description: '把基础接入工程，并完成最终考试。', topics: ['TypeScript', '泛型', 'Git', 'pnpm / Vite'], color: 'mint' },
]

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const syntaxLanguage: Record<string, string | undefined> = { js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx', bash: 'bash', sh: 'bash', json: 'json', css: 'css', html: 'xml', text: undefined }
  const languageName: Record<string, string> = { js: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', tsx: 'TSX', bash: 'Shell', sh: 'Shell', json: 'JSON', css: 'CSS', html: 'HTML', text: 'Text' }

  const copyCode = async () => {
    await navigator.clipboard?.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="code-window">
      <div className="code-window-bar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <b><span aria-hidden="true">&lt;/&gt;</span>{languageName[language] ?? language}</b>
        <button type="button" onClick={copyCode} aria-label="复制代码" aria-live="polite">
          <span className="copy-icon" aria-hidden="true" />
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        language={syntaxLanguage[language]}
        style={vscDarkPlus}
        wrapLongLines
        customStyle={{ margin: 0, borderRadius: 0, background: '#1f1f22', fontSize: '13px', lineHeight: 1.72 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const markdownComponents: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children, ...props }) => {
    const language = className?.replace('language-', '') || 'text'
    if (!className) return <code className="inline-code" {...props}>{children}</code>
    return <CodeBlock language={language} code={String(children).replace(/\n$/, '')} />
  },
}

type ThemeProps = { dark: boolean; onToggle: () => void }
const routerBasename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" /></svg>
  )
}

function ThemeControl({ dark, onToggle }: ThemeProps) {
  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={dark ? '切换浅色主题' : '切换深色主题'} aria-pressed={dark} title={dark ? '切换浅色主题' : '切换深色主题'}>
      <ThemeIcon dark={dark} />
    </button>
  )
}

function WeekCompletionButton({ week, progress }: { week: TrainingWeek; progress: ExerciseProgress }) {
  const done = week.days.every((day) => progress.completed[day.id])
  return <CompletionButton
    label={`第 ${week.number} 周`}
    variant="week"
    done={done}
    description={`将第 ${week.number} 周的 ${week.days.length} 天及全部小题标记为已完成，并自动收起题目。其他周不受影响，之后仍可展开复习或取消完成。`}
    resetDescription={`将第 ${week.number} 周的 ${week.days.length} 天及全部小题恢复为未完成，包括之前单独完成的小题。其他周不受影响。`}
    onChange={(completed) => progress.setWeekCompleted(week, completed)}
  />
}

function HomePage({ dark, onToggle, progress }: ThemeProps & { progress: ExerciseProgress }) {
  return (
    <div className={`app-shell ${dark ? 'theme-dark' : ''}`}>
      <ThemeControl dark={dark} onToggle={onToggle} />
      <main className="home-page section-wrap">
        <section className="roadmap" id="roadmap">
          <div className="section-title">
            <div><span className="home-brand">myFuturePath</span><h1>6 周训练题单</h1></div>
            <p>点击卡片查看每天的题目与代码练习。</p>
          </div>
          {progress.saveError && <p className="progress-error" role="alert">暂时无法保存到本地，当前进度仅在本次页面中保留。</p>}
          <div className="timeline">
            {plans.map((plan, index) => {
              const week = trainingWeeks[index]
              const done = week.days.every((day) => progress.completed[day.id])
              return <div className={`plan-card ${plan.color} ${done ? 'is-complete' : ''}`} key={plan.id}>
                <span className="plan-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="week-label">第 {plan.week} 周</span>
                <span className="plan-heading"><strong><Link className="plan-card-link" to={`/week/${plan.id}`}>{plan.title}</Link></strong><small>{plan.description}</small></span>
                <span className="plan-topics">{plan.topics.map((topic) => <span key={topic}>{topic}</span>)}</span>
                <div className="plan-card-actions">
                  <span className="plan-open">{done ? '复习' : '查看'} 5 天练习<i aria-hidden="true">→</i></span>
                  <WeekCompletionButton week={week} progress={progress} />
                </div>
              </div>
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

function WeekPage({ dark, onToggle, progress }: ThemeProps & { progress: ExerciseProgress }) {
  const { weekId } = useParams()
  const plan = plans.find((item) => item.id === weekId)
  const week = trainingWeeks.find((item) => item.number === Number(plan?.week))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [weekId])

  if (!plan || !week) return <Navigate to="/" replace />

  const finishedDays = week.days.filter((day) => progress.completed[day.id]).length

  return (
    <div className={`app-shell ${dark ? 'theme-dark' : ''}`}>
      <ThemeControl dark={dark} onToggle={onToggle} />
      <main className="detail-page section-wrap">
        <Link className="back-link" to="/"><span aria-hidden="true">←</span>返回训练计划</Link>
        <div className="detail-hero">
          <div><p className="eyebrow"><span />WEEK {plan.week} · 5 TRAINING DAYS</p><h1>{plan.title}</h1><p>{plan.description}</p></div>
          <span className={`detail-color ${plan.color}`}><small>WEEK</small>{plan.week}</span>
        </div>
        <div className="detail-rule"><span aria-hidden="true">!</span><p><b>训练规则</b>每题先自己写，卡 30 分钟再问 AI。答案不要提前看。</p></div>
        <div className="week-completion">
          <span role="status" aria-live="polite">本周已完成 <strong>{finishedDays} / {week.days.length}</strong> 天</span>
          <WeekCompletionButton key={week.number} week={week} progress={progress} />
        </div>
        {progress.saveError && <p className="progress-error" role="alert">暂时无法保存到本地，当前进度仅在本次页面中保留。</p>}
        {week.intro && <div className="markdown-content week-note"><ReactMarkdown components={markdownComponents}>{week.intro}</ReactMarkdown></div>}
        <div className="day-list">
          {week.days.map((day) => <ExerciseDay key={day.id} day={day} progress={progress} components={markdownComponents} />)}
        </div>
        {week.outro && <div className="markdown-content week-note"><ReactMarkdown components={markdownComponents}>{week.outro}</ReactMarkdown></div>}
      </main>
    </div>
  )
}

function getInitialTheme() {
  const saved = window.localStorage.getItem('myFuturePath-theme')
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function App() {
  const [dark, setDark] = useState(getInitialTheme)
  const progress = useExerciseProgress()

  useEffect(() => {
    window.localStorage.setItem('myFuturePath-theme', dark ? 'dark' : 'light')
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }, [dark])

  const themeProps = { dark, onToggle: () => setDark((value) => !value) }
  return <BrowserRouter basename={routerBasename}><Routes><Route path="/" element={<HomePage {...themeProps} progress={progress} />} /><Route path="/week/:weekId" element={<WeekPage {...themeProps} progress={progress} />} /></Routes></BrowserRouter>
}

export default App
