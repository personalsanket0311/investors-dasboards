export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  return (
    <nav className="pager" aria-label="Pagination">
      <button className="btn" disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
      {pages.map((p, i) => (
        <span key={p} className="pager__group">
          {i > 0 && p - pages[i - 1] > 1 && <span className="pager__gap">…</span>}
          <button className={`btn pager__num ${p === page ? 'is-active' : ''}`} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}>{p}</button>
        </span>
      ))}
      <button className="btn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
