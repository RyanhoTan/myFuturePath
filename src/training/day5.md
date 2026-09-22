## 1｜找一个元素优先用 find

一句话：只需要一个指定元素用 `find`；`filter` 返回的是数组。

```jsx
// ❌ 能找到，但返回数组
products.filter(product => product.id === 3)

// ✅ 返回指定商品对象
products.find(product => product.id === 3)
```

## 2｜修改所有元素，不需要三元判断

一句话：所有元素都要修改时，直接 `map` 返回新值，不需要先判断当前元素存不存在。

```jsx
// ❌ user 本来就是当前对象，这个判断多余
users.map(user =>
  user ? { ...user, age: user.age + 1 } : user
)

// ✅
users.map(user => ({
  ...user,
  age: user.age + 1
}))
```

## 3｜对象属性要从当前元素上取

一句话：`map` 里的 `product` 是当前商品，价格要写 `product.price`。

```jsx
// ❌ price 没有定义
products.map(product => ({
  ...product,
  price: price * 0.9
}))

// ✅
products.map(product => ({
  ...product,
  price: product.price * 0.9
}))
```

## 4｜箭头函数直接返回对象要加 ()

一句话：`=> { }` 会被当成函数体；直接返回对象要写 `=> ({ })`，或者显式写 `return`。

```jsx
// ❌ {} 被当成函数体
users.map(user => {
  ...user,
  age: user.age + 1
})

// ✅
users.map(user => ({
  ...user,
  age: user.age + 1
}))

// ✅
users.map(user => {
  return {
    ...user,
    age: user.age + 1
  }
})
```

## 记住这 4 句

```
找一个 → find
所有都改 → map，不需要条件判断
当前对象的属性 → product.price / user.age
箭头函数直接返回对象 → ({ ... })
```