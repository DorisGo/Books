import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ books = [], onDelete, onUpdateBook }) {
  const statusLabel = (s) => s || "未标注";

  const toggleNextStatus = (book) => {
    const order = ["unread", "to-read", "reading", "read"];
    const idx = order.indexOf(book.status || "unread");
    const next = order[(idx + 1) % order.length];
    onUpdateBook && onUpdateBook(book.id, { status: next });
  };

  return (
    <div className="home">
      <h1 className="bl">Book List</h1>
      <ul className="book-list">
        {(books || []).map((book) => (
          <li key={book.id}>
            <div className="book-card card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <Link to={`/item/${book.id}`} className="title h6 mb-1 d-block">
                    {book.title}
                  </Link>
                  <div className="meta text-muted">{book.author}</div>
                </div>

                <div className="text-end">
                  <span className="badge bg-secondary me-2">{statusLabel(book.status)}</span>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleNextStatus(book)}
                      title="切换状态"
                    >
                      切换
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete && onDelete(book.id)}
                      title="删除"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
              {book.description && <div className="card-footer text-muted">{book.description}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
