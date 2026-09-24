**一句话：** `useQuery` 把以前手动管理的 `data / loading / error` 和请求状态交给 React Query，自己主要告诉它“这是谁的数据”和“怎么获取”。

### 易错点 1｜`queryKey` 不是“什么时候执行”

❌ `queryKey` = 什么时候发请求。

✅ `queryKey` = 查询的“身份证”，用来标识这份数据和对应缓存。

```tsx
queryKey: ["users"]
queryKey: ["user", userId]
```

`userId` 变化 → key 变化 → 切换到对应查询；React Query 可以按 key 找缓存，需要时再请求。

### 易错点 2｜`queryFn` 和 `data`

```tsx
queryFn: fetchUsers
```

- `queryFn`：获取数据的函数
- `data`：`queryFn` 最终 `return` 出来的值

❌ `data` 一定等于整个 response body。

✅ 如果 `queryFn` 只 `return result.users`，那 `data` 就是 `result.users`。

### 易错点 3｜React Query 帮我管理了什么

以前自己写：

```
useState(data)
useState(loading)
useState(error)
setData / setLoading / setError
try / catch / finally
```

现在：

```
data      → 查询得到的数据
isLoading → 首次加载状态
error     → queryFn 抛出的错误
```

### 易错点 4｜404 / 500 不一定自动进入 `error`

原生 `fetch` 遇到 404 / 500 通常不会自动 `throw`。

❌

```tsx
const res = await fetch("/users")
return res.json()
```

✅

```tsx
const res = await fetch("/users")

if (!res.ok) {
  throw new Error("请求失败")
}

return res.json()
```

`throw` → `queryFn` 失败 → React Query 的 `error` 有值。

### 快记

- `queryKey` = 这是谁的数据 / 缓存身份证
- `queryFn` = 怎么获取数据
- `data` = `queryFn` return 的数据
- `isLoading` = 首次加载状态
- `error` = `queryFn` 抛出的错误
- 原生 `fetch` 的 404 / 500 → 检查 `res.ok` 后自己 `throw`