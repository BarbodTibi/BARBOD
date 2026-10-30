import { Button, Card, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import StoreNavbar from '../components/StoreNavbar.jsx';
import formatPrice from '../utils/formatPrice.js';

export default function OrderSuccess() {
  const { state } = useLocation();
  return <div className="catalog-page"><StoreNavbar /><Container className="success-container"><Card className="dashboard-card text-center"><Card.Body className="py-5 px-4"><div className="success-check"><i className="bi bi-check-lg" /></div><div className="eyebrow mt-4">ORDER PLACED</div><h1>Thank you for your order.</h1><p className="muted-copy">Your demo order has been created and added to the admin Orders page.</p>{state?.orderId && <div className="success-order-summary"><span>Order #{String(state.orderId).slice(-4)}</span><strong>{formatPrice(state.total)}</strong></div>}<div className="d-flex justify-content-center gap-2 flex-wrap mt-4"><Button as={Link} to="/products" className="primary-purple">Continue Shopping</Button><Button as={Link} to="/dashboard" variant="outline-light" className="secondary-button">Open Dashboard</Button></div></Card.Body></Card></Container></div>;
}
