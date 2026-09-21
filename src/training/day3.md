# Day 3｜对象、引用与展开 薄弱点

## 1｜赋值不会复制对象

一句话结论：`const b = a` 让两个变量指向同一个对象，修改一个会影响另一个。

❌ 反例：

```tsx
const b = a;
b.name = "Tom";
// a.name 也变成了 "Tom"
```

✅ 正例：

```tsx
const b = { ...a };
b.name = "Tom";
// a.name 不变
```

## 2｜展开运算符只是浅拷贝

一句话结论：`{ ...a }` 只复制第一层，嵌套对象仍可能共享引用。

❌ 反例：

```tsx
const b = { ...a };
b.info.age = 30;
// a.info.age 也变成了 30
```

✅ 正例：

```tsx
const b = { ...a, info: { ...a.info } };
b.info.age = 30;
// a.info.age 不变
```

## 3｜删除属性也要保持原对象不变

一句话结论：`delete user.age` 会修改原对象，解构加 rest 才能得到不含该属性的新对象。

❌ 反例：

```tsx
delete user.age;
```

✅ 正例：

```tsx
const { age, ...newUser } = user;
```

## 4｜`map` 只保证新数组，不保证每个对象都新

一句话结论：回调返回原对象就会共享引用，返回 `{ ...todo }` 才会创建新的第一层对象。

❌ 反例：

```tsx
const result = todos.map(todo => todo);

todos === result; // false：数组是新的
todos[0] === result[0]; // true：对象还是原来的
```

✅ 正例：

```tsx
const result = todos.map(todo => ({ ...todo }));

todos[0] === result[0]; // false
```

## 速记

- `const b = a`：同一个对象。
- `{ ...a }`：新的第一层对象，嵌套层仍可能共享。
- 删除属性用解构 + rest。
- `map` 产生新数组，但对象是否新取决于 `return`。
