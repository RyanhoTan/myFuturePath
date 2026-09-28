**一句话：** 泛型里的 `T` 是类型占位符；传入具体类型后，TypeScript 会沿着函数、数组和对象结构继续推导类型。

### 易错点 1｜`items` 和 `items[0]` 不是一回事

```ts
function getFirst<T>(items: T[]): T {
  return items[0]
}
```

- `T[]`：由 `T` 组成的数组
- `items`：传入的整个数组
- `items[0]`：数组第一项，类型是 `T`

### 易错点 2｜Tuple 不等于普通数组

```ts
[string, number]
```

这是 Tuple：固定两项，且第一项必须是 `string`，第二项必须是 `number`；它不等于每一项都是字符串的 `string[]`。

### 易错点 3｜泛型不一定叫 `T`

`T` 只是常用名称，不是固定语法，也可以写成 `A`、`TData` 等。关键是同一个占位符在声明中表示同一种类型。

### 易错点 4｜从泛型一路看懂数据类型

```text
ApiResponse<User[]>  → T = User[]
data                 → User[]
data[0]              → User
data[0].name         → string
```

### 快记

- `T` = 泛型类型占位符
- `T[]` = 由 `T` 组成的数组
- `[string, number]` = 固定长度、固定位置类型的 Tuple
- 泛型确定后，可以顺着数据结构继续推导内部类型
