import { useEffect, useState } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';

const blankProduct = { title: '', category: 'Electronics', price: '0', stock: '0', rating: '4.0', image: '', description: '' };

export default function ProductEditorModal({ show, onHide, product, onSave }) {
  const [form, setForm] = useState(blankProduct);
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    if (show) {
      setForm(product ? { ...product, price: String(product.price), stock: String(product.stock), rating: String(product.rating) } : { ...blankProduct, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85' });
      setValidated(false);
    }
  }, [show, product]);
  function update(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); }
  function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!formElement.checkValidity()) { event.stopPropagation(); setValidated(true); return; }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating), title: form.title.trim(), category: form.category.trim(), image: form.image.trim() || 'https://placehold.co/600x600/191a35/c5b2ff?text=BARBOD' });
    onHide();
  }
  return (
    <Modal show={show} onHide={onHide} centered className="dark-modal">
      <Form noValidate validated={validated} onSubmit={submit}>
        <Modal.Header closeButton><Modal.Title>{product ? 'Edit Product' : 'Add Product'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3"><Form.Label>Product name</Form.Label><Form.Control required name="title" value={form.title} onChange={update} placeholder="e.g. Studio Headphones" /></Form.Group>
          <Row className="g-3">
            <Col sm={6}><Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Select name="category" value={form.category} onChange={update}><option>Electronics</option><option>Shoes</option><option>Bags</option><option>Clothing</option><option>Home</option><option>Lifestyle</option><option>Accessories</option></Form.Select></Form.Group></Col>
            <Col sm={6}><Form.Group className="mb-3"><Form.Label>Price ($)</Form.Label><Form.Control required type="number" min="0" step="0.01" name="price" value={form.price} onChange={update} /></Form.Group></Col>
            <Col sm={6}><Form.Group className="mb-3"><Form.Label>Stock</Form.Label><Form.Control required type="number" min="0" step="1" name="stock" value={form.stock} onChange={update} /></Form.Group></Col>
            <Col sm={6}><Form.Group className="mb-3"><Form.Label>Rating (0–5)</Form.Label><Form.Control required type="number" min="0" max="5" step="0.1" name="rating" value={form.rating} onChange={update} /></Form.Group></Col>
          </Row>
          <Form.Group className="mb-3"><Form.Label>Image URL</Form.Label><Form.Control name="image" value={form.image} onChange={update} placeholder="https://..." /></Form.Group>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={update} /></Form.Group>
        </Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={onHide}>Cancel</Button><Button type="submit" className="primary-purple">{product ? 'Save Changes' : 'Add Product'}</Button></Modal.Footer>
      </Form>
    </Modal>
  );
}
