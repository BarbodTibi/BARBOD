import { useMemo, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

export default function StrongPassword({ value, onChange, label = 'Password', autoComplete = 'current-password' }) {
  const [show, setShow] = useState(false);
  const checks = useMemo(() => [
    value.length >= 8,
    /[a-z]/.test(value),
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^a-zA-Z0-9]/.test(value),
  ], [value]);
  const score = checks.filter(Boolean).length;
  const percent = value.length === 0 ? 0 : Math.round(score / checks.length * 100);
  const labelText = !value ? 'Enter a password' : score <= 2 ? 'Weak' : score <= 3 ? 'Fair' : score === 4 ? 'Strong' : 'Very strong';
  const tone = score <= 2 ? 'danger' : score <= 3 ? 'warning' : 'success';
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required minLength={1} aria-label={label} />
        <InputGroup.Text as="button" type="button" className="password-toggle" onClick={() => setShow((current) => !current)} aria-label={show ? 'Hide password' : 'Show password'}><i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} /></InputGroup.Text>
        {value && <InputGroup.Text as="button" type="button" className="password-toggle" onClick={() => onChange('')} aria-label="Clear password"><i className="bi bi-x-lg" /></InputGroup.Text>}
      </InputGroup>
      <div className="password-meter-header"><span>Password strength</span><span className={`text-${tone}`}>{labelText}</span></div>
      <div className="password-meter"><div className={`password-meter-fill bg-${tone}`} style={{ width: `${percent}%` }} /></div>
      <Form.Text className="muted-help">For a stronger password, use 8+ characters with upper/lowercase letters, a number, and a symbol.</Form.Text>
    </Form.Group>
  );
}
