import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import AddBook from "./Pages/AddBook";
import BookItem from "./components/BookItem";
import ManageShelves from "./Pages/ManageShelves";

function App() {
  //
  const [books, setBooks] = useState(() => {
    try {
      const raw = localStorage.getItem("books_v1");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.warn(
          "books_v1 in localStorage is not an array — resetting to empty array.",
          parsed
        );
        // repair corrupted storage
        try {
          localStorage.setItem("books_v1", JSON.stringify([]));
        } catch (e) {
          console.error("Failed to repair books_v1 in localStorage:", e);
        }
        return [];
      }
      return parsed;
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
    const now = Date.now();
    const bookWithId = {
      id: newBook.id || now, // 保留传入 id，如果没有则使用时间戳
      title: newBook.title || "",
      author: newBook.author || "",
      description: newBook.description || "",
      status: newBook.status || "idea",
      ideaAt: newBook.ideaAt || now,
      startedAt: newBook.startedAt || null,
      finishedAt: newBook.finishedAt || null,
      notes: newBook.notes || "",
      ...newBook, // 允许覆盖上述默认字段（但放在后面会覆盖前面，这里保持在后以便 newBook 可以覆盖）
    };

    setBooks((prevBooks) => [...prevBooks, bookWithId]);
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
        <Route path="/shelves" element={<ManageShelves />} />
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
