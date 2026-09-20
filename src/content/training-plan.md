可以。我给你做成一套**6 周、30 个训练日**的题单。前 4 周重点解决你这次体检暴露的问题，第 5～6 周开始贴近真实工作。

规则只有一个：**每题先自己写，卡 30 分钟再问 AI。答案不要提前看。**

---

# 第 1 周：JS 数组、对象、函数

## Day 1 — `map`

给定：

```js
const numbers = [1, 2, 3, 4, 5];

const users = [
  { id: 1, name: "Ryan", age: 20 },
  { id: 2, name: "Tom", age: 17 },
  { id: 3, name: "Jack", age: 25 },
];
```

练：

1. `[1,2,3,4,5]` → `[2,4,6,8,10]`
2. numbers → 每个数字平方
3. users → `["Ryan", "Tom", "Jack"]`
4. users → `["Ryan-20", "Tom-17", "Jack-25"]`
5. 把 `id=2` 的用户 `name` 改成 `"Jerry"`，其他不变
6. ⭐ 要求第 5 题**不能修改原 users**

**过关标准：**知道什么时候用 `map`，能自己写第 5 题。

---

## Day 2 — `filter` / `find`

```js
const todos = [
  { id: 1, title: "React", completed: false },
  { id: 2, title: "TS", completed: true },
  { id: 3, title: "Git", completed: false },
  { id: 4, title: "JS", completed: true },
];
```

练：

1. 找所有未完成 Todo
2. 找所有已完成 Todo
3. 找 `id=3`
4. 删除 `id=2`
5. 统计未完成数量
6. 判断是否存在 `id=5`
7. ⭐ 用一句话解释 `map / filter / find` 区别

---

## Day 3 — 对象、引用、展开

先**不要运行**，预测输出：

```js
const a = { name: "Ryan" };
const b = a;

b.name = "Tom";

console.log(a.name);
```

然后：

```js
const a = { name: "Ryan" };
const b = { ...a };

b.name = "Tom";

console.log(a.name);
```

再练：

1. 不修改原 user，把 `age` 改成 21
2. 不修改原 todo，把 `completed` 改成 true
3. 给 user 增加 `city: "Shenzhen"`
4. 删除对象某个属性（可以查语法）
5. ⭐ 不修改原数组，把 `id=2` Todo 改成完成
6. ⭐ 检查第 5 题执行后原数组有没有变化

---

## Day 4 — 函数

自己实现：

```js
add(1, 2) // 3

isAdult(20) // true

getFullName("Ryan", "Ho")

findUser(users, 2)

completeTodo(todos, 3)
```

再写：

```js
deleteTodo(todos, id)
getUncompletedCount(todos)
```

⭐ 最后一题：

```js
updateUserName(users, id, newName)
```

要求不能修改原数组。

---

## Day 5 — JS 小测

今天不学新东西。

给：

```js
const products = [
  { id: 1, name: "鼠标", price: 100, stock: 3 },
  { id: 2, name: "键盘", price: 200, stock: 0 },
  { id: 3, name: "显示器", price: 1000, stock: 2 },
  { id: 4, name: "耳机", price: 300, stock: 5 },
];
```

**禁止 AI，60 分钟完成：**

1. 找有库存商品
2. 找 `id=3`
3. 得到所有商品名称
4. 把所有商品价格打九折
5. 删除 `id=2`
6. 修改 `id=4` 的库存为 4
7. 统计有库存商品数量
8. ⭐ 整个过程不能修改原 products

做到 6/8 就可以进入下一周。

---

# 第 2 周：异步 JavaScript

## Day 6 — Promise 基础

先判断下面打印什么：

```js
console.log("A");

const promise = new Promise(resolve => {
  console.log("B");
  resolve("C");
});

promise.then(value => {
  console.log(value);
});

console.log("D");
```

然后练：

1. 创建一个成功 Promise，返回 `"success"`
2. `.then()` 获取结果
3. 创建失败 Promise
4. `.catch()` 获取错误
5. `.finally()` 打印 `"结束"`
6. 用自己的话解释 Promise 是什么

---

## Day 7 — async / await

给：

```js
function getUser() {
  return Promise.resolve({
    id: 1,
    name: "Ryan",
  });
}
```

练：

1. 用 `.then()` 获取 name
2. 用 `async/await` 获取 name
3. 写 `try/catch`
4. 请求成功打印用户
5. 请求失败打印 `"请求失败"`
6. ⭐ 为什么：

```js
const user = getUser();
```

`user` 不是 `{ id: 1... }`？

---

