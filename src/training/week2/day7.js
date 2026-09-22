function getUser() {
  return Promise.resolve({
    id: 1,
    name: "Ryan",
  });
}

// 练：

// 用 .then() 获取 name
getUser().then(user => {
    console.log(user.name)
})
// 用 async/await 获取 name
async function test() {
  const user = await getUser()

  console.log(user.name)
}

test()
// 写 try/catch

// 请求成功打印用户

// 请求失败打印 "请求失败"

// ⭐ 为什么：
// const user = getUser();
// user 不是 { id: 1... }？

function getMessage() {
  return Promise.resolve("你好")
}

async function showMessage() {
  const message = await getMessage()
  console.log(message)
}

showMessage()





// 成功的
// function getProduct() {
//   return Promise.resolve({
//     id: 1,
//     name: "显示器",
//     price: 1000
//   })
// }

// async function showProduct() {
//   const product = await getProduct()
//   console.log(product.name,'的价格是', product.price)
// }

// showProduct()


function getProduct() {
  return Promise.reject("服务器出错")
}

async function showProduct() {
  try {
    const product = await getProduct()
    console.log(product)
  } catch (error) {
    console.log(error)
  }
}


showProduct()




function login() {
  return Promise.resolve({
    username: "Ryan",
    token: "abc123"
  })
}

async function handleLogin() {
    
    try {
        const result = await login()
        console.log(result.token)
    } catch (error) {
        console.log('登陆失败')
    }
}

handleLogin()

























function getOrder() {
  return Promise.resolve({
    id: 100,
    price: 299
  })
}

async function showOrder() {
  try {
    // ① await getOrder()，保存到变量 order
    const order = await getOrder()

    // ② 打印 order.price
    console.log(order.price)

  } catch (error) {
    // ③ 打印 "订单获取失败"
    console.log("订单获取失败")
  }
}

showOrder()




















function fetchProfile() {
  return Promise.resolve({
    id: 88,
    nickname: "小明",
    level: 12,
  })
}

fetchProfile().then(value => {
    console.log(value)
})

async function handelFetch() {
    try {
        const info = await fetchProfile()
        console.log(info.nickname)
    } catch (error) {
        console.log('获取资料失败')
    }
}

handelFetch()