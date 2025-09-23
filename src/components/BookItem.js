// src/components/BookItem.js
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./BookItem.css";

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  return d.toLocaleString();
}
function BookItem({ books, onDelete, onUpdateBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((book) => book.id === parseInt(id));
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(book ? book.notes || "" : "");
  const [editingTimes, setEditingTimes] = useState(false);
  const [ideaAtValue, setIdeaAtValue] = useState(
    book
      ? book.ideaAt
        ? new Date(book.ideaAt).toISOString().slice(0, 16)
        : ""
      : ""
  );
  const [startedAtValue, setStartedAtValue] = useState(
    book
      ? book.startedAt
        ? new Date(book.startedAt).toISOString().slice(0, 16)
        : ""
      : ""
  );
  const [finishedAtValue, setFinishedAtValue] = useState(
    book
      ? book.finishedAt
        ? new Date(book.finishedAt).toISOString().slice(0, 16)
        : ""
      : ""
  );

  if (!book) return <div>Book not found</div>;

  const handleStart = () => {
    const now = Date.now();
    onUpdateBook &&
      onUpdateBook(book.id, { status: "reading", startedAt: now });
  };

  const handleFinish = () => {
    const now = Date.now();
    onUpdateBook &&
      onUpdateBook(book.id, { status: "finished", finishedAt: now });
  };

  const handleSaveNotes = () => {
    onUpdateBook && onUpdateBook(book.id, { notes: notesValue });
    setEditingNotes(false);
  };

  return (
    <div className="book-item p-3">
      <button className="btn btn-link mb-2" onClick={() => navigate(-1)}>
        &larr; 返回
      </button>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">作者: {book.author}</p>
      <p className="book-description">{book.description}</p>

      <div className="mt-3">
        <strong>状态:</strong> {book.status}
      </div>

      <div className="mt-2">
        <div>
          <strong>想读时间:</strong> {formatDate(book.ideaAt)}
        </div>
        <div>
          <strong>开始阅读:</strong> {formatDate(book.startedAt)}
        </div>
        <div>
          <strong>结束阅读:</strong> {formatDate(book.finishedAt)}
        </div>
      </div>

      <div className="mt-3">
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={handleStart}
        >
          标为开始阅读
        </button>
        <button
          className="btn btn-sm btn-outline-success me-2"
          onClick={handleFinish}
        >
          标为已完成
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete && onDelete(book.id)}
        >
          删除
        </button>
      </div>

      <div className="mt-4">
        <h5>感想.../摘抄...</h5>
        {!editingNotes ? (
          <div>
            <div className="border p-2 mb-2" style={{ whiteSpace: "pre-wrap" }}>
              {book.notes || <em>暂无</em>}
            </div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => {
                setNotesValue(book.notes || "");
                setEditingNotes(true);
              }}
            >
              编辑
            </button>
          </div>
        ) : (
          <div>
            <textarea
              className="form-control mb-2"
              rows={6}
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={handleSaveNotes}
            >
              保存
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setEditingNotes(false)}
            >
              取消
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h5>时间戳（手动编辑）</h5>
        {!editingTimes ? (
          <div>
            <div className="small mb-1">
              <strong>想读时间:</strong> {formatDate(book.ideaAt)}
            </div>
            <div className="small mb-1">
              <strong>开始:</strong> {formatDate(book.startedAt)}
            </div>
            <div className="small mb-1">
              <strong>结束:</strong> {formatDate(book.finishedAt)}
            </div>
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => {
                  setIdeaAtValue(
                    book.ideaAt
                      ? new Date(book.ideaAt).toISOString().slice(0, 16)
                      : ""
                  );
                  setStartedAtValue(
                    book.startedAt
                      ? new Date(book.startedAt).toISOString().slice(0, 16)
                      : ""
                  );
                  setFinishedAtValue(
                    book.finishedAt
                      ? new Date(book.finishedAt).toISOString().slice(0, 16)
                      : ""
                  );
                  setEditingTimes(true);
                }}
              >
                编辑时间
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2">
              <label className="form-label small">想读时间</label>
              <input
                className="form-control"
                type="datetime-local"
                value={ideaAtValue}
                onChange={(e) => setIdeaAtValue(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label small">开始时间</label>
              <input
                className="form-control"
                type="datetime-local"
                value={startedAtValue}
                onChange={(e) => setStartedAtValue(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label small">结束时间</label>
              <input
                className="form-control"
                type="datetime-local"
                value={finishedAtValue}
                onChange={(e) => setFinishedAtValue(e.target.value)}
              />
            </div>
            <div>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => {
                  const toUpdate = {};
                  toUpdate.ideaAt = ideaAtValue
                    ? new Date(ideaAtValue).getTime()
                    : null;
                  toUpdate.startedAt = startedAtValue
                    ? new Date(startedAtValue).getTime()
                    : null;
                  toUpdate.finishedAt = finishedAtValue
                    ? new Date(finishedAtValue).getTime()
                    : null;
                  onUpdateBook && onUpdateBook(book.id, toUpdate);
                  setEditingTimes(false);
                }}
              >
                保存时间
              </button>
              <button
                className="btn btn-sm btn-outline-danger me-2"
                onClick={() => {
                  // 清除所有时间
                  onUpdateBook &&
                    onUpdateBook(book.id, {
                      ideaAt: null,
                      startedAt: null,
                      finishedAt: null,
                    });
                  setIdeaAtValue("");
                  setStartedAtValue("");
                  setFinishedAtValue("");
                  setEditingTimes(false);
                }}
              >
                清除时间
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setEditingTimes(false)}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookItem;
