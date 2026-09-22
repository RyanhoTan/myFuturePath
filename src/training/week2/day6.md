## 1｜Promise 是未来才会得到的结果

一句话：网络请求需要时间，Promise 用来表示“现在还没有、以后会有”的结果。

```
Promise = 未来的结果
resolve → 成功
reject  → 失败
```

## 2｜resolve / reject 的值会传下去

一句话：`resolve(value)` 的 value 可以被 `.then()` 接到；`reject(error)` 的 error 可以被 `.catch()` 接到。

```jsx
// ✅
resolve("success")
promise.then(value => console.log(value)) // success

reject("网络错误")
promise.catch(error => console.log(error)) // 网络错误
```

## 3｜new Promise 立即执行，then 稍后执行

一句话：`new Promise(...)` 里的代码创建时立即执行，`.then()` 回调要等当前同步代码执行完。

```jsx
console.log("A")

const p = new Promise(resolve => {
  console.log("B")
  resolve("C")
})

p.then(value => console.log(value))

console.log("D")

// A B D C
```

## 4｜finally 不是处理错误

一句话：`catch` 才处理失败；`finally` 只保证执行，不会把失败状态自动变成成功。

```
then    → 接成功结果
catch   → 接失败结果
finally → 不管成功失败都执行
```

## 5｜fetch 本身就在用 Promise

一句话：平时虽然很少自己 `new Promise`，但 `fetch()` 返回的就是 Promise。

```jsx
fetch("/api/users")
  .then(response => response.json())
  .then(data => console.log(data))
```

以后写：

```jsx
const response = await fetch("/api/users")
```

本质上仍然是在等待 Promise。

## 记住这 5 句

```
Promise → 未来的结果
resolve → 成功 → then
reject  → 失败 → catch
finally → 只执行，不负责处理错误
fetch() → 返回 Promise
```