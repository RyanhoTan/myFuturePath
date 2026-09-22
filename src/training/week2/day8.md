**一句话：** 基础题里先执行同步代码，再执行 `Promise.then`，最后执行 `setTimeout`。

### 1. setTimeout 不是立即执行

❌

```jsx
console.log(1)
setTimeout(() => console.log(2), 0)
console.log(3)
// 误判：1 2 3
```

✅ 输出：`1 3 2`

### 2. Promise.then 也要等同步代码执行完

❌ 认为 `.then()` 会插在同步代码中间立即执行。

✅

```jsx
console.log("A")
Promise.resolve().then(() => console.log("B"))
console.log("C")
// A C B
```

### 3. Promise.then 比 setTimeout 先

❌ 误判：`1 4 2 3`

✅

```jsx
console.log(1)
setTimeout(() => console.log(2))
Promise.resolve().then(() => console.log(3))
console.log(4)
// 1 4 3 2
```

### 快速记忆

`同步代码 → Promise.then → setTimeout`

目前只建立执行顺序直觉，不深入宏任务、微任务等规范细节。