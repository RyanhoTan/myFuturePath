**一句话：** 分页先分清 `page`（第几页）和 `pageSize`（每页几条），总页数用 `Math.ceil(total / pageSize)`，`page` 变化后重新请求。

### 易错点 1｜把 `pageSize` 理解成“跳过几条”

❌ `page=2&pageSize=1` = 第 11 条数据。

✅ `page=2&pageSize=1` = 每页 1 条的第 2 页，也就是第 2 条数据。

真正从第几条开始通常可以这样理解：

```tsx
const offset = (page - 1) * pageSize
```

### 易错点 2｜总页数不能向下取整

❌

```tsx
Math.floor(47 / 10) // 4
```

这样最后剩下的 7 条就没页了。

✅

```tsx
Math.ceil(47 / 10) // 5
```

只要还有剩余数据，就要再占一页。

### 易错点 3｜`res` 不是最终的数据

❌ 把 `res` 当成接口返回的 posts 数组。

✅

```tsx
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    setPosts(data)
  })
```

```
res        → HTTP Response 响应对象
res.json() → 读取并解析 response body，返回 Promise
data       → 上一个 .then() 解析出来的 JS 数据
```

### 易错点 4｜为什么第二个 `.then()` 能拿到 `data`

前一个 `.then()`：

```tsx
.then((res) => res.json())
```

返回了 `res.json()` 的 Promise。

所以下一个 `.then()` 会等它完成，并拿到解析结果：

```tsx
.then((data) => setPosts(data))
```

### 分页请求

```tsx
useEffect(() => {
  fetch(`/api/posts?page=${page}&pageSize=${pageSize}`)
}, [page])
```

`page` 改变 → `useEffect` 重新执行 → 请求新的一页。

### 边界

```tsx
disabled={page <= 1}
disabled={page >= totalPages}
```

### 快记

- `page` = 当前第几页
- `pageSize` = 每页几条
- `offset = (page - 1) * pageSize`
- `totalPages = Math.ceil(total / pageSize)`
- `res` = 响应对象，不是最终数据
- `res.json()` = 解析 body
- `data` = 解析后的数据
- `.then()` = 前面的 Promise 完成后，拿结果继续
- 调试分页：Network → Query Parameters 看 `page` / `pageSize`