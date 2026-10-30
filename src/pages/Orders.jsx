import { useMemo, useState } from 'react';
import { Button, Card, Form, Table } from 'react-bootstrap';
import { useShop } from '../context/ShopContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import formatPrice, { formatDate } from '../utils/formatPrice.js';

export default function Orders() {
  const { orders, updateOrderStatus } = useShop();
  const [status, setStatus] = useState('All');
  const ordered = useMemo(() => [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).filter((order) => status === 'All' || order.status === status), [orders, status]);
  return (
    <>
      <div className="page-heading d-flex justify-content-between align-items-center flex-wrap gap-3"><div><h1>Orders</h1><p>Review customer orders and update their status.</p></div><div className="order-count-chip"><i className="bi bi-receipt me-2" />{orders.length} total orders</div></div>
      <Card className="dashboard-card"><Card.Body className="p-0"><div className="table-toolbar"><div><h2 className="fs-6 mb-1">All orders</h2><p className="section-subtitle mb-0">Orders created at checkout show up here.</p></div><Form.Select className="category-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></Form.Select></div>
        <div className="table-responsive"><Table className="dark-table align-middle mb-0"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update status</th></tr></thead><tbody>{ordered.map((order) => <tr key={order.id}><td className="muted-cell">#{String(order.id).slice(-4)}</td><td><div className="product-name">{order.customer}</div><div className="product-subtext">{order.email}</div></td><td>{formatDate(order.date)}</td><td>{(order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</td><td>{formatPrice(order.total)}</td><td><StatusBadge status={order.status} /></td><td><Form.Select size="sm" className="status-select" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)} aria-label={`Status for order ${order.id}`}><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></Form.Select></td></tr>)}</tbody></Table></div>
        {ordered.length === 0 && <div className="empty-state py-5">No orders found for this status.</div>}
        <div className="table-footer"><span>Showing {ordered.length} orders</span><span>Changes are saved in this browser</span></div>
      </Card.Body></Card>
    </>
  );
}
