import { Card } from 'react-bootstrap';

export default function StatCard({ title, value, trend, trendLabel = 'vs. last 7 days', icon, tone = 'purple', footnote }) {
  return (
    <Card className={`stat-card stat-${tone} h-100`}>
      <Card.Body className="d-flex align-items-start gap-3">
        <div className="stat-icon"><i className={`bi ${icon}`} /></div>
        <div className="flex-grow-1 min-w-0">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
          {trend !== undefined && trend !== null && <div className={`stat-trend ${String(trend).startsWith('-') ? 'negative' : ''}`}><i className={`bi ${String(trend).startsWith('-') ? 'bi-arrow-down-right' : 'bi-arrow-up-right'}`} /> {trend}</div>}
          <div className="stat-footnote">{footnote || trendLabel}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
