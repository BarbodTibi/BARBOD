import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import StrongPassword from '../components/StrongPassword.jsx';
import brandMark from '../assets/barbod-mark.png';

export default function SignIn() {
  const [email, setEmail] = useState('demo@barbod.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (isSignedIn) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;

  function submit(event) {
    event.preventDefault();
    setError('');
    const ok = signIn(email, password);
    if (!ok) { setError('Please enter both your email and password.'); return; }
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  }

  return (
    <div className="signin-page">
      <Container className="signin-container">
        <Link to="/" className="brand-mark signin-brand"><span className="brand-icon"><img src={brandMark} alt="" /></span><span>BARBOD<span className="brand-dot">.</span></span></Link>
        <Card className="signin-card"><Card.Body>
          <div className="signin-icon"><i className="bi bi-shield-lock" /></div>
          <div className="eyebrow">ADMIN ACCESS</div>
          <h1>Welcome back</h1>
          <p className="signin-subtitle">Sign in to manage your BARBOD store.</p>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <Form onSubmit={submit}>
            <Form.Group className="mb-3"><Form.Label>Email address</Form.Label><Form.Control type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></Form.Group>
            <div className="mb-4"><StrongPassword value={password} onChange={setPassword} /></div>
            <Button type="submit" className="primary-purple w-100 py-2">Sign In <i className="bi bi-arrow-right ms-2" /></Button>
          </Form>
          <div className="demo-note"><i className="bi bi-info-circle me-2" />Demo sign-in accepts any non-empty email and password. This is not production authentication.</div>
        </Card.Body></Card>
        <div className="signin-back"><Link to="/" className="muted-link"><i className="bi bi-arrow-left me-2" />Back to store</Link></div>
      </Container>
    </div>
  );
}
