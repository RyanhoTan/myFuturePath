一句话：`fetch` 先得到 HTTP `Response`，检查 `response.ok` 后用 `response.json()` 解析 body，再把实际数据存入 state。

## ❌ 易错

```tsx
const response = await fetch('/api/users')
setData(response.data) // 原生 fetch 的 Response 没有 data
```

- 以为 404 / 500 一定自动进入 `catch`；`fetch` 收到这类 HTTP 响应时通常仍会正常返回，需要检查 `response.ok` 并主动 `throw`。

## ✅ 正确

```tsx
setLoading(true)
setError(null)

try {
  const response = await fetch('/api/users')
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const result = await response.json()
  setData(result)
} catch (error) {
  setError(error instanceof Error ? error.message : '请求失败')
} finally {
  setLoading(false)
}
```

## 快记

- `loading / error / data` → 正在请求 / 请求出错 / 请求成功的数据
- `response` → HTTP 响应；`result` → 解析 body 后的实际数据；`setData(result)` → 保存到 state
- 请求前打开 `loading`；`try` 请求并保存数据，`catch` 保存错误，`finally` 关闭 `loading`
- Network 看 `URL / Method / Status / Response`
- Status 200 但页面没数据 → 先看 Response 数据结构，再查 `setData` 和列表的 `map` 渲染
