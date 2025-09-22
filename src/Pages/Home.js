import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookItem from "../components/BookItem";
import "./Home.css";

function Home({ books }) {
  //  const [books, setBooks] = useState([]);

  //   useEffect(() => {
  //     // 模拟API请求
  //     axios
  //       .get("https://your-api-endpoint/books")
  //       .then((response) => {
  //         setBooks(response.data);
  //       })
  //       .catch((error) => console.error("Error fetching books:", error));
  //   }, []);

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/item/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
