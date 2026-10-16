import Link from 'next/link';
import Icon from './Icon';

export function Skeleton({ height = 16, width = '100%', radius = 8, style }) {
  return <div className="skeleton" style={{ height, width, borderRadius: radius, ...style }} aria-hidden="true" />;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <Icon name="alert" size={28} />
      <h3>Could not load this data</h3>
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && <button className="btn btn--primary" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, message, actionLabel, onAction, href }) {
  return (
    <div className="state">
      <Icon name="inbox" size={28} />
      <h3>{title}</h3>
      <p>{message}</p>
      {href && <Link className="btn btn--primary" href={href}>{actionLabel}</Link>}
      {onAction && <button className="btn btn--primary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
