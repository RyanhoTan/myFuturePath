function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({
          id,
          name: "Ryan"
        })
      } else {
        reject("用户 ID 错误")
      }
    }, 1000)
  })
}


async function loadUser(id) {
    console.log('请求开始')
  try {
    const user = await getUser(id)
    console.log(user)
    return user
    
  } catch (error) {
    console.log(error)
  } finally{
    console.log('请求结束')
  }
}

loadUser(-1)