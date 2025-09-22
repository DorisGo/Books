// src/components/BookItem.js
import { useParams } from "react-router-dom";
import React from "react";
import "./BookItem.css";
function BookItem({ books, onDelete, onUpdateBook }) {
  const { id } = useParams();
  const book = books.find((book) => book.id === parseInt(id));
  if (!book) return <div>Book not found</div>;
  return (
    <div className="book-item">
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">Author: {book.author}</p>
      <p className="book-description">{book.description}</p>
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onUpdateBook && onUpdateBook(book.id, { status: "reading" })}>
          标为正在读
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete && onDelete(book.id)}>
          删除
        </button>
      </div>
    </div>
  );
}

export default BookItem;
