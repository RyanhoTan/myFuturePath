import { useEffect, useState } from "react";

export default function Pagination() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`
    );
  }, [page]);

  return (
    <div>
      <button
      disabled={page <= 1}
        onClick={() => {
          setPage(page - 1)
        }}
      >
        上一页
      </button>

      <span>{page}</span>

      <button
        onClick={() => {
          setPage(page + 1)
        }}
      >
        下一页
      </button>
    </div>
  );
}