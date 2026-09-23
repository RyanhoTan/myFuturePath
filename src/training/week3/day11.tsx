import { useState } from "react";

export default function App() {
    const [count, setCount] = useState(0)
    return (
        <>
        <div>当前：{count}</div>
        <div>
        <button onClick={() => {count > 0 && setCount(count - 2)}}>[-2]</button>
        <button onClick={() => {setCount(0)}}>重置</button>
        <button onClick={() => {setCount(count + 1)}}>[+1]</button>
        <button onClick={() => {setCount(count + 5)}}>[+5]</button>
        </div>
        </>
    )
}