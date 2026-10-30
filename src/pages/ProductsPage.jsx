import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import StoreNavbar from '../components/StoreNavbar.jsx';
import { useShop } from '../context/ShopContext.jsx';
import formatPrice from '../utils/formatPrice.js';
import ProductRating from '../components/ProductRating.jsx';

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { products, addToCart, apiStatus } = useShop();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category))], [products]);
  const filtered = useMemo(() => {
    let result = products.filter((product) => (category === 'All' || product.category === category) && `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase()));
    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, category, search, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search, category, sort]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);
  function add(product) {
    const success = addToCart(product.id);
    setNotice(success ? `${product.title} added to cart.` : `${product.title} is out of stock.`);
  }
  return (
    <div className="catalog-page"><StoreNavbar search={search} setSearch={setSearch} showSearch />
      <Container className="catalog-container">
        {apiStatus.loading && <div className="alert alert-info py-2"><span className="spinner-border spinner-border-sm me-2" role="status" />Loading products from API…</div>}
        {apiStatus.error && <div className="alert alert-warning py-2">{apiStatus.error}</div>}
        <div className="page-heading catalog-heading"><div><div className="eyebrow">BARBOD COLLECTION</div><h1>All <span>Products</span></h1><p>Explore the collection and find your next favorite.</p></div><div className="catalog-count"><strong>{filtered.length}</strong><span>products found</span></div></div>
        <div className="catalog-toolbar"><div className="category-chips">{categories.map((item) => <Button key={item} variant={category === item ? 'primary' : 'outline-secondary'} className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => setCategory(item)}>{item}</Button>)}</div><Form.Select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></Form.Select></div>
        {notice && <div className="store-toast mb-3"><i className="bi bi-check-circle me-2" />{notice}</div>}
        {visible.length === 0 ? <div className="empty-state py-5"><i className="bi bi-search fs-2 d-block mb-3" /><h2>No products found</h2><p>Try another search or category.</p><Button variant="outline-light" className="secondary-button" onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters</Button></div> : <Row className="g-3 g-lg-4">{visible.map((product) => <Col sm={6} lg={4} xl={3} key={product.id}><Card className="store-product-card h-100"><Link to={`/products/${product.id}`} className="product-card-link" aria-label={`View details for ${product.title}`}><div className="store-product-image"><img src={product.image} alt={product.title} loading="lazy" /><span className="category-pill">{product.category}</span></div></Link><Card.Body className="d-flex flex-column"><ProductRating product={product} compact /><Card.Title><Link to={`/products/${product.id}`} className="product-title-link">{product.title}</Link></Card.Title><Card.Text>{product.description}</Card.Text><div className="mt-auto d-flex justify-content-between align-items-center gap-2"><strong className="store-price">{formatPrice(product.price)}</strong><Button className="add-cart-button" size="sm" onClick={() => add(product)} disabled={product.stock <= 0}><i className="bi bi-plus-lg me-1" />Add</Button></div><div className="product-stock-note">{product.stock <= 5 ? `${product.stock} left in stock` : 'In stock and ready'}</div></Card.Body></Card></Col>)}</Row>}
        {totalPages > 1 && <nav className="pagination-controls" aria-label="Product pages"><Button variant="outline-light" className="secondary-button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}><i className="bi bi-chevron-left me-2" />Previous</Button><div className="pagination-numbers">{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <Button key={item} className={page === item ? 'page-number active' : 'page-number'} onClick={() => setPage(item)}>{item}</Button>)}</div><Button variant="outline-light" className="secondary-button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Next<i className="bi bi-chevron-right ms-2" /></Button></nav>}
      </Container>
      <footer className="store-footer"><Container className="d-flex justify-content-between flex-wrap gap-2"><Link to="/" className="footer-brand">BARBOD<span>.</span></Link><span className="footer-right">© {new Date().getFullYear()} BARBOD. All rights reserved.</span></Container></footer>
    </div>
  );
}
