import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StoreNavbar from '../components/StoreNavbar.jsx';
import { useShop } from '../context/ShopContext.jsx';
import formatPrice from '../utils/formatPrice.js';
import ProductRating from '../components/ProductRating.jsx';

export default function Home() {
  const { products, addToCart, apiStatus, refreshProducts } = useShop();
  const [notice, setNotice] = useState('');
  const featured = products.slice(0, 4);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);
  function add(product) {
    const success = addToCart(product.id);
    setNotice(success ? `${product.title} added to your cart.` : `${product.title} is currently out of stock.`);
  }
  return (
    <div className="store-page">
      <StoreNavbar />
      <div className="announcement"><i className="bi bi-stars me-2" />Welcome to everything shop</div>
      {apiStatus.loading && <Container className="pt-3"><div className="alert alert-info py-2 mb-0"><span className="spinner-border spinner-border-sm me-2" role="status" />Loading products from API…</div></Container>}
      {apiStatus.error && <Container className="pt-3"><div className="alert alert-warning py-2 mb-0 d-flex flex-wrap align-items-center justify-content-between gap-2"><span>{apiStatus.error}</span><Button size="sm" variant="outline-dark" onClick={refreshProducts} disabled={apiStatus.loading}>Retry API</Button></div></Container>}
      <Container className="store-main">
        <section className="hero-section">
          <div className="hero-copy"><Badge bg="purple" className="hero-badge"><i className="bi bi-stars me-2" />CURATED FOR YOUR EVERYDAY</Badge><h1>Find your next<br /><span>favorite thing.</span></h1><p>Thoughtful essentials, expressive design, and everyday finds — all in one place.</p><div className="hero-actions"><Button as={Link} to="/products" className="primary-purple btn-lg">Explore Collection <i className="bi bi-arrow-up-right ms-2" /></Button><Button as={Link} to="/dashboard" variant="outline-light" className="secondary-button btn-lg">Open Dashboard</Button></div><div className="hero-trust"><div className="trust-item"><i className="bi bi-box-seam" /><span>Curated products</span></div><div className="trust-item"><i className="bi bi-heart" /><span>Made for everyday</span></div><div className="trust-item"><i className="bi bi-truck" /><span>Easy checkout demo</span></div></div></div>
          <div className="hero-visual"><div className="hero-orb orb-one" /><div className="hero-orb orb-two" /><div className="hero-image-main"><img src={products[0]?.image} alt="Featured sneaker" /></div><div className="hero-floating-card"><div className="floating-icon"><i className="bi bi-stars" /></div><div><span>Featured pick</span><strong>{products[0]?.title || 'Everyday Essentials'}</strong><b>{formatPrice(products[0]?.price || 120)}</b></div></div></div>
        </section>
        <section className="benefit-strip"><Row className="g-3">{[{icon:'bi-truck',title:'Fast & simple',text:'A smooth shopping experience'},{icon:'bi-shield-check',title:'Thoughtfully chosen',text:'Quality picks for daily life'},{icon:'bi-arrow-repeat',title:'Easy cart control',text:'Update quantities any time'},{icon:'bi-headset',title:'Here to help',text:'We make it straightforward'}].map((item) => <Col sm={6} lg={3} key={item.title}><div className="benefit-item"><div className="benefit-icon"><i className={`bi ${item.icon}`} /></div><div><strong>{item.title}</strong><span>{item.text}</span></div></div></Col>)}</Row></section>
        <section className="featured-section"><div className="store-section-heading"><div><div className="eyebrow">HANDPICKED FOR YOU</div><h2>Featured products</h2><p>Everyday favorites worth a closer look.</p></div><Button as={Link} to="/products" variant="outline-light" className="secondary-button">View all products <i className="bi bi-arrow-right ms-2" /></Button></div>
          {notice && <div className="store-toast"><i className="bi bi-check-circle me-2" />{notice}</div>}
          <Row className="g-3 g-lg-4">{featured.map((product) => <Col sm={6} xl={3} key={product.id}><Card className="store-product-card h-100"><div className="store-product-image"><Link to={`/products/${product.id}`} className="product-card-link" aria-label={`View details for ${product.title}`}><img src={product.image} alt={product.title} loading="lazy" /></Link><span className="category-pill">{product.category}</span><button className="wishlist-button" type="button" aria-label={`Favorite ${product.title}`} onClick={(event) => event.currentTarget.classList.toggle('liked')}><i className="bi bi-heart" /></button></div><Card.Body className="d-flex flex-column"><ProductRating product={product} compact /><Card.Title><Link to={`/products/${product.id}`} className="product-title-link">{product.title}</Link></Card.Title><Card.Text>{product.description}</Card.Text><div className="mt-auto d-flex align-items-center justify-content-between gap-2"><strong className="store-price">{formatPrice(product.price)}</strong><Button size="sm" className="add-cart-button" onClick={() => add(product)} disabled={product.stock <= 0}><i className="bi bi-plus-lg me-1" />Add</Button></div><div className="product-stock-note">{product.stock <= 5 ? `${product.stock} left in stock` : 'In stock and ready'}</div></Card.Body></Card></Col>)}</Row>
        </section>
        <section className="cta-band"><div><div className="eyebrow">BUILT FOR YOUR STORE</div><h2>Take a closer look behind the scenes.</h2><p>Manage inventory, review orders, and keep your catalog up to date.</p></div><Button as={Link} to="/dashboard" className="primary-purple">Go to Dashboard <i className="bi bi-arrow-right ms-2" /></Button></section>
      </Container>
      <footer className="store-footer"><Container className="d-flex flex-column flex-md-row justify-content-between gap-3"><div><Link to="/" className="footer-brand">BARBOD<span>.</span></Link><p>Beauty. Fragrances. Furniture. And everyday favorites.</p></div><div className="footer-right">© {new Date().getFullYear()} barbod</div></Container></footer>
    </div>
  );
}
