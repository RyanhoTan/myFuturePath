1.// 找所有未完成 Todo

2.// 找所有已完成 Todo

3.// 找 id=3

4.// 删除 id=2

5.// 统计未完成数量

6.// 判断是否存在 id=5

7.// ⭐ 用一句话解释 map / filter / find 区别

const tecs = [
  { id: 1, title: "React", completed: false },
  { id: 2, title: "TS", completed: true },
  { id: 3, title: "Git", completed: false },
  { id: 4, title: "JS", completed: true },
];

// 1.map 方式
const todosByMap = tecs.map(tec => tec.completed ? null : tec)
console.log(todosByMap)
// 1.filter方式
const todosByFliter = tecs.filter(tec => !tec.completed)
console.log(todosByFliter)
// 1. find

// 2.map
const doneByMap = tecs.map(tec => tec.completed ? tec : null)
console.log(doneByMap)
// 2.filter方式
const doneByFliter = tecs.filter(tec => tec.completed)
console.log(doneByFliter)

// 3. map
const findId3ByMap = tecs.map(tec => tec.id === 3 ? tec : null)
console.log(findId3ByMap)
// 3.filter
const findId3ByFilter = tecs.filter(tec => tec.id === 3)
console.log(findId3ByFilter)
// 3.find
const findId3ByFind = tecs.find(tec => tec.id === 3)
console.log(findId3ByFind)

// 4.map
const delId2ByMap = tecs.map(tec => tec.id === 2 ? null : tec)
console.log(delId2ByMap)
// 4.filter
const delId2ByFilter= tecs.filter(tec => tec.id !== 2 )
console.log('delId2ByFilter: ', delId2ByFilter)
// 4. find 这个只用find貌似不行
const delId2ByFind = tecs.find(tec => tec.id !== 2)
console.log('delId2ByFind: ', delId2ByFind)

// 统计未完成
// 5. map 这里为啥还是4
// 答：因为结果是 [true,  null,  true,  null]，还是4项
const todoCountByMap = tecs.map(tec => tec.completed ? null : true).length
console.log('todoCountByMap:', todoCountByMap)
// 5. filter
const todoCountByFilter = tecs.filter(tec => !tec.completed).length
console.log('todoCountByFilter: ',todoCountByFilter)
// 5.貌似find也不行

// 6.
// 判断是否存在id = 5 为啥是undefined
// 答案： 因为即使tec.id === 5 ? true : false返回了布尔，但是find是返回本身那个元素，如果没有，就是undefined
const isExistId5 = tecs.find(tec => {
 return tec.id === 5 ? true : false
})
console.log('isExistId5: ', isExistId5);

const isExistId5BySome = tecs.some(tec => tec.id === 5)
console.log(isExistId5BySome)
 

// 用自己的话解释：
// map     就是便利，无条件便利
// filter  就是筛选，返回后面为true的元素，然后把这些元素组成数组
// find    就是找符合条件的第一个元素本身，找不到就是undefined
// some    返回true或者false


// 注意！！！！
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。
//  map 把每一次回调的返回值收集起来组成新数组。














const users = [
  { id: 1, name: "Ryan", age: 20 },
  { id: 2, name: "Tom", age: 17 },
  { id: 3, name: "Jack", age: 25 },
];


// 判断 users 中是否至少有一个未成年人（age < 18）。

const hasMinor = users.some(user => user.age < 18)
console.log(hasMinor)