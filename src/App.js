import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import AddBook from "./Pages/AddBook";
import BookItem from "./components/BookItem";

function App() {
  // 临时测试数据：便于直接访问 /item/1 验证 BookItem 渲染与 CSS
  const [books, setBooks] = useState([
    { id: 1, title: "测试书", author: "测试作者", description: "这是一本用于调试样式的测试书。" },
  ]);
  const handleAddBook = (newBook) => {
    setBooks([...books, newBook]);
  };
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home books={books} />} />
        <Route path="/add" element={<AddBook onAddBook={handleAddBook} />} />
        <Route path="/item/:id" element={<BookItem books={books} />} />
      </Routes>
    </Router>
  );
}

export default App;
