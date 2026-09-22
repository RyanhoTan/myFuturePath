const products = [
  { id: 1, name: "鼠标", price: 100, stock: 3 },
  { id: 2, name: "键盘", price: 200, stock: 0 },
  { id: 3, name: "显示器", price: 1000, stock: 2 },
  { id: 4, name: "耳机", price: 300, stock: 5 },
];
// 找有库存商品
console.log(products.filter(product => product.stock > 0))
// 找 id=3
console.log(products.filter(product => product.id === 3))
// 得到所有商品名称
console.log(products.map(p => p.name))
// 把所有商品价格打九折
// 这里不会做阿
console.log(products.map(p => p ? {...p, price : p.price*0.9} : p))
// 删除 id=2
console.log(products.filter(p => p.id !== 2))
// 修改 id=4 的库存为 4
// 还是不会
console.log(products.map(p => p.id === 4 ? {...p, stock : 4} : p))
// 统计有库存商品数量
console.log(products.filter(product => product.stock > 0).length)
// ⭐ 整个过程不能修改原 products

const users = [
  { name: "Ryan", age: 20 },
  { name: "Tom", age: 17 },
  { name: "Jack", age: 25 },
]

// 要求：所有人的 age 都 +1，不能修改原 users。
console.log(users.map(user =>  ({...user, age : user.age + 1}) ))