**一句话：** `async` 让函数返回 Promise，`await` 等 Promise 结果，`try/catch/finally` 分别负责尝试执行、处理错误和最终收尾。

### 1. 返回用户 ≠ 打印用户

❌

```jsx
console.log(user)
```

✅

```jsx
return user
```

### 2. try 不是“开始操作”

❌ `try` = 开始异步操作

✅ `try` = 尝试执行可能出错的代码，出错就进入 `catch`

### 3. Promise 不只是网络请求

❌ Promise = 发请求到数据回来前的容器

✅ Promise = 表示一个未来才会得到的结果

### 快速记忆

- `async` → 函数返回 Promise，可在里面用 await
- `await` → 等 Promise 的结果
- `Promise` → 未来的结果
- `try` → 尝试执行
- `catch` → 处理错误
- `finally` → 成功失败都会执行
- `await` 只暂停当前 async 函数，不会卡住整个 JavaScript