## Day 8 — 执行顺序

**全部先猜，再运行。**

```js
console.log(1);

setTimeout(() => console.log(2), 0);

console.log(3);
```

然后：

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

最后：

```js
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

console.log(4);
```

写下你为什么这么判断。

不要求深入浏览器规范，只建立执行顺序直觉。

---

## Day 9 — 模拟接口

给：

```js
function fetchUsers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Ryan" },
        { id: 2, name: "Tom" },
      ]);
    }, 1000);
  });
}
```

练：

1. 用 await 获取数据
2. 打印所有用户名
3. 增加 try/catch
4. 请求开始打印 `"loading"`
5. 请求结束打印 `"finished"`
6. ⭐ 修改 `fetchUsers`，让它有可能 reject

---

## Day 10 — 异步小测

自己写：

```js
async function loadUser(id) {
  // ...
}
```

要求：

```text
请求开始
↓
调用 getUser(id)
↓
成功 → 返回用户
↓
失败 → 打印错误
↓
无论如何 → 打印“请求结束”
```

然后解释：

```text
async
await
Promise
try
catch
finally
```

分别干嘛。

---

# 第 3 周：React 基础裸写

从这一周开始，每天都从：

```tsx
export default function App() {
}
```

开始。

## Day 11 — Counter

实现：

```text
当前：0

[-1] [重置] [+1]
```

要求：

* `useState`
* 三个按钮
* 显示 count
* count 不能低于 0
* ⭐ `+5` 按钮

---

## Day 12 — 条件渲染

实现：

```text
[显示详情]
```

点击：

```text
姓名：Ryan
年龄：20

[隐藏详情]
```

再增加：

```text
登录状态：已登录
[退出登录]
```

练 `boolean state + 条件渲染`。

---

## Day 13 — 表单

实现：

```text
姓名：[          ]
年龄：[          ]

你好，Ryan，你今年 20 岁。
```

要求实时变化。

然后增加：

* 姓名为空 → `"请输入姓名"`
* 年龄 < 18 → `"未成年"`
* 年龄 ≥ 18 → `"成年"`

---

## Day 14 — Todo

重新做我们今天这道题。

**不准看今天的答案。**

要求：

* todos state
* map
* 完成按钮
* 未完成数量
* 已完成不能再点完成
* ⭐ 删除
* ⭐ 添加 Todo

这一天很关键。

---

## Day 15 — React 小测

做学生列表：

```text
学生管理

Ryan   80   [及格]
Tom    55   [不及格]
Jack   90   [及格]

学生：3
及格：2
不及格：1
```

要求：

1. state 保存学生
2. map 渲染
3. 根据分数判断是否及格
4. 统计人数
5. 修改某学生成绩
6. 删除学生
7. 添加学生

禁止 AI 60～90 分钟。

---

# 第 4 周：React 状态设计

## Day 16 — 购物车

```text
苹果 ¥5   数量：2  [-] [+]
香蕉 ¥3   数量：1  [-] [+]

商品总数：3
总价：¥13
```

自己决定：

> 哪些是 state？哪些不应该是 state？

要求增减、删除商品、总数量、总价格。

---

## Day 17 — 搜索过滤

```text
搜索：[ rea ]

React
React Native
```

原数据：

```text
React
Vue
Angular
React Native
TypeScript
```

要求：

* 输入实时过滤
* 不区分大小写
* 没结果显示 `"暂无结果"`
* 清空按钮

⭐ 思考：`filteredList` 要不要 `useState`？

---

## Day 18 — Tabs

```text
[全部] [已完成] [未完成]
```

下面还是 Todo。

要求切换 Tab 后显示对应数据。

重点思考：

```text
todos 是 state
activeTab 是 state

filteredTodos 呢？
```

---

## Day 19 — useEffect

模拟：

```text
进入页面
↓
加载用户
↓
Loading...
↓
用户列表
```

然后增加：

```text
userId 改变
↓
重新加载用户
```

你必须自己解释：

```tsx
useEffect(() => {

}, [userId]);
```

为什么依赖是 `userId`。

---

## Day 20 — React 综合小测

做：

```text
Todo 管理器

搜索：[          ]

[全部] [已完成] [未完成]

学习 React    [完成] [删除]
学习 Git      [完成] [删除]

新增：[             ] [添加]

全部：3
完成：1
未完成：2
```

**90 分钟，禁止 AI。**

这个项目如果你能独立做到 70%，你和今天第一次 Todo 已经会产生非常明显的差距。

---

# 第 5 周：真实接口开发

## Day 21 — GET

