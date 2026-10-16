import { Skeleton } from './Feedback';

export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <header className="card__head">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {subtitle && <p className="card__sub">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint, tone, loading, children }) {
  return (
    <div className="stat">
      <p className="stat__label">{label}</p>
      {loading ? <Skeleton height={32} width="60%" style={{ marginTop: 8 }} /> : <p className={`stat__value ${tone ? `tone-${tone}` : ''}`}>{value}</p>}
      {loading ? <Skeleton height={12} width="80%" style={{ marginTop: 10 }} /> : hint && <p className="stat__hint">{hint}</p>}
      {!loading && children}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
