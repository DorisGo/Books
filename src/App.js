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
    setBooks([...books, newBook]);
    localStorage.setItem("books_v1", JSON.stringify([...books, newBook]));
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
