const API_URL = 'https://dummyjson.com/products?limit=30';

function normalizeProduct(product) {
  return {
    id: Number(product.id),
    title: product.title || 'Untitled product',
    category: product.category || 'General',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    rating: Number(product.rating) || 0,
    image: product.thumbnail || product.image || product.images?.[0] || '',
    description: product.description || '',
  };
}

export async function getProducts(signal) {
  let response;
  try {
    response = await fetch(API_URL, signal ? { signal } : undefined);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Network error while requesting DummyJSON');
  }
  if (!response.ok) throw new Error(`Products API failed (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data.products)) throw new Error('Unexpected products API response');
  return data.products.map(normalizeProduct);
}
