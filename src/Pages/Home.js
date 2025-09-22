import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ books }) {
  return (
    <div className="home">
      <h1 className="bl">Book List</h1>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id}>
            <div className="book-card">
              <Link to={`/item/${book.id}`}>
                <div className="title">{book.title}</div>
                <div className="meta">{book.author}</div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
