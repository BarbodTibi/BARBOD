import { Badge, Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import brandMark from '../assets/barbod-mark.png';

export default function StoreNavbar({ search, setSearch, showSearch = false }) {
  const { totalItems } = useShop();
  const { isSignedIn, signOut } = useAuth();
  return (
    <Navbar expand="lg" className="store-navbar" variant="dark">
      <Container fluid className="px-lg-4">
        <Navbar.Brand as={Link} to="/" className="brand-mark">
          <span className="brand-icon"><img src={brandMark} alt="" /></span>
          <span>BARBOD<span className="brand-dot">.</span></span>
        </Navbar.Brand>
        {showSearch && (
          <Form className="nav-search d-none d-lg-flex" onSubmit={(event) => event.preventDefault()}>
            <Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." aria-label="Search products" />
            <i className="bi bi-search" />
          </Form>
        )}
        <Navbar.Toggle aria-controls="store-navigation" />
        <Navbar.Collapse id="store-navigation" className="justify-content-end">
          {showSearch && <Form className="nav-search nav-search-mobile d-lg-none my-3" onSubmit={(event) => event.preventDefault()}><Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." aria-label="Search products" /><i className="bi bi-search" /></Form>}
          <Nav className="align-items-lg-center gap-lg-2 ms-auto">
            <Nav.Link as={NavLink} to="/products" className={({ isActive }) => `store-nav-link ${isActive ? 'active' : ''}`}>Products</Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard" className={({ isActive }) => `store-nav-link ${isActive ? 'active' : ''}`}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="store-nav-link cart-nav-link">
              <i className="bi bi-cart3 fs-5" /> <span>Cart</span> <Badge bg="purple" className="cart-count">{totalItems}</Badge>
            </Nav.Link>
            {isSignedIn ? (
              <Button variant="outline-light" className="nav-sign-button" onClick={signOut}><i className="bi bi-box-arrow-right me-2" />Sign Out</Button>
            ) : (
              <Button as={Link} to="/signin" variant="outline-light" className="nav-sign-button"><i className="bi bi-box-arrow-in-right me-2" />Sign In</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
