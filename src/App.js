import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import AddBook from "./Pages/AddBook";
import BookItem from "./components/BookItem";

function App() {
  //
  const [books, setBooks] = useState(() => {
    try {
      const raw = localStorage.getItem("books_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to parse books from localStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("books_v1", JSON.stringify(books));
    } catch (err) {
      console.error("Failed to save books to localStorage:", err);
    }
  }, [books]);

  const handleAddBook = (newBook) => {
    const bookWithId = {
      id: Date.now(), // 使用时间戳作为唯一ID
      status: newBook.status || "unread", //如果没有status属性，则默认为unread
      ...newBook, //展开对象，拷贝newBook的所有属性，放在后面可以覆盖前两行的默认值
    };

    setBooks((prevBooks) => [...prevBooks, bookWithId]); //数组展开运算符，展开之前的书籍，再加上新书，形成一个新数组。
  };
  // delete book
  const handleDeleteBook = (id) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  // update book
  const handleUpdateBook = (id, newBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === id ? { ...book, ...newBook } : book))
    );
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              books={books}
              onDelete={handleDeleteBook}
              onUpdateBook={handleUpdateBook}
            />
          }
        />
        <Route path="/add" element={<AddBook onAddBook={handleAddBook} />} />
        <Route
          path="/item/:id"
          element={
            <BookItem
              books={books}
              onDelete={handleDeleteBook}
              onUpdateBook={handleUpdateBook}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
