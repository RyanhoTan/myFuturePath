## 1｜外层函数忘记 return

一句话：代码算出了结果，不代表函数返回了结果；调用者要拿到结果，外层函数必须 `return`。

```jsx
// ❌ find 有结果，但 findUser 没返回
function findUser(users, id) {
  users.find(user => user.id === id)
}

// ✅
function findUser(users, id) {
  return users.find(user => user.id === id)
}
```

## 2｜内层 return 和外层 return 不是一回事

一句话：回调里的 `return` 是给 `find/map/filter` 用的，外层 `return` 才是把最终结果交给函数调用者。

```jsx
// ❌ 只有内层 return
function findUser(users, id) {
  users.find(user => {
    return user.id === id
  })
}

// ✅ 两层职责不同
function findUser(users, id) {
  return users.find(user => {
    return user.id === id
  })
}
```

## 3｜修改元素用 map，不是 filter

一句话：要把数组里的某一项变成新值用 `map`；`filter` 只决定原元素留不留下。

```jsx
// ❌ 对象会被当成 true，filter 留下的仍是原 user
users.filter(user =>
  user.id === id ? { ...user, name: newName } : user
)

// ✅
users.map(user =>
  user.id === id ? { ...user, name: newName } : user
)
```

## 4｜boolean 不需要再写 ? true : false

一句话：条件表达式本身已经是 boolean，可以直接 return。

```jsx
// ❌ 多余
return age >= 18 ? true : false

// ✅
return age >= 18
```

## 记住这 4 句

```
函数要把结果交出去 → return
回调 return ≠ 外层函数 return
修改/转换 → map
筛选/删除 → filter
```