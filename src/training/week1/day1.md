## 1｜map 回调参数是当前元素

一句话：`users` 是整个数组，`user` 是当前这一项，取姓名要写 `user.name`。

```jsx
// ❌
users.map(name => users.name)

// ✅
users.map(user => user.name)
```

## 2｜模板字符串要用 ${}

一句话：反引号里插入变量要写 `${表达式}`。

```jsx
// ❌
`{user.name}-{user.age}`

// ✅
`${user.name}-${user.age}`
```

## 3｜箭头函数用了 {} 就要注意 return

一句话：`=> 表达式`会自动返回；`=> { }` 不会自动返回。

```jsx
// ❌ 返回 undefined
users.map(user => { user.name })

// ✅
users.map(user => user.name)
users.map(user => { return user.name })
```

## 4｜赋值会修改原对象

一句话：`user.name = "Jerry"` 会直接改原对象；要保持原数据不变就创建新对象。

```jsx
// ❌ 修改原对象，而且表达式值是 "Jerry"
user.name = "Jerry"

// ✅ 创建新对象
{ ...user, name: "Jerry" }
```

## 5｜对象 === 比较引用

一句话：对象内容一样不代表 `===`，只有指向同一个对象才是 `true`。

```jsx
const a = { name: "Tom" };
const b = a;
const c = { ...a };

a === b // true
a === c // false
```

## 6｜对象里 : 和 = 不是一回事

一句话：`age: 26` 是定义新对象的属性，`user.age = 26` 是修改已有对象。

```jsx
// ❌ 修改原对象
user.age = 26

// ✅ 创建新对象并覆盖 age
const newUser = { ...user, age: 26 }
```

## 记住这 6 句

```
users / user       → 整个数组 / 当前元素
${x}              → 模板字符串插值
=> {}              → 通常要显式 return
user.x = value     → 修改原对象
{ ...user, x: v }  → 新对象
对象 ===           → 比较是不是同一个引用
```