**一句话：** boolean state 用 `true / false` 控制界面显示，多个互不相关的状态应该分别做条件渲染，不要硬套在一个三元表达式里。

### 1. 三元表达式的 JSX 结构

❌

```tsx
expand ? {<div>详情</div>} : <button>显示</button>
```

✅

```tsx
expand ? (
  <div>详情</div>
) : (
  <button>显示</button>
)
```

### 4. JSX 注释

❌

```tsx
// 已登录
```

✅

```tsx
{/* 已登录 */}
```

### 5. JSX 里的 `{}` 和 `<>...</>`

**一句话：** 已经进入 JSX 后，要插入 JavaScript 表达式就用 `{}`；多个并列 JSX 需要一个共同外壳时用 `<>...</>`。

❌ 不要把两者混成一回事。

✅

```tsx
return (
  <>
    <div>当前：{count}</div>
    {expand ? <div>详情</div> : <button>显示</button>}
  </>
)

```

```jsx
return (
  // 这里还没进入页面，就不用写{} 作为入口
    expand ? <div>详情</div> : <button>显示</button>
  
)
```

### 快速记忆

- `useState(false)` → 默认关闭/隐藏
- `true` → 显示，`false` → 隐藏
- `条件 ? A : B` → 二选一渲染
- 多个并列 JSX → 用 `<>...</>` 包起来
- `expand` 管详情，`login` 管登录，各管各的
- 事件名是 `onClick`，不是 `conClick`

### 补充快速记忆

- `{}` → JSX 里面写 JS（JS入口）
- `()` → 分组 / 方便多行书写
- `<>...</>` → 包住多个并列 JSX
- 直接 `return (条件 ? A : B)` 时，本身就在写 JS 表达式，不需要额外 `{}`