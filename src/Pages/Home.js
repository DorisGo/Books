import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import "./Home.css";

const STATUS = [
  { key: "unread", label: "想读" },
  { key: "reading", label: "正在读" },
  { key: "read", label: "已读" },
];

function DraggableBook({ book }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(book.id),
    });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 999 : "auto",
    cursor: "grab",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="book-card card mb-2"
    >
      <div className="card-body p-2 d-flex justify-content-between align-items-start">
        <div>
          <Link to={`/item/${book.id}`} className="title card-title">
            {book.title || "无标题"}
          </Link>
          <div className="meta text-muted small">
            {book.author || "未知作者"}
          </div>
          {book.description && (
            <div className="text-muted small mt-1">{book.description}</div>
          )}
          <div className="text-muted small mt-1">
            {book.finishedAt
              ? `已完成: ${new Date(book.finishedAt).toLocaleDateString()}`
              : book.startedAt
              ? `开始: ${new Date(book.startedAt).toLocaleDateString()}`
              : book.ideaAt
              ? `想读: ${new Date(book.ideaAt).toLocaleDateString()}`
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ id, title, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div className="column">
      <h5 className="bl" style={{ fontSize: "1rem" }}>
        {title}
      </h5>
      <div
        ref={setNodeRef}
        className="book-list-column"
        style={{
          minHeight: 120,
          background: isOver ? "#f0f8ff" : "transparent",
          padding: 8,
          borderRadius: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home({ books = [], onDelete, onUpdateBook }) {
  const [q, setQ] = useState("");
  const sensors = useSensors(useSensor(PointerSensor));

  const grouped = useMemo(() => {
    const g = { unread: [], reading: [], read: [] };
    (books || []).forEach((b) => {
      const k = b.status || "unread";
      if (!g[k]) g[k] = [];
      g[k].push(b);
    });
    return g;
  }, [books]);

  const filterList = (list) => {
    const ql = q.trim().toLowerCase();
    if (!ql) return list;
    return list.filter(
      (b) =>
        (b.title || "").toLowerCase().includes(ql) ||
        (b.author || "").toLowerCase().includes(ql) ||
        (b.description || "").toLowerCase().includes(ql)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const bookId = parseInt(active.id, 10);
    const destStatus = over.id;
    const book = books.find((b) => b.id === bookId);
    if (!book || book.status === destStatus) return;
    onUpdateBook(bookId, { status: destStatus });
  };

  const toggleNextStatus = (book) => {
    const order = ["unread", "reading", "read"];
    const idx = order.indexOf(book.status || "unread");
    const next = order[(idx + 1) % order.length];
    onUpdateBook(book.id, { status: next });
  };

  return (
    <div className="home">
      <h2 className="bl">书单</h2>

      <div className="mb-3 d-flex gap-2" style={{ alignItems: "center" }}>
        <input
          className="form-control"
          type="search"
          placeholder="搜索书名 / 作者 / 描述"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Link to="/add" className="btn btn-success btn-sm ms-auto">
          添加书籍
        </Link>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="d-flex gap-3" style={{ alignItems: "flex-start" }}>
          {STATUS.map((s) => {
            const list = grouped[s.key] || [];
            const shown = filterList(list);
            return (
              <div key={s.key} style={{ flex: 1, minWidth: 240 }}>
                <DroppableColumn id={s.key} title={s.label}>
                  {shown.length === 0 && (
                    <div className="text-muted small">暂无书籍</div>
                  )}
                  {shown.map((book) => (
                    <div key={book.id}>
                      <DraggableBook book={book} />
                      <div className="d-flex justify-content-end gap-1 mb-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => toggleNextStatus(book)}
                        >
                          切换
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(book.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </DroppableColumn>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
