import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import StoreNavbar from '../components/StoreNavbar.jsx';
import ProductRating from '../components/ProductRating.jsx';
import { useShop } from '../context/ShopContext.jsx';
import formatPrice from '../utils/formatPrice.js';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { products, addToCart, apiStatus } = useShop();
  const [notice, setNotice] = useState('');
  const product = products.find((item) => item.id === Number(productId));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setNotice('');
  }, [productId]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function handleAdd() {
    const added = addToCart(product.id);
    setNotice(added ? 'Product added to your cart.' : 'This product is currently out of stock.');
  }

  return (
    <div className="catalog-page">
      <StoreNavbar />
      <Container className="product-detail-container">
        <div className="detail-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><span>{product?.title || 'Product details'}</span></div>
        {apiStatus.loading && !product ? <div className="detail-loading"><Spinner animation="border" /><span>Loading product details…</span></div> : !product ? (
          <div className="empty-state py-5"><i className="bi bi-box-seam fs-2 d-block mb-3" /><h1>Product not found</h1><p>This product may have been removed or is not available in the current catalog.</p><Button as={Link} to="/products" className="primary-purple">Back to products</Button></div>
        ) : (
          <Row className="g-4 g-lg-5 product-detail-layout">
            <Col lg={6}><div className="product-detail-image"><img src={product.image} alt={product.title} /></div></Col>
            <Col lg={6} className="product-detail-copy">
              <div className="eyebrow">BARBOD COLLECTION</div>
              <span className="detail-category">{product.category}</span>
              <h1>{product.title}</h1>
              <ProductRating product={product} />
              <div className="product-detail-price">{formatPrice(product.price)}</div>
              <p className="product-detail-description">{product.description || 'A thoughtfully selected find from the BARBOD collection.'}</p>
              <div className={`detail-stock ${product.stock <= 5 ? 'low' : ''}`}><i className={`bi ${product.stock > 0 ? 'bi-check-circle' : 'bi-x-circle'} me-2`} />{product.stock > 0 ? `${product.stock} available in inventory` : 'Currently out of stock'}</div>
              {notice && <Alert variant={notice.startsWith('Product added') ? 'success' : 'warning'} className="detail-notice">{notice}</Alert>}
              <div className="d-flex flex-wrap gap-2 mt-4"><Button className="primary-purple detail-add-button" onClick={handleAdd} disabled={product.stock <= 0}><i className="bi bi-bag-plus me-2" />Add to cart</Button><Button as={Link} to="/cart" variant="outline-light" className="secondary-button">View cart</Button></div>
              <div className="detail-feature-list"><div><i className="bi bi-truck" /><span><strong>Simple checkout</strong><small>No payment is processed</small></span></div><div><i className="bi bi-arrow-repeat" /><span><strong>Inventory linked</strong><small>Stock updates across store pages</small></span></div></div>
            </Col>
          </Row>
        )}
        <div className="detail-back-link"><Link to="/products"><i className="bi bi-arrow-left me-2" />Back to all products</Link></div>
      </Container>
    </div>
  );
}