用公开测试 API 或你自己 mock 数据都可以。

做：

```text
用户列表

Loading...
↓
请求成功
↓
列表
```

必须有：

```text
loading
error
data
```

并打开 DevTools Network 检查：

```text
URL
Method
Status
Response
```

---

## Day 22 — 搜索

用户列表增加：

```text
keyword
```

先做按钮搜索。

再改实时搜索。

最后加 debounce。

要求自己解释：

> 为什么 debounce 能减少请求？

---

## Day 23 — 分页

实现：

```text
上一页  2 / 10  下一页
```

请求类似：

```text
?page=2&pageSize=10
```

观察 Network 里的 Query Parameters。

---

## Day 24 — React Query

把 Day 21 的手动请求改成 `useQuery`。

重点不是抄代码，而是对比：

```text
以前我自己写了什么？
React Query 现在帮我处理了什么？
```

必须能解释：

```text
queryKey
queryFn
data
isLoading
error
```

---

## Day 25 — Mutation

实现一个：

```text
用户列表
Ryan [删除]
Tom  [删除]
```

用 mutation 模拟删除。

成功后刷新列表。

理解：

```text
mutation
invalidateQueries
```

---

# 第 6 周：TS + Git + 工程化

## Day 26 — TypeScript

给各种对象自己定义类型：

```text
User
Todo
Product
ApiResponse
```

练：

```ts
?
string | null
"loading" | "success" | "error"
```

再故意制造 5 个 TS 错误，然后自己修。

---

## Day 27 — 泛型

先实现：

```ts
function identity<T>(value: T): T {
  return value;
}
```

然后理解：

```ts
interface ApiResponse<T> {
  data: T;
  message: string;
}
```

让：

```ts
ApiResponse<User>
ApiResponse<User[]>
ApiResponse<Product[]>
```

都能使用。

不搞类型体操。

---

## Day 28 — Git 实验

专门建一个垃圾仓库，随便折腾。

亲手做：

```text
初始化仓库
→ commit
→ 创建 feature 分支
→ 修改
→ commit
→ merge
```

然后**故意制造一次冲突**并解决。

再实验：

```text
stash
stash pop
fetch
pull
```

这里千万别只看教程。

Git 最好的学习方式之一就是：

> **建一个随便搞坏也没关系的仓库。**

---

## Day 29 — pnpm / 工程化

新建一个 Vite 项目。

观察：

```text
package.json
pnpm-lock.yaml
node_modules
```

然后做实验：

```bash
pnpm add axios
```

观察哪些文件发生变化。

再：

```bash
pnpm remove axios
```

再观察。

然后回答：

```text
package.json 干嘛？
lockfile 干嘛？
node_modules 干嘛？
pnpm install 干嘛？
pnpm add 干嘛？
```

这比背定义有效很多。

---

# Day 30：最终考试

这一天什么都不学。

给自己 **2 小时**。

从空 Vite React TS 项目开始做：

```text
用户管理

搜索：[          ] [搜索]

Ryan   20   [编辑] [删除]
Tom    18   [编辑] [删除]

[上一页] 1/5 [下一页]

[新增用户]
```

要求至少包含：

* React + TS
* state
* props
* map/filter
* 表单
* 添加
* 修改
* 删除
* 搜索
* loading
* error
* 接口请求或 Mock API
* React Query
* Git 至少 3 个合理 commit

### AI 使用规则

前 **90 分钟禁止 AI**。

最后 30 分钟可以用 AI Debug。

完成以后，把项目代码给我。

**我们再做一次和今天一样的体检。**

---

# 你每天只需要记录 4 个东西

不用写学习日记，每天结束记：

```text
2026-09-21

今天：Day 1 map

独立完成：4/6

卡住：
- map 修改对象不会
- 展开运算符记不住

看答案后：
- 理解

第二天是否需要重写：
- 第 5 题
```

这份记录很重要。

因为我们最终看的不是：

> “学了多少小时。”

而是：

> **以前不会的东西，现在能不能不靠 AI 写出来。**

---

## 明天不要从 Day 1 看到 Day 30

你很容易掉进另一个坑：**规划做得特别完整，真正写代码只有半小时。**

所以明天只干 **Day 1**。

完成以后你直接把 6 道题的代码发给我，**不要让 AI 帮你改，也不用担心代码很烂**。我按照今天的方式批：先指出问题，不会直接把答案全部塞给你。

如果 Day 1 太简单，我就直接给你加难度；如果明显吃力，我们就在这里多练一天。这样比死守“30 天必须学完”更适合你。

