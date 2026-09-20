import { useState } from 'react'
import './App.css'

type WeekPlan = {
  week: string
  title: string
  description: string
  topics: string[]
  color: string
}

const plans: WeekPlan[] = [
  {
    week: '01–02',
    title: 'JavaScript 基础',
    description: '补齐 JS 核心直觉，能独立处理常见数据和异步逻辑。',
    topics: ['对象引用与浅拷贝', 'map / filter / find / reduce', '函数、回调、Promise', 'async / await、事件循环'],
    color: 'coral',
  },
  {
    week: '03–04',
    title: 'React 核心',
    description: '理解状态变化和 UI 更新，稳定写出常见 React 功能。',
    topics: ['组件与 Props', 'State 与事件', '条件 / 列表渲染', '表单、数组与对象更新、Effect'],
    color: 'mint',
  },
  {
    week: '05',
    title: '异步与 React Query',
    description: '把请求、缓存和错误处理真正串起来。',
    topics: ['loading / error / data', '请求竞态与防抖', 'queryKey / queryFn', 'mutation / invalidateQueries'],
    color: 'lavender',
  },
  {
    week: '06',
    title: 'TypeScript 与工程化',
    description: '掌握日常开发够用的 TS、Git 和 Vite。',
    topics: ['interface / type / 泛型', 'Record、Pick、Omit', 'Git 分支与合并', 'package.json、pnpm、环境变量'],
    color: 'yellow',
  },
  {
    week: '07–10',
    title: '独立完成小项目',
    description: '停止跟着教程写，从需求开始做一个小型后台系统。',
    topics: ['登录', '用户列表、搜索、分页', '新增、编辑、删除', '详情页与 Debug'],
    color: 'dark',
  },
]

function App() {
  const [active, setActive] = useState('roadmap')

  const scrollTo = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo('top')}>
          <span className="brand-mark">mf</span>
          <span>myFuturePath</span>
        </button>
        <nav>
          <button className={active === 'roadmap' ? 'active' : ''} onClick={() => scrollTo('roadmap')}>路线</button>
          <button className={active === 'goal' ? 'active' : ''} onClick={() => scrollTo('goal')}>目标</button>
        </nav>
        <span className="status"><i /> 10 WEEK PLAN</span>
      </header>

      <main id="top">



        <section className="roadmap section-wrap" id="roadmap">
          <div className="timeline">
            {plans.map((plan, index) => (
              <article className={`plan-card ${plan.color}`} key={plan.week}>
                <div className="plan-number">0{index + 1}</div>
                <div className="week-label">WEEK {plan.week}</div>
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <ul>{plan.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

       

      </main>

      <footer className="footer section-wrap"><span>myFuturePath</span><span>先写出来，再让 AI 提速 ↗</span></footer>
    </div>
  )
}

export default App
