export const RiskBadge = ({ level }) => <span className={`badge badge--${level.toLowerCase()}`}>{level} risk</span>;
export const StatusBadge = ({ status }) => <span className={`badge badge--status-${status.toLowerCase()}`}>{status}</span>;
