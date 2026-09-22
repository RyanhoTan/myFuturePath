**一句话：** `async` 函数调用后一定返回 Promise；`await` 用来拿 Promise 成功后的结果，失败可用 `try/catch` 处理。

### 1. 不加 await，拿到的是 Promise

❌

```jsx
const user = getUser()
console.log(user.name)
```

✅

```jsx
const user = await getUser()
console.log(user.name)
```

### 2. async 函数 return 普通值，调用后仍是 Promise

❌

```jsx
async function getNumber() {
  return 100
}
const result = getNumber() // 不是 100
```

✅

```jsx
const result = await getNumber() // 100
```

### 3. try/catch 不是 `.catch()`

❌

```jsx
try {
  // ...
}.catch(error => {})
```

✅

```jsx
try {
  // ...
} catch (error) {
  // 失败处理
}
```

### 4. try 中出错后，后面的代码不会继续

❌

```jsx
try {
  await request() // 这里失败
  console.log("还会执行")
} catch (error) {}
```

✅ 请求失败后直接进入 `catch`。

### 5. 避免变量名和函数名冲突

❌

```jsx
const login = await login()
```

✅

```jsx
const result = await login()
```

### 快速记忆

- `async` → 函数调用后返回 Promise
- `await` → 拿 Promise 成功结果
- `reject` / 报错 → `catch`
- `await` 会暂停当前 async 函数，不会卡住整个程序
- `fetch()` 本身返回 Promise