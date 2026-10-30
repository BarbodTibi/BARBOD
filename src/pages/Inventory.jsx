import { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Inventory() {
  const { products, updateStock } = useShop();
  const [amounts, setAmounts] = useState({});
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('Low Stock');
  const visible = useMemo(() => products.filter((product) => filter === 'All' || (filter === 'Low Stock' ? product.stock > 0 && product.stock <= 5 : filter === 'Out of Stock' ? product.stock === 0 : product.stock > 5)), [products, filter]);
  function restock(product) {
    const amount = Number(amounts[product.id] || 1);
    if (!Number.isInteger(amount) || amount < 1) { setSuccess('Enter a whole number greater than zero.'); return; }
    updateStock(product.id, amount);
    setAmounts((current) => ({ ...current, [product.id]: '' }));
    setSuccess(`${product.title}: added ${amount} unit${amount === 1 ? '' : 's'} to stock.`);
  }
  return (
    <>
      <div className="page-heading"><h1>Inventory</h1><p>Restock low items and keep your products available.</p></div>
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="soft-alert"><i className="bi bi-check-circle me-2" />{success}</Alert>}
      <Row className="g-3 mb-4"><Col sm={4}><Card className="mini-stat"><Card.Body><div className="mini-stat-label">Low stock items</div><div className="mini-stat-value">{products.filter((item) => item.stock > 0 && item.stock <= 5).length}</div></Card.Body></Card></Col><Col sm={4}><Card className="mini-stat"><Card.Body><div className="mini-stat-label">Out of stock</div><div className="mini-stat-value">{products.filter((item) => item.stock === 0).length}</div></Card.Body></Card></Col><Col sm={4}><Card className="mini-stat"><Card.Body><div className="mini-stat-label">Units in inventory</div><div className="mini-stat-value">{products.reduce((sum, item) => sum + Number(item.stock || 0), 0)}</div></Card.Body></Card></Col></Row>
      <Card className="dashboard-card"><Card.Body className="p-0"><div className="table-toolbar"><div><h2 className="mb-1 fs-6">Stock overview</h2><p className="section-subtitle mb-0">Restock actions update the storefront immediately.</p></div><Form.Select className="category-select" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Low Stock</option><option>Out of Stock</option><option>In Stock</option><option>All</option></Form.Select></div>
        <div className="table-responsive"><Table className="dark-table align-middle mb-0"><thead><tr><th>Product</th><th>Category</th><th>Current stock</th><th>Status</th><th>Restock amount</th><th className="text-end">Action</th></tr></thead><tbody>{visible.map((product) => <tr key={product.id}><td><div className="d-flex align-items-center gap-3"><img src={product.image} alt="" className="table-product-image" /><div className="product-name">{product.title}</div></div></td><td>{product.category}</td><td><span className={product.stock <= 5 ? 'stock-critical' : ''}>{product.stock}</span></td><td><StatusBadge status={product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'} /></td><td><Form.Control type="number" min="1" step="1" className="stock-input" value={amounts[product.id] ?? '5'} onChange={(event) => setAmounts((current) => ({ ...current, [product.id]: event.target.value }))} aria-label={`Restock amount for ${product.title}`} /></td><td className="text-end"><Button size="sm" className="primary-purple" onClick={() => restock(product)}><i className="bi bi-plus-lg me-1" />Restock</Button></td></tr>)}</tbody></Table></div>
        {visible.length === 0 && <div className="empty-state py-5">Nothing to show for this filter.</div>}
      </Card.Body></Card>
      <div className="dashboard-footnote"><i className="bi bi-lightbulb me-2" />Need to edit a product instead? <Link to="/admin/products">Open product management</Link>.</div>
    </>
  );
}
