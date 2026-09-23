
import { useState } from "react"

export default function App() {
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    return (
        <>
        <div>
            姓名：
        <input
  value={name}
  onChange={(e) => {
    setName(e.target.value)
  }}
/></div>
<div>
            年龄：
        <input
        type="number"
  value={age}
  onChange={(e) => {
    setAge(e.target.value)
  }}
/></div>
<div>你好，{name}，你今年{Number(age)}岁</div>
{name === '' && '请输入姓名' }
<div> </div>
{Number(age) < 18 ? '未成年' : '成年'}
</>
    )
}