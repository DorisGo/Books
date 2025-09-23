import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddBook({ onAddBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idea");
  const [notes, setNotes] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState("");
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  // debounce search and query both Open Library (primary) and Google Books (supplement)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setCover("");
      return;
    }
    const q = query.trim();
    let cancelled = false;
    setLoading(true);
    setSearchError("");

    const timeout = setTimeout(() => {
      const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
        q
      )}&limit=8`;
      const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q
      )}&maxResults=8`;

      let olFailed = false;
      let gbFailed = false;

      const olFetch = fetch(olUrl)
        .then((r) =>
          r.ok ? r.json() : Promise.reject(new Error("OpenLibrary 请求失败"))
        )
        .catch((err) => {
          console.error("OpenLibrary error", err);
          olFailed = true;
          return { docs: [] };
        });

      const gbFetch = fetch(gbUrl)
        .then((r) =>
          r.ok ? r.json() : Promise.reject(new Error("Google Books 请求失败"))
        )
        .catch((err) => {
          console.error("Google Books error", err);
          gbFailed = true;
          return { items: [] };
        });

      Promise.all([olFetch, gbFetch])
        .then(([olData, gbData]) => {
          if (cancelled) return;
          const olDocs = (olData && olData.docs) || [];
          const gbItems = (gbData && gbData.items) || [];

          // map OpenLibrary results
          const olResults = olDocs.map((d) => {
            const coverUrl = d.cover_i
              ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
              : "";
            return {
              id: d.key,
              source: "open",
              title: d.title,
              author: (d.author_name && d.author_name[0]) || "",
              description: d.first_sentence
                ? Array.isArray(d.first_sentence)
                  ? d.first_sentence[0]
                  : d.first_sentence
                : d.subtitle || "",
              cover: coverUrl,
            };
          });

          // map Google Books results
          const gbResults = gbItems.map((it) => {
            const info = it.volumeInfo || {};
            let image =
              (info.imageLinks &&
                (info.imageLinks.thumbnail ||
                  info.imageLinks.smallThumbnail)) ||
              "";
            // prefer https
            if (image && image.startsWith("http:"))
              image = image.replace("http:", "https:");
            // fallback: try OpenLibrary cover by ISBN if available
            if (
              !image &&
              info.industryIdentifiers &&
              info.industryIdentifiers.length > 0
            ) {
              const isbnObj = info.industryIdentifiers.find(
                (x) => x.type && x.type.includes("ISBN")
              );
              const isbn = isbnObj && isbnObj.identifier;
              if (isbn) {
                image = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
              }
            }
            return {
              id: it.id,
              source: "google",
              title: info.title || "",
              author: (info.authors && info.authors[0]) || "",
              description: info.description || info.subtitle || "",
              cover: image,
            };
          });

          // merge, prefer OpenLibrary entries if title+author match; otherwise include both
          const merged = [];
          const seen = new Set();
          const pushIfNew = (r) => {
            const key =
              (r.title || "").toLowerCase().trim() +
              "|" +
              (r.author || "").toLowerCase().trim();
            if (seen.has(key)) return;
            seen.add(key);
            merged.push(r);
          };

          olResults.forEach(pushIfNew);
          gbResults.forEach(pushIfNew);

          if (!cancelled) {
            setResults(merged);
            if (olFailed || gbFailed) {
              const msgs = [];
              if (olFailed) msgs.push("Open Library 查询失败");
              if (gbFailed) msgs.push("Google Books 查询失败");
              setSearchError(msgs.join("，"));
            } else {
              setSearchError("");
            }
          }
        })
        .catch((err) => {
          console.error(err);
          if (!cancelled) {
            setResults([]);
            setSearchError(
              "搜索失败：" + (err && err.message ? err.message : "未知错误")
            );
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSelect = (item) => {
    setTitle(item.title || "");
    setAuthor(item.author || "");
    setDescription(item.description || "");
    setCover(item.cover || "");
    setResults([]);
    setQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = Date.now();
    const newBook = {
      id: Date.now(),
      title,
      author,
      description,
      cover: cover || "",
      status: status || "idea",
      ideaAt: now,
      startedAt: null,
      finishedAt: null,
      notes,
    };
    onAddBook(newBook);
    navigate("/");
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <label className="form-label">从书库搜索并选择（可选）</label>
        <input
          className="form-control"
          placeholder="搜索书名或作者（至少2字符）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <div className="small text-muted mt-1">搜索中...</div>}
        {searchError && (
          <div className="text-danger small mt-1">{searchError}</div>
        )}
        {results.length > 0 && (
          <div className="list-group mt-2">
            {results.map((r, idx) => (
              <button
                type="button"
                key={r.id || idx}
                className="list-group-item list-group-item-action d-flex align-items-center"
                onClick={() => handleSelect(r)}
              >
                {r.cover ? (
                  <img
                    src={r.cover}
                    alt="cover"
                    style={{
                      width: 48,
                      height: 64,
                      objectFit: "cover",
                      marginRight: 12,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 64,
                      background: "#f0f0f0",
                      marginRight: 12,
                    }}
                  />
                )}
                <div>
                  <div className="fw-bold">{r.title}</div>
                  <div className="small text-muted">{r.author}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {cover && (
          <div className="mb-3">
            <label className="form-label">封面预览</label>
            <div>
              <img src={cover} alt="cover" style={{ maxWidth: 140 }} />
            </div>
          </div>
        )}

        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="书名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="作者"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="简介 / 备注（可选）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">当前状态</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="idea">想读</option>
            <option value="reading">正在读</option>
            <option value="finished">已读</option>
          </select>
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="感想 / 摘抄（可选）"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          添加
        </button>
      </form>
    </div>
  );
}

export default AddBook;
