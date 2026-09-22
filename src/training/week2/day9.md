**一句话：** 用 `Promise + setTimeout` 模拟接口，`await` 等结果，`resolve/reject` 表示成功/失败，`try/catch/finally` 负责处理整个请求流程。

### 1. 可能失败的 await 要放进 try

❌

```jsx
const users = await fetchUsers()
try {
  // ...
} catch (error) {}
```

✅

```jsx
try {
  const users = await fetchUsers()
} catch (error) {
  console.log(error)
}
```

### 2. loading 要在 await 前打印

❌

```jsx
const users = await fetchUsers()
console.log("loading")
```

✅

```jsx
console.log("loading")
const users = await fetchUsers()
```

### 

### 3. 模拟接口成功 / 失败

```jsx
if (Math.random() > 0.5) {
  resolve(users)
} else {
  reject("请求失败")
}
```

### 快速记忆

- `resolve` → 请求成功
- `reject` → 请求失败
- `await` → 等请求结果
- `catch` → 接失败
- `finally` → 成功失败都会执行
- 流程：`loading → 请求 → 成功/失败 → finished`