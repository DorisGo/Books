// src/components/BookItem.js
import { useParams } from "react-router-dom";
import React from "react";
import "./BookItem.css";
function BookItem({ books }) {
  const { id } = useParams();
  const book = books.find((book) => book.id === parseInt(id));
  if (!book) return <div>Book not found</div>;
  return (
    <div className="book-item">
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">Author: {book.author}</p>
      <p className="book-description">{book.description}</p>
    </div>
  );
}

export default BookItem;
