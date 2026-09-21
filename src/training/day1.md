## 我的错误代码

```tsx
const namesArr = users.map((name) => name = users.name)

console.log(namesArr)
```

这段代码得到的是 `undefined`。这里暴露了两个容易混淆的点：回调参数 `name` 实际代表的是当前用户对象，而 `users` 是整个数组；真正要读取的是当前对象上的 `name` 属性。

## 问题表现

在 `users.map(...)` 中，容易把 `users`（整个数组）和回调参数 `user`（当前遍历到的元素）混在一起。例如写成 `users.name`，结果得到 `undefined`。

## 核心模型

- `users`：整个数组。
- `users.map((user) => ...)` 中的 `user`：当前这一项对象。
- 要取当前用户姓名，应使用 `user.name`，不是 `users.name`。
- `map` 会把每一次回调返回的结果收集起来，组成一个新数组。

## 例子

```tsx
const names = users.map((user) => user.name);
// ["Ryan", "Tom", "Jack"]
```

可以这样理解：`users` 是一整盒用户，`map` 每次从盒子里拿出一个 `user`，然后决定这个 `user` 要变成什么结果。

## 复习检查

- [ ]  能解释 `users` 和 `user` 分别代表什么。
- [ ]  能独立写出 `users.map((user) => user.age)` 得到 `[20, 17, 25]`。
- [ ]  能独立用 `map` 提取对象数组中的某个字段。
- [ ]  看到 `users.name` 时能判断为什么这里是错误的。
- [ ]  能解释 `map` 最终为什么返回一个新数组。

## 训练优先级

**P0**：放进 JavaScript 数组方法训练中反复练习，直到能自然区分“整个数组”和“当前元素”。

## Day 1 新增易错点

### 1. 模板字符串语法写错

我的原始写法：

```tsx
user => `{user.name}-{user.age}`
```

问题：模板字符串中的表达式需要使用 `${...}`，不能只写 `{...}`。

正确写法：

```tsx
users.map(user => `${user.name}-${user.age}`)
```

### 2. `map` 使用 `{}` 后忘记 `return`

我的错误写法：

```tsx
const newUserName = users.map(user => {
  user.id === 2 ? user.name = "Jerry" : user
})
```

问题：箭头函数使用 `{}` 作为函数体时，不会自动返回，需要显式写 `return`。否则这一轮回调默认返回 `undefined`。

对比：

```tsx
user => user.name       // 自动返回
user => { user.name }   // 没有 return，返回 undefined
user => { return user.name } // 显式返回
```

### 3. `user.name = "Jerry"` 会修改原对象

我的错误思路：

```tsx
user.id === 2 ? user.name = "Jerry" : user
```

问题：`map` 回调中的 `user` 指向原 `users` 数组里的那个对象。执行 `user.name = "Jerry"` 会直接修改原对象。

如果要求不修改原数据，需要创建新对象：

```tsx
user.id === 2 ? { ...user, name: "Jerry" } : user
```

### 4. 赋值表达式本身也有返回值

曾经疑惑为什么下面的 `map` 结果第二项直接变成了字符串 `"Jerry"`：

```tsx
return user.id === 2 ? user.name = "Jerry" : user
```

得到类似：

```tsx
[
  { id: 1, name: "Ryan", age: 20 },
  "Jerry",
  { id: 3, name: "Jack", age: 25 }
]
```

原因：`user.name = "Jerry"` 做了两件事：

1. 修改原对象的 `name`。
2. 整个赋值表达式的值也是 `"Jerry"`。

因此这一轮 `map` 实际 `return` 的是字符串 `"Jerry"`。

### 5. 对象 `===` 比较的是引用，不是内容

我最初认为：

> `users[1] === newUsers[1]` 是 `false`，因为第二个对象的名字不同。
> 

这个理由不准确。对象使用 `===` 时比较的是是否为**同一个对象引用**，不是属性内容是否一样。

即使内容完全一样：

```tsx
const a = { name: "Tom" }
const b = { ...a }

console.log(a === b) // false
```

因为 `{ ...a }` 创建了一个新对象。

### 6. `{ ...user, age: 26 }` 为什么用 `age:` 而不是 `user.age =`

这里是在创建一个**新对象**：

```tsx
{ ...user, age: 26 }
```

可以理解成展开后：

```tsx
{
  id: 3,
  name: "Jack",
  age: 25,
  age: 26
}
```

后面的 `age: 26` 覆盖前面的 `age: 25`。

需要区分：

```tsx
user.age = 26
```

表示修改已有 `user` 对象的属性。

而：

```tsx
{ ...user, age: 26 }
```

表示创建新对象，并把新对象的 `age` 设置为 `26`。

对象字面量内部使用的是 `属性名: 值`；`=` 是赋值运算符。

### Day 1 复习重点

- [ ]  `map` 回调参数代表当前元素，不是整个数组。
- [ ]  模板字符串中的表达式会写 `${...}`。
- [ ]  箭头函数使用 `{}` 后知道什么时候需要 `return`。
- [ ]  能解释 `user.name = "Jerry"` 为什么会修改原对象。
- [ ]  能解释赋值表达式为什么可以返回 `"Jerry"`。
- [ ]  能解释对象 `===` 比较的是引用。
- [ ]  能解释 `{ ...user, age: 26 }` 为什么不会修改原 `user`。
- [ ]  能区分对象字面量里的 `:` 和赋值运算符 `=`。