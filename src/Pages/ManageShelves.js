import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageShelves() {
  const [shelves, setShelves] = useState(() => {
    try {
      const raw = localStorage.getItem("shelves_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null); // index being edited
  const [editingValue, setEditingValue] = useState("");
  const [books, setBooks] = useState(() => {
    try {
      const raw = localStorage.getItem("books_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [openShelf, setOpenShelf] = useState(null); // shelf name being managed
  const [confirmModal, setConfirmModal] = useState({ open: false, name: null });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem("shelves_v1", JSON.stringify(shelves || []));
    } catch (e) {
      console.error("Failed to persist shelves_v1", e);
    }
  }, [shelves]);

  useEffect(() => {
    try {
      localStorage.setItem("books_v1", JSON.stringify(books || []));
    } catch (e) {
      console.error("Failed to persist books_v1", e);
    }
  }, [books]);

  const handleAdd = () => {
    const n = (newName || "").trim();
    if (!n) return;
    if (shelves.includes(n)) {
      // avoid alert; set input back
      setNewName("");
      return;
    }
    setShelves((prev) => [...prev, n]);
    setNewName("");
  };

  const handleDelete = (name) => {
    // open modal to confirm deletion
    setConfirmModal({ open: true, name });
  };

  const confirmDelete = () => {
    const name = confirmModal.name;
    if (!name) return setConfirmModal({ open: false, name: null });
    setShelves((prev) => prev.filter((s) => s !== name));
    try {
      const next = (books || []).map((b) => {
        if (!b.shelves || !Array.isArray(b.shelves)) return b;
        return { ...b, shelves: b.shelves.filter((s) => s !== name) };
      });
      setBooks(next);
    } catch (e) {
      console.error("Failed to update books when deleting shelf", e);
    }
    setConfirmModal({ open: false, name: null });
  };

  const cancelDelete = () => setConfirmModal({ open: false, name: null });

  const startEdit = (idx) => {
    setEditing(idx);
    setEditingValue(shelves[idx] || "");
  };

  const saveEdit = (idx) => {
    const v = (editingValue || "").trim();
    if (!v) return;
    setShelves((prev) => prev.map((s, i) => (i === idx ? v : s)));
    setEditing(null);
    setEditingValue("");
  };

  const countForShelf = (name) => {
    if (!books || books.length === 0) return 0;
    return books.filter(
      (b) => Array.isArray(b.shelves) && b.shelves.includes(name)
    ).length;
  };

  const toggleBookInShelf = (bookId, shelfName, checked) => {
    setBooks((prev) => {
      const next = (prev || []).map((b) => {
        if (b.id !== bookId) return b;
        const current = Array.isArray(b.shelves) ? [...b.shelves] : [];
        if (checked) {
          if (!current.includes(shelfName)) current.push(shelfName);
        } else {
          const idx = current.indexOf(shelfName);
          if (idx >= 0) current.splice(idx, 1);
        }
        return { ...b, shelves: current };
      });
      return next;
    });
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-link me-2" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h3 className="mb-0">管理收藏夹</h3>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <input
                className="form-control"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="新建收藏夹，例如：2025年必读、科幻"
              />
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button className="btn btn-primary w-100" onClick={handleAdd}>
                新建收藏夹
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">已创建的收藏夹</h5>
          {(!shelves || shelves.length === 0) && (
            <div className="text-muted">暂无收藏夹，快去新建一个吧</div>
          )}
          <div className="list-group">
            {(shelves || []).map((s, idx) => (
              <div key={s} className="list-group-item">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-info text-dark">书架</span>
                    {editing === idx ? (
                      <input
                        className="form-control form-control-sm"
                        style={{ minWidth: 200 }}
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                      />
                    ) : (
                      <div>
                        <strong>{s}</strong>
                        <div className="small text-muted">共 {countForShelf(s)} 本</div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    {editing === idx ? (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={() => saveEdit(idx)}>
                          保存
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(null)}>
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(idx)}>
                          重命名
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setOpenShelf(openShelf === s ? null : s)}
                        >
                          管理书籍
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s)}>
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {openShelf === s && (
                  <div className="mt-3">
                    <div className="small text-muted mb-2">勾选以将书添加到该收藏夹，取消勾选以移除。</div>
                    <div className="row g-2">
                      {(books || []).map((b) => (
                        <div key={b.id} className="col-12 col-md-6">
                          <div className="form-check d-flex align-items-start gap-2">
                            <input
                              className="form-check-input mt-1"
                              type="checkbox"
                              id={`chk-${s}-${b.id}`}
                              checked={Array.isArray(b.shelves) && b.shelves.includes(s)}
                              onChange={(e) => toggleBookInShelf(b.id, s, e.target.checked)}
                            />
                            {b.cover ? (
                              <img src={b.cover} alt="cover" style={{ width: 40, height: 56, objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: 40, height: 56, background: '#f0f0f0' }} />
                            )}
                            <label className="form-check-label flex-grow-1" htmlFor={`chk-${s}-${b.id}`}>
                              <strong>{b.title}</strong>
                              <div className="small text-muted">{b.author}</div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* Confirm modal (simple, controlled by React) */}
        {confirmModal.open && (
          <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">确认删除</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body">
                  <p>确认删除收藏夹 "{confirmModal.name}"？此操作会从所有书籍中移除该标签。</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelDelete}>取消</button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>删除</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ManageShelves;

