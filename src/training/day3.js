// 1.不修改原 user，把 age 改成 21
// 2.不修改原 todo，把 completed 改成 true
// 3.给 user 增加 city: "Shenzhen"
// 4.从 user 中删除 age 属性（可以查语法）
// 5.⭐ 不修改原数组，把 id=2 Todo 改成完成
// 6.⭐ 检查第 5 题执行后原数组有没有变化

const user = { name: "Ryan", age: 20 };
const todo = { id: 1, title: "学习 JavaScript", completed: false };


const todos = [
  { id: 1, title: "React", completed: false },
  { id: 2, title: "TypeScript", completed: false },
  { id: 3, title: "Git", completed: true },
];


// 1.不修改原 user，把 age 改成 21
const newUser = {...user, age : 21}
console.log('原user', user)
console.log('新user', newUser)
// 2.不修改原 todo，把 completed 改成 true
const newTodo = {...todo, completed : true}
console.log('原todo',todo)
console.log('新todo',newTodo)
// 3.给 user 增加 city: "Shenzhen"
const userAddCity = {...user, city: "Shenzhen" }
console.log(userAddCity)
// 4.从 user 中删除 age 属性（可以查语法）

// 这是改变原对象的
// delete user.age
// console.log(user)
// 不改变原对象
const {age, ...others} = user
console.log(others)
// 5.⭐ 不修改原数组，把 id=2 Todo 改成完成
const id2Done = todos.map(todo => {
  return todo.id === 2
    ? { ...todo, completed: true }
    : todo
})
console.log(id2Done)
// 6.⭐ 检查第 5 题执行后原数组有没有变化
// 不能这样判断，这样是判断是否指向同一个数组的
console.log('新数组和原数组相同？' ,id2Done === todos)
// 正确答案是各自打印，看有没有变化
console.log(todos)
console.log(id2Done)