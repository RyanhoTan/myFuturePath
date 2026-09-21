## 1｜map 不是筛选

一句话：`map` 收集每次回调的返回值，返回 `null` 只是把该位置变成 `null`，不会删除元素。

```jsx
// ❌ [todo, null, todo, null]
tecs.map(tec => tec.completed ? null : tec)

// ✅ 真正筛选
tecs.filter(tec => !tec.completed)
```

## 2｜map 通常不会改变数组项数

一句话：`map` 是一项变一项，所以 `[true, null, true, null].length` 仍然是 4。

```jsx
// ❌ 想统计未完成，结果还是 4
tecs.map(tec => tec.completed ? null : true).length

// ✅
tecs.filter(tec => !tec.completed).length
```

## 3｜找一个用 find，筛多个用 filter

一句话：`filter` 返回所有匹配项组成的数组，`find` 返回第一个匹配元素，找不到是 `undefined`。

```jsx
// 多个 → 数组
tecs.filter(tec => !tec.completed)

// 一个 → 元素 / undefined
tecs.find(tec => tec.id === 3)
```

## 4｜删除元素用 filter

一句话：不修改原数组地删除某项，本质就是“只留下其他项”。

```jsx
// ❌ 只是变成 null
tecs.map(tec => tec.id === 2 ? null : tec)

// ✅
tecs.filter(tec => tec.id !== 2)
```

## 5｜find 不返回条件的 true / false

一句话：`find` 的回调用布尔值判断是否匹配，但 `find` 自己返回的是元素本身或 `undefined`。

```jsx
// ❌ 想拿 boolean
tecs.find(tec => tec.id === 5)

// ✅ 判断是否存在
tecs.some(tec => tec.id === 5)
```

## 6｜some 专门判断“有没有”

一句话：`some` 只回答“是否至少有一个符合条件”，所以返回 `true / false`。

```jsx
const hasMinor = users.some(user => user.age < 18)
```

## 7｜map 里的条件结果也会被收集

一句话：`map(n => n > 2)` 是把每个数字转换成布尔值，不是在筛选数字。

```jsx
// ❌ 如果想得到 [3, 4]
[1,2,3,4].map(n => n > 2)
// [false, false, true, true]

// ✅
[1,2,3,4].filter(n => n > 2)
// [3, 4]
```

## 记住这 4 句

```
map    → 每项转换 → 新数组
filter → 筛选多个 → 新数组
find   → 找第一个 → 元素 / undefined
some   → 是否存在 → boolean
```