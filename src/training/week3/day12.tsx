import { useState } from "react"

export default function App() {
    const [expand, setExpand] = useState(false)
    const [login, setLogin] = useState(true)
    return(
        <>
                   { expand ? (
        <>
        <div>姓名：Ryan</div>
        <div>年龄：20</div>
        <button onClick={() => setExpand(false)}>隐藏详情</button>
        </>
     ) : (
         <button onClick={() => setExpand(true)}>显示详情</button>
     )}

        { login ? (
      // 已登录
      <>
      <div>登陆状态：已登录</div>
      <button onClick={() => setLogin(false)}>退出登陆</button>
      </>
    ) : (
      // 未登录
      <button onClick={() => setLogin(true)}>登陆</button>
    )}
  </>
        
)

}