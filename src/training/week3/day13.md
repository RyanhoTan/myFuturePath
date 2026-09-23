**一句话：** 表单输入先用字符串 state 保存，`onChange` 实时更新，需要数字判断时再用 `Number()` 转换。

### 1. JSX 里显示变量

❌

```tsx
<div>`你好，${name}，你今年${age}岁`</div>
```

✅

```tsx
<div>你好，{name}，你今年 {age} 岁。</div>
```

### 2. 年龄初始值

❌

```tsx
const [age, setAge] = useState()
```

✅

```tsx
const [age, setAge] = useState("")
```

### 4. 年龄输入框

✅

```tsx
<input
  type="number"
  value={age}
  onChange={(e) => setAge(e.target.value)}
/>
```

### 快速记忆

- `value` → 输入框显示的值
- `onChange` → 输入变化时触发
- `e.target.value` → 当前输入内容，仍然是字符串
- `type="number"` → 限制为数字输入，但 `e.target.value` 仍是字符串
- `Number(age)` → 真正需要数字比较时再转换
- JSX 文字中插变量 → `{name}`，不用 `${name}`