import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';

export default function Settings() {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('BARBOD');
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);
  function save(event) { event.preventDefault(); localStorage.setItem('barbod_settings_v1', JSON.stringify({ storeName, currency })); setSaved(true); }
  return (
    <>
      <div className="page-heading"><h1>Settings</h1><p>Manage basic store preferences.</p></div>
      {saved && <Alert variant="success" dismissible onClose={() => setSaved(false)} className="soft-alert">Store preferences saved in this browser.</Alert>}
      <Card className="dashboard-card settings-card"><Card.Body><h2 className="settings-section-title">Store preferences</h2><p className="section-subtitle mb-4"></p><Form onSubmit={save}><Form.Group className="mb-3"><Form.Label>Store name</Form.Label><Form.Control value={storeName} onChange={(event) => setStoreName(event.target.value)} required /></Form.Group><Form.Group className="mb-3"><Form.Label>Currency</Form.Label><Form.Select value={currency} onChange={(event) => setCurrency(event.target.value)}><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option></Form.Select></Form.Group><Form.Group className="mb-4"><Form.Label>Signed-in email</Form.Label><Form.Control value={user?.email || ''} readOnly /></Form.Group><Button type="submit" className="primary-purple">Save Settings</Button></Form></Card.Body></Card>
     
    </>
  );
}
