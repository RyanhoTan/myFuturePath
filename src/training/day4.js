// 写 add(a, b)：接收两个数字，返回它们的和。
function add(a, b) {
  // 在这里处理 a 和 b
  return a + b
}

console.log(add(1, 2)); // 3


// 写 isAdult(age)：判断年龄是否大于等于 18，返回一个 boolean。
function isAdult(age) {
  return age >= 18 ? true : false 
}

console.log(isAdult(20)); // true
console.log(isAdult(17)); // false


// 写 getFullName(firstName, lastName)：把 firstName 和 lastName 拼成一个完整名字并返回。 
function getFullName(firstName, lastName) {
  return firstName + ' ' +lastName
}

console.log(getFullName("Ryan", "Ho")); // "Ryan Ho"


//  写 findUser(users, id)：在用户数组中找到指定 id 的用户并返回。
const users = [
  { id: 1, name: "Ryan", age: 20 },
  { id: 2, name: "Tom", age: 17 },
  { id: 3, name: "Jack", age: 25 },
];

// 为啥返回undefined
function findUser(users, id) {
  // 在 users 中查找 id 对应的用户  
 return users.find(user => user.id === id)
}

function filterUser(users, id) {
  // 在 users 中查找 id 对应的用户
 return users.filter(user => user.id === id)

}

console.log(findUser(users, 2)); // 返回 id 为 2 的用户
console.log(filterUser(users, 2)); // 返回 id 为 2 的用户

const todos = [
  { id: 1, title: "React", completed: false },
  { id: 2, title: "TS", completed: true },
  { id: 3, title: "Git", completed: false },
  { id: 4, title: "JS", completed: true },
];

function completeTodo(todos, id) {
  // 创建新的数组，并只更新指定 Todo
  return todos.map(todo => todo.id === id ? {...todo, completed : true} : todo)
}


console.log(completeTodo(todos, 3)); // 返回新的 todos，id 为 3 的 Todo 已完成


// 写 deleteTodo(todos, id)：删除指定 id 的 Todo，并返回处理后的新数组。
// 要求：不能修改原数组。

// 不知道为什么不行
// function deleteTodo(todos, id) {
//   // 创建一个不包含指定 Todo 的新数组
//   todos.map(todo => todo.id === id ? {...todo, ...others} : todo)
// }

function filterTodo(todos, id) {
  // 创建一个不包含指定 Todo 的新数组
 return todos.filter(todo => todo.id !== id)
}

// deleteTodo(todos, 2); // 返回不包含 id 为 2 的 Todo 的新数组
console.log(filterTodo(todos, 2))



// 写 getUncompletedCount(todos)：返回 Todo 数组中未完成 Todo 的数量。
function getUncompletedCount(todos) {
  // 统计 completed 为 false 的 Todo
 return todos.filter(todo => todo.completed ? false : true).length
}

console.log(getUncompletedCount(todos)); // 返回未完成 Todo 的数量

 
// 写 updateUserName(users, id, newName)：修改指定用户的名字，并返回处理后的新数组。
// 要求：不能修改原数组，也不能修改原数组中的用户对象。

function updateUserName(users, id, newName) {
  // 创建新的数组，并只更新指定用户的 name
 return users.map(user => user.id === id ? {...user, name : newName} : user)
}

updateUserName(users, 2, "Jerry"); // 返回新的 users，id 为 2 的用户名字已更新
console.log(updateUserName(users, 2, "Jerry"))