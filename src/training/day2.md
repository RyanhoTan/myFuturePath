## Day 2 训练内容

```jsx
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
```

围绕 `map / filter / find / some` 做数组筛选、查找、删除、计数和存在性判断。

训练数据：

```tsx
const tecs = [
  { id: 1, title: "React", completed: false },
  { id: 2, title: "TS", completed: true },
  { id: 3, title: "Git", completed: false },
  { id: 4, title: "JS", completed: true },
];
```

## 易错点 1｜把 map 当成筛选

我的原始写法：

```tsx
const todosByMap = tecs.map(tec =>
  tec.completed ? null : tec
)
```

原本想用它“找出所有未完成 Todo”。

实际得到的结构类似：

```tsx
[
  { id: 1, ... },
  null,
  { id: 3, ... },
  null
]
```

原因：`map` 不负责删除不符合条件的元素。它会把每一项转换后的返回值收集起来。返回 `null`，这一项就会变成 `null`，而不是消失。

正确思路：

```tsx
const todos = tecs.filter(tec => !tec.completed)
```

记忆：

- `map`：每一项要**变成什么**。
- `filter`：哪些项要**留下来**。

## 易错点 2｜用 map 找单个元素

我的写法：

```tsx
const findId3ByMap = tecs.map(
  tec => tec.id === 3 ? tec : null
)
```

结果会包含多个 `null`，因为 map 仍然会为每一个原元素产生一个结果。

后来分别尝试：

```tsx
const findId3ByFilter = tecs.filter(tec => tec.id === 3)
const findId3ByFind = tecs.find(tec => tec.id === 3)
```

区别：

- `filter` 返回数组，即使只有一个结果也是数组。
- `find` 返回第一个符合条件的**元素本身**。
- `find` 找不到时返回 `undefined`。

这类“根据唯一 id 找一个对象”的需求优先想到 `find`。

## 易错点 3｜删除元素时用 map 返回 null

我的写法：

```tsx
const delId2ByMap = tecs.map(
  tec => tec.id === 2 ? null : tec
)
```

这并没有真正从新数组中去掉 id=2，只是把它对应的位置变成了 `null`。

正确思路：

```tsx
const delId2ByFilter = tecs.filter(
  tec => tec.id !== 2
)
```

这里不是修改原数组，而是创建一个新数组，只留下 id 不等于 2 的元素。

## 易错点 4｜为什么 map(...).length 还是 4

我的原始代码：

```tsx
const todoCountByMap = tecs
  .map(tec => tec.completed ? null : true)
  .length
```

当时的疑问：

> 这里为啥还是 4？
> 

原因是 map 的结果：

```tsx
[true, null, true, null]
```

依然有 4 项。即使值是 `null`，它仍然占数组中的一个位置。

正确统计未完成数量：

```tsx
const todoCountByFilter = tecs
  .filter(tec => !tec.completed)
  .length
```

## 易错点 5｜误以为 find 返回 true / false

我的原始代码：

```tsx
const isExistId5 = tecs.find(tec => {
  return tec.id === 5 ? true : false
})
```

这里回调函数确实会产生 `true / false`，但那只是告诉 `find`“当前元素是否符合条件”。

`find` 自己最终返回的是：

- 找到 → 符合条件的第一个元素本身。
- 找不到 → `undefined`。

所以判断“是否存在”不应该依赖 find 的元素返回值来表达布尔语义。

## 易错点 6｜判断是否存在应该想到 some

查文档后写出的正确代码：

```tsx
const isExistId5BySome = tecs.some(
  tec => tec.id === 5
)
```

`some` 的结果就是布尔值：

- 至少一个元素符合条件 → `true`
- 一个都不符合 → `false`

例如：

```tsx
const hasMinor = users.some(user => user.age < 18)
```

表示“是否至少存在一个未成年人”。

## 易错点 7｜map 中的条件表达式不是筛选条件

验证题：

```tsx
const numbers = [1, 2, 3, 4];

const result = numbers.map(n => n > 2);
```

我一开始不确定，猜过：

```tsx
[3, 4]
```

或：

```tsx
[1, 2, 3, 4]
```

实际结果：

```tsx
[false, false, true, true]
```

原因：

```
1 → 1 > 2 → false
2 → 2 > 2 → false
3 → 3 > 2 → true
4 → 4 > 2 → true
```

map 把每次回调的**返回值**收集成新数组。

如果写：

```tsx
numbers.filter(n => n > 2)
```

才会得到：

```tsx
[3, 4]
```

## 最终心智模型

```
map
每一项 → 转换后的值 → 新数组

filter
每一项 → 判断条件
符合条件的原元素留下 → 新数组

find
每一项 → 判断条件
找到第一个符合条件的元素 → 返回元素
找不到 → undefined

some
每一项 → 判断条件
至少一个符合 → true
全部不符合 → false
```

## Day 2 复习检查

- [ ]  能解释为什么 `map(() => null)` 不会删除数组元素。
- [ ]  能解释为什么 `map(...).length` 通常和原数组长度一样。
- [ ]  能根据需求区分 `map` 和 `filter`。
- [ ]  能解释 `filter` 和 `find` 返回值的区别。
- [ ]  能解释 `find` 找不到为什么是 `undefined`。
- [ ]  判断“是否至少存在一个”时能想到 `some`。
- [ ]  看到 `map(n => n > 2)` 能判断结果是布尔值数组。
- [ ]  能用自己的话解释 `map / filter / find / some`。