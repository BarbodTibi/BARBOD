import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import StoreNavbar from '../components/StoreNavbar.jsx';
import { useShop } from '../context/ShopContext.jsx';
import formatPrice from '../utils/formatPrice.js';

export default function CartPage() {
  const { products, cart, changeQuantity, removeFromCart, totalItems, totalPrice, checkout } = useShop();
  const [customer, setCustomer] = useState('Guest Customer');
  const [email, setEmail] = useState('guest@example.com');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const entries = products.filter((product) => (cart[product.id] || 0) > 0);
  function completeOrder(event) {
    event.preventDefault();
    setError('');
    const order = checkout({ customer, email });
    if (!order) { setError('Your cart is empty. Add a product before checking out.'); return; }
    navigate('/order-success', { state: { orderId: order.id, total: order.total } });
  }
  return (
    <div className="catalog-page"><StoreNavbar /><Container className="cart-container">
      <div className="page-heading"><div className="eyebrow">YOUR BAG</div><h1>Shopping <span>Cart</span></h1><p>Review your items before placing order.</p></div>
      {error && <Alert variant="danger">{error}</Alert>}
      {entries.length === 0 ? <Card className="dashboard-card empty-cart-card"><Card.Body className="text-center py-5"><div className="empty-cart-icon"><i className="bi bi-bag" /></div><h2>Your cart is empty</h2><p className="muted-copy">Discover something you’ll love and add it to your bag.</p><Button as={Link} to="/products" className="primary-purple">Explore Products</Button></Card.Body></Card> : <Row className="g-4"><Col lg={8}><Card className="dashboard-card"><Card.Body className="p-0"><div className="table-responsive"><Table className="dark-table cart-table align-middle mb-0"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th /></tr></thead><tbody>{entries.map((product) => <tr key={product.id}><td><div className="cart-product"><img src={product.image} alt="" /><div><div className="product-name">{product.title}</div><div className="product-subtext">{product.category}</div></div></div></td><td>{formatPrice(product.price)}</td><td><div className="quantity-control"><Button variant="outline-light" onClick={() => changeQuantity(product.id, -1)} aria-label={`Decrease ${product.title}`}>−</Button><span>{cart[product.id]}</span><Button variant="outline-light" onClick={() => changeQuantity(product.id, 1)} disabled={product.stock <= 0} aria-label={`Increase ${product.title}`}>+</Button></div></td><td>{formatPrice(product.price * cart[product.id])}</td><td><Button variant="link" className="delete-icon-button" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.title}`}><i className="bi bi-trash" /></Button></td></tr>)}</tbody></Table></div></Card.Body></Card><div className="mt-3"><Link to="/products" className="muted-link"><i className="bi bi-arrow-left me-2" />Continue shopping</Link></div></Col>
        <Col lg={4}><Card className="dashboard-card order-summary-card"><Card.Body><h2>Order Summary</h2><div className="summary-line"><span>Items ({totalItems})</span><span>{formatPrice(totalPrice)}</span></div><div className="summary-line"><span>Shipping</span><span className="text-success">Free</span></div><div className="summary-line"><span>Estimated tax</span><span>{formatPrice(totalPrice * 0.08)}</span></div><hr /><div className="summary-total"><span>Total</span><strong>{formatPrice(totalPrice * 1.08)}</strong></div><Form onSubmit={completeOrder} className="checkout-form"><Form.Group className="mb-3"><Form.Label>Customer name</Form.Label><Form.Control value={customer} onChange={(event) => setCustomer(event.target.value)} required /></Form.Group><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Form.Group><Button type="submit" className="primary-purple w-100">Place Order <i className="bi bi-arrow-right ms-2" /></Button><div className="checkout-note"><i className="bi bi-lock me-2" /> checkout</div></Form></Card.Body></Card></Col></Row>}
    </Container></div>
    
    
  );
  
}
