// 我猜会打印ABDC，瞎猜的


// console.log("A");

// const promise = new Promise(resolve => {
//   console.log("B");
//   resolve("C");
// });

// promise.then(value => {
//   console.log(value);
// });

// console.log("D");

const promise = new Promise(resolve => {
    resolve('success')
})

promise.then(value => {
    console.log(value)
})

promise.catch(error => {
    console.log(error)
})

promise.finally(() => console.log('结束'))















// 3. 创建失败 Promise
const errorPromise = new Promise((resolve, reject) => {
  // 让它失败，错误信息："网络错误"
  reject('网络错误')
})

// 4. catch 接住错误
errorPromise.catch(error => {
  // 打印错误
  console.log(error)
}).finally(() => {
    console.log('1')
})

// 5. finally
errorPromise.finally(() => {
  // 打印 "结束"
  console.log('结束')
})