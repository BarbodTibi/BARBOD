import { useMemo, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useShop } from '../context/ShopContext.jsx';
import ProductEditorModal from '../components/ProductEditorModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import formatPrice from '../utils/formatPrice.js';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);
  const categories = ['All', ...new Set(products.map((item) => item.category))];
  const filtered = useMemo(() => products.filter((product) => (category === 'All' || product.category === category) && `${product.title} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())), [products, category, query]);
  function saveProduct(product) {
    if (editing) updateProduct(editing.id, product);
    else addProduct(product);
    setEditing(null);
  }
  function editProduct(product) { setEditing(product); setShowEditor(true); }
  function addNew() { setEditing(null); setShowEditor(true); }
  function removeProduct(product) {
    if (window.confirm(`Delete "${product.title}" from the catalog?`)) deleteProduct(product.id);
  }
  return (
    <>
      <div className="page-heading d-flex justify-content-between align-items-center flex-wrap gap-3"><div><h1>Products</h1><p>Manage the products available in your store.</p></div><Button className="primary-purple" onClick={addNew}><i className="bi bi-plus-lg me-2" />Add Product</Button></div>
      <Row className="g-3 mb-4">
        <Col sm={4}><Card className="mini-stat"><Card.Body><div className="mini-stat-label">Total products</div><div className="mini-stat-value">{products.length}</div></Card.Body></Card></Col>
        <Col sm={4}><Card className="mini-stat"><Card.Body><div className="mini-stat-label">Low stock</div><div className="mini-stat-value">{products.filter((item) => item.stock <= 5).length}</div></Card.Body></Card></Col>
        <Col sm={4}><Card className="mini-stat"><Card.Body><div className="mini-stat-label">Average rating</div><div className="mini-stat-value"><i className="bi bi-star-fill rating-star me-2" />{products.length ? (products.reduce((sum, product) => sum + Number(product.rating || 0), 0) / products.length).toFixed(1) : '—'}</div></Card.Body></Card></Col>
      </Row>
      <Card className="dashboard-card">
        <Card.Body className="p-0">
          <div className="table-toolbar"><InputGroup className="table-search"><InputGroup.Text><i className="bi bi-search" /></InputGroup.Text><Form.Control value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." /></InputGroup><Form.Select className="category-select" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</Form.Select></div>
          <div className="table-responsive"><Table className="dark-table align-middle mb-0"><thead><tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Status</th><th className="text-end">Actions</th></tr></thead><tbody>
            {filtered.map((product) => <tr key={product.id}><td><img src={product.image} alt="" className="table-product-image" /></td><td><div className="product-name">{product.title}</div><div className="product-subtext">ID #{product.id}</div></td><td>{product.category}</td><td>{formatPrice(product.price)}</td><td>{product.stock}</td><td><i className="bi bi-star-fill rating-star me-1" />{Number(product.rating).toFixed(1)}</td><td><StatusBadge status={product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'} /></td><td><div className="d-flex justify-content-end gap-2"><Button size="sm" className="table-action-edit" onClick={() => editProduct(product)} aria-label={`Edit ${product.title}`}><i className="bi bi-pencil-square" /> <span className="d-none d-xl-inline">Edit</span></Button><Button size="sm" className="table-action-delete" onClick={() => removeProduct(product)} aria-label={`Delete ${product.title}`}><i className="bi bi-trash" /> <span className="d-none d-xl-inline">Delete</span></Button></div></td></tr>)}
          </tbody></Table></div>
          {filtered.length === 0 && <div className="empty-state py-5">No products match your search.</div>}
          <div className="table-footer"><span>Showing {filtered.length} of {products.length} products</span><span>Changes are saved in this browser</span></div>
        </Card.Body>
      </Card>
      <ProductEditorModal show={showEditor} onHide={() => { setShowEditor(false); setEditing(null); }} product={editing} onSave={saveProduct} />
    </>
  );
}
