
// 用 await 获取数据
// 展开

// 打印所有用户名
// 展开

// 增加 try/catch
// 展开

// 请求开始打印 "loading"
// 展开

// 请求结束打印 "finished"
// 展开

// ⭐ 修改 fetchUsers，让它有可能 reject
function fetchUsers() {
  return new Promise((resolve, reject) => {
   
      setTimeout(() => {
  if (Math.random() > 0.5) {
    resolve([
        { id: 1, name: "Ryan" },
        { id: 2, name: "Tom" },
      ]);
  } else {
    reject("请求失败")
  }

}, 1000)
  });
}





// 用 await 获取数据
async function loadUsers() {
  // 你写

// 增加 try/catch
try {
    // 请求开始打印 "loading"
    console.log('loading')
      const users = await fetchUsers()
// 打印所有用户名
console.log(users.map(user => user.name))
} catch (error) {
    console.log(error)
} finally {
    console.log('finished')
}


// 请求结束打印 "finished"

// ⭐ 修改 fetchUsers，让它有可能 reject

}
loadUsers()