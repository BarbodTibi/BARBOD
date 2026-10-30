import { useState } from 'react';
import { Badge, Button, Container, Form, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import brandMark from '../assets/barbod-mark.png';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi-house-door' },
  { to: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
  { to: '/admin/orders', label: 'Orders', icon: 'bi-cart3' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'bi-archive' },
  { to: '/admin/settings', label: 'Settings', icon: 'bi-gear' },
];

function SidebarContent({ onNavigate }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { orders } = useShop();
  function exit() { signOut(); navigate('/'); }
  return (
    <div className="sidebar-content">
      <div className="sidebar-profile">
        <div className="avatar-circle"><i className="bi bi-person-fill" /></div>
        <div className="min-w-0"><div className="welcome-text">Welcome back,</div><div className="profile-email text-truncate">{user?.email || 'demo@barbod.com'}</div></div>
      </div>
      <Nav className="flex-column sidebar-nav">
        {menuItems.map((item) => (
          <Nav.Link key={item.to} as={NavLink} to={item.to} end={item.to === '/dashboard'} onClick={onNavigate} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className={`bi ${item.icon}`} /><span>{item.label}</span>
            {item.to === '/admin/orders' && orders.length > 0 && <Badge bg="purple" className="ms-auto">{orders.length}</Badge>}
          </Nav.Link>
        ))}
      </Nav>
      <div className="sidebar-bottom-card">
        <div className="sidebar-exit-icon"><i className="bi bi-box-arrow-right" /></div>
        <div className="flex-grow-1"><button type="button" className="sidebar-logout" onClick={exit}>Sign Out</button><div className="sidebar-hint">Get back to the store</div></div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { totalItems } = useShop();
  const [search, setSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="admin-app">
      <Navbar className="admin-topbar" variant="dark" expand={false}>
        <Container fluid className="px-3 px-lg-4">
          <Button variant="link" className="mobile-menu-button d-lg-none" onClick={() => setShowSidebar(true)} aria-label="Open menu"><i className="bi bi-list fs-3" /></Button>
          <Navbar.Brand as={Link} to="/" className="brand-mark mb-0">
            <span className="brand-icon"><img src={brandMark} alt="" /></span><span>BARBOD<span className="brand-dot">.</span></span>
          </Navbar.Brand>
          <Form className="nav-search admin-search d-none d-md-flex" onSubmit={(event) => event.preventDefault()}>
            <Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." aria-label="Search products" />
            <i className="bi bi-search" />
          </Form>
          <div className="topbar-actions ms-auto">
            <Nav.Link as={Link} to="/products" className="topbar-link d-none d-md-inline-flex">Products</Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="topbar-link selected d-none d-md-inline-flex">Dashboard</Nav.Link>
            <Button as={Link} to="/cart" variant="link" className="topbar-cart" aria-label="Open cart"><i className="bi bi-cart3" /><span className="topbar-cart-count">{totalItems}</span></Button>
            <Button as={Link} to="/" variant="outline-light" className="topbar-signout d-none d-sm-inline-flex"><i className="bi bi-box-arrow-up-right me-2" />Store</Button>
          </div>
        </Container>
      </Navbar>
      <div className="admin-body">
        <aside className="admin-sidebar d-none d-lg-flex"><SidebarContent /></aside>
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="admin-mobile-sidebar" placement="start">
          <Offcanvas.Header closeButton closeVariant="white"><Offcanvas.Title className="brand-mark">BARBOD<span className="brand-dot">.</span></Offcanvas.Title></Offcanvas.Header>
          <Offcanvas.Body className="p-0"><SidebarContent onNavigate={() => setShowSidebar(false)} /></Offcanvas.Body>
        </Offcanvas>
        <main className="admin-main"><Container fluid className="admin-content"><Outlet /></Container></main>
      </div>
    </div>
  );
}
