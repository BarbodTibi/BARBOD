import { Badge } from 'react-bootstrap';

export default function StatusBadge({ status }) {
  const map = {
    Processing: 'warning',
    Shipped: 'success',
    Delivered: 'primary',
    Cancelled: 'danger',
    'In Stock': 'success',
    'Low Stock': 'warning',
    'Out of Stock': 'danger',
  };
  return <Badge bg={map[status] || 'secondary'} className={`status-badge status-${String(status).toLowerCase().replaceAll(' ', '-')}`}>{status}</Badge>;
}
