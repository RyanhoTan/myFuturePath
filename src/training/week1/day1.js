// 1.[1,2,3,4,5] → [2,4,6,8,10]


// 2.numbers → 每个数字平方

// 3.users → ["Ryan", "Tom", "Jack"]

// 4.users → ["Ryan-20", "Tom-17", "Jack-25"]

// 5.把 id=2 的用户 name 改成 "Jerry"，其他不变

// ⭐ 要求第 5 题不能修改原 users

const numbers = [1, 2, 3, 4, 5];

const users = [
  { id: 1, name: "Ryan", age: 20 },
  { id: 2, name: "Tom", age: 17 },
  { id: 3, name: "Jack", age: 25 },
];

// 1.
 const doubleNums = numbers.map((number) => number * 2)
 console.log(doubleNums)

 // 2.
 const squareNums = numbers.map((number) => number ** 2)
 console.log(squareNums)

 // 3.
//  const namesArr = users.map((name) => name = users.name) name才是单个项（其实叫user更合适
//  console.log(namesArr)

const namesArr = users.map(user => user.name)
console.log(namesArr)

// 4. 
// 这题我原本写成了  user => `{user.name}-{user.age}`
// 模板字符串！！！   `string text ${expression} string text`
// const nameWithAge = users.map(user => [user.name, user.age].join("-") )
// console.log(nameWithAge)
const nameWithSAge = users.map(user => `${user.name}-${user.age}`)
console.log(nameWithSAge)

const newUserName = users.map(user => {
  // 原本我这里写的 user.id === 2 ? {...user, name = "Jerry"}  : user 
  // 这个也是错的，表达式本身的结果是 "Jerry" 所以返回的是 "Jerry", 不会返回 { id: 2, name: 'Jerry', age: 17 },
  // return user.id === 2 ? user.name =  "Jerry"  : user
  return user.id === 2 ? {...user, name : "Jerry"}  : user
})
console.log(newUserName)
