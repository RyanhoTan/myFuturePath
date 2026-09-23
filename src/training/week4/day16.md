一句话：购物车用一个数组 state 保存源数据，数量和总价从 cart 计算出来；增减用 map，删除用 filter，累计统计用 reduce。

## ❌ 易错

```tsx
// 把单个商品当成整个购物车 state
setProduct(product => product.count + 1)

// 总数量、总价再单独建 state
const [totalCount, setTotalCount] = useState(...)
const [totalPrice, setTotalPrice] = useState(...)
```

## ✅ 正确

```tsx
// 修改某个商品数量
{ ...product, count: product.count + 1 }

// 删除商品
cart.filter(p => p.id !== id)

// 商品总数
cart.reduce((total, product) => {
  return total + product.count
}, 0)

// 总价格
cart.reduce((total, product) => {
  return total + product.price * product.count
}, 0)
```

## 快记

- `cart` = 整个购物车数组；`product` = 当前商品
- 真正会变化的源数据 → state
- 能从 cart 算出来的总数量、总价 → 不重复建 state
- 修改数量 → `map`
- 删除 → `filter`
- 累加成一个结果 → `reduce`
- `reduce(..., 0)` 里的 `0` = `total` 的初始值
- `useMemo` 不是另一种 state；这类简单统计暂时直接计算即可