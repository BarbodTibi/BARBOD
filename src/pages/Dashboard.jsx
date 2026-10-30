import { useMemo } from 'react';
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import formatPrice, { formatDate } from '../utils/formatPrice.js';

const chartPoints = [70, 142, 134, 152, 185, 112, 146, 181, 187, 280];
const chartLabels = ['Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27', 'Apr 28'];

function SalesChart() {
  const points = chartPoints.map((y, index) => `${38 + index * 58},${230 - y * 0.58}`).join(' ');
  return (
    <div className="chart-wrap">
      <div className="chart-legend"><span className="legend-dot" /> Revenue</div>
      <svg className="sales-chart" viewBox="0 0 590 280" role="img" aria-label="Illustrative revenue trend for the last seven days">
        {[35, 80, 125, 170, 215].map((y, index) => <g key={y}><line x1="38" y1={y} x2="568" y2={y} className="chart-grid" /><text x="5" y={y + 4} className="chart-axis-label">{400 - index * 100}</text></g>)}
        {[38, 128, 218, 308, 398, 488, 568].map((x) => <line key={x} x1={x} y1="35" x2={x} y2="230" className="chart-grid vertical" />)}
        <polygon points={`38,230 ${points} 560,230`} className="chart-area" />
        <polyline points={points} className="chart-line" />
        {chartPoints.map((y, index) => <circle key={index} cx={38 + index * 58} cy={230 - y * 0.58} r="4.4" className="chart-point" />)}
        {chartLabels.map((label, index) => <text key={label} x={38 + index * 88} y="257" textAnchor="middle" className="chart-axis-label">{label}</text>)}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const { products, orders } = useShop();
  const lowStock = products.filter((product) => product.stock <= 5).length;
  const revenue = orders.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.total || 0), 0);
  const customers = new Set(orders.map((order) => order.email).filter(Boolean)).size;
  const recentOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [orders]);
  const currency = formatPrice(revenue);

  return (
    <>
      <div className="page-heading d-flex align-items-start align-items-md-center justify-content-between flex-wrap gap-3">
        <div><h1>Dashboard</h1><p>Here's what's happening with your store today.</p></div>
        <div className="date-chip"><i className="bi bi-calendar3 me-2" />{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </div>
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}><StatCard title="Total Orders" value={orders.length} trend="12%" icon="bi-cart3" tone="purple" /></Col>
        <Col sm={6} xl={3}><StatCard title="Total Revenue" value={currency} trend="18%" icon="bi-cash-stack" tone="green" /></Col>
        <Col sm={6} xl={3}><StatCard title="Low Stock Items" value={lowStock} trend={`${lowStock ? 'Needs attention' : 'All good'}`} icon="bi-box-seam" tone="blue" /></Col>
        <Col sm={6} xl={3}><StatCard title="Total Customers" value={customers} trend="22%" icon="bi-people" tone="purple" /></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xl={6}>
          <Card className="dashboard-card chart-card h-100">
            <Card.Body><div className="section-title-row"><h2>Sales Overview</h2><span className="chart-period">Last 7 days</span></div><SalesChart /></Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="dashboard-card h-100">
            <Card.Body className="p-0">
              <div className="section-title-row px-3 px-md-4 py-3"><h2>Recent Orders</h2><Button as={Link} to="/admin/orders" variant="link" className="view-all">View All</Button></div>
              <div className="table-responsive"><Table className="dark-table mb-0 align-middle">
                <thead><tr><th>#</th><th>Customer</th><th>Date</th><th>Status</th><th className="text-end">Total</th></tr></thead>
                <tbody>{recentOrders.map((order) => <tr key={order.id}><td className="muted-cell">#{String(order.id).slice(-4)}</td><td>{order.customer}</td><td>{formatDate(order.date)}</td><td><StatusBadge status={order.status} /></td><td className="text-end">{formatPrice(order.total)}</td></tr>)}</tbody>
              </Table></div>
              {recentOrders.length === 0 && <div className="empty-state py-5">Orders will appear here after checkout.</div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-card products-overview">
        <Card.Body className="p-0">
          <div className="section-title-row px-3 px-md-4 py-3"><div><h2>Products</h2><p className="section-subtitle">Keep an eye on your product inventory.</p></div><Button as={Link} to="/admin/products" className="primary-purple"><i className="bi bi-plus-lg me-2" />Manage Products</Button></div>
          <div className="table-responsive"><Table className="dark-table products-table mb-0 align-middle">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Rating</th></tr></thead>
            <tbody>{products.slice(0, 5).map((product) => <tr key={product.id}><td><img src={product.image} alt="" className="table-product-image" /></td><td><span className="product-name">{product.title}</span></td><td>{product.category}</td><td>{formatPrice(product.price)}</td><td>{product.stock}</td><td><StatusBadge status={product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'} /></td><td><i className="bi bi-star-fill rating-star me-1" />{Number(product.rating).toFixed(1)}</td></tr>)}</tbody>
          </Table></div>
          <div className="table-footer"><span>Showing {Math.min(products.length, 5)} of {products.length} products</span><Button as={Link} to="/admin/products" variant="link" className="view-all">Open product manager <i className="bi bi-arrow-right ms-1" /></Button></div>
        </Card.Body>
      </Card>
      
    </>
  );
}
