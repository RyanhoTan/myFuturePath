## 一句话

`mutation` 用来修改服务器数据；修改成功后用 `invalidateQueries` 让旧缓存失效并重新获取最新数据。

## 易错点 1：Mutation 不是查数据

❌ `useMutation` 用来 GET 用户列表

✅ `useQuery` 查数据，`useMutation` 做 POST / DELETE / PUT / PATCH。

## 易错点 2：删除成功 ≠ 列表缓存自动更新

❌ DELETE 成功后，认为页面一定会自动变成最新列表。

✅ 删除成功后：

```tsx
onSuccess: () => {
	// mutate成功后，发一次请求获取新数据，不然渲染的还是旧的数据
  queryClient.invalidateQueries({ queryKey: ["users"] })
}
```

## 快记

- `mutate(id)`：触发 mutation，并把 `id` 传给 `mutationFn`
- `mutationFn`：真正负责修改服务器数据的函数
- `onSuccess`：mutation 成功后执行
- `invalidateQueries`：告诉 React Query 这份缓存旧了，需要重新获取
- DELETE 失败 → `onSuccess` 不执行 → 里面的 `invalidateQueries` 也不执行

`Query → 查数据`　`Mutation → 改数据`