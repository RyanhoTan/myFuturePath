**一句话：** React state 不要直接修改，用 `setCount` 设置新值；新值依赖旧值时要注意当前渲染里的 `count` 不会立刻变化。

### 1. 不要用 count++ 修改 state

❌

```tsx
setCount(count++)
```

✅

```tsx
setCount(count + 1)
```

### 

### 2. 连续 setCount 不等于连续累加

❌

```tsx
setCount(count + 1)
setCount(count + 1)
```

两次读到的都是当前渲染里的同一个 `count`。

✅ 依赖上一次更新结果时：

```tsx
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

### 快速记忆

- `count` → 当前渲染的 state
- `setCount` → 告诉 React 下一次 state 是什么
- 不直接 `count++ / count--`
- `条件 && 代码` → 条件为 true 才执行右边
- 更新依赖旧值 → 优先想到 `prev => ...`