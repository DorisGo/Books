import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBook({ onAddBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = { id: Date.now(), title, author };
    onAddBook(newBook); // 调用父组件传递的函数
    navigate("/"); // 提交后跳转回首页
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="书名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="作者"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button type="submit">添加</button>
    </form>
  );
}

export default AddBook;
