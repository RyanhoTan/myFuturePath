**一句话：** debounce 会延迟请求，等待期间再次输入就取消上一次计时并重新计时，所以连续输入通常只触发最后一次请求。

❌ `keyword` 每变化一次就立即请求 → `r`、`re`、`rea` 都会发请求。

✅ `setTimeout` 延迟请求，`clearTimeout` 在下一次输入时取消旧计时器。

❌ 以为 `useEffect` 第一次执行时就会执行 `return` 里的代码。

✅ 第一次只执行 effect；依赖变化时先执行上一次 cleanup（也就是return那里），再执行新的 effect。

```tsx
useEffect(() => {
  if (!keyword) return

  const timer = setTimeout(() => {
    loadUsers(keyword)
  }, 500)

  return () => clearTimeout(timer)
}, [keyword])
```

**快记**

- `onChange`：更新 `keyword`
- `useEffect`：`keyword` 变化后处理副作用
- `setTimeout`：延迟执行
- `clearTimeout`：取消旧计时器
- cleanup：effect `return` 出去的清理函数
- 依赖变化：旧 cleanup → 新 effect
- `if (!keyword) return`：空搜索词不请求