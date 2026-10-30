import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seedOrders, seedProducts } from '../data/seed.js';
import { getProducts } from '../services/productApi.js';

const ShopContext = createContext(null);

function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => loadStorage('barbod_products_v1', seedProducts));
  const [apiStatus, setApiStatus] = useState({ loading: true, error: '' });
  const [deletedProductIds, setDeletedProductIds] = useState(() => loadStorage('barbod_deleted_products_v1', []));
  const [cart, setCart] = useState(() => loadStorage('barbod_cart_v1', {}));
  const [orders, setOrders] = useState(() => loadStorage('barbod_orders_v1', seedOrders));

  // Fetch the live catalog on mount and whenever the user retries.
  const refreshProducts = useCallback(async (signal) => {
    setApiStatus({ loading: true, error: '' });
    try {
      const remoteProducts = await getProducts(signal);
      setProducts((current) => {
        const localById = new Map(current.map((item) => [Number(item.id), item]));
        const deleted = new Set(loadStorage('barbod_deleted_products_v1', []));
        const remoteIds = new Set(remoteProducts.map((item) => Number(item.id)));
        const mergedRemote = remoteProducts.filter((remote) => !deleted.has(Number(remote.id))).map((remote) => {
          const local = localById.get(Number(remote.id));
          return local
            ? { ...remote, ...(local.localEdits ? local : {}), id: remote.id, stock: local.stock, rating: local.userRating ?? remote.rating, userRating: local.userRating, description: local.localEdits ? local.description : remote.description }
            : remote;
        });
        const localOnly = current.filter((item) => !remoteIds.has(Number(item.id)) && !deleted.has(Number(item.id)));
        return [...localOnly, ...mergedRemote];
      });
      setApiStatus({ loading: false, error: '', count: remoteProducts.length, updatedAt: new Date().toISOString() });
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        setApiStatus((current) => ({ ...current, loading: false }));
        return false;
      }
      setApiStatus({ loading: false, error: 'Could not reach DummyJSON API. Showing saved/demo products.' });
      return false;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshProducts(controller.signal);
    return () => controller.abort();
  }, [refreshProducts]);

  useEffect(() => localStorage.setItem('barbod_products_v1', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('barbod_cart_v1', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('barbod_orders_v1', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('barbod_deleted_products_v1', JSON.stringify(deletedProductIds)), [deletedProductIds]);

  const addToCart = useCallback((id, amount = 1) => {
    const product = products.find((item) => item.id === Number(id));
    const quantity = cart[id] || 0;
    if (!product || amount < 1 || product.stock < amount) return false;
    setProducts((current) => current.map((item) => item.id === Number(id) ? { ...item, stock: item.stock - amount } : item));
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + amount }));
    return true;
  }, [products, cart]);

  const changeQuantity = useCallback((id, amount) => {
    const product = products.find((item) => item.id === Number(id));
    const quantity = cart[id] || 0;
    if (!product || amount === 0 || quantity + amount < 0) return false;
    if (amount > 0 && product.stock < amount) return false;
    setProducts((current) => current.map((item) => item.id === Number(id) ? { ...item, stock: item.stock - amount } : item));
    setCart((current) => {
      const next = { ...current };
      const updated = quantity + amount;
      if (updated === 0) delete next[id];
      else next[id] = updated;
      return next;
    });
    return true;
  }, [products, cart]);

  const removeFromCart = useCallback((id) => {
    const quantity = cart[id] || 0;
    if (!quantity) return;
    setProducts((current) => current.map((item) => item.id === Number(id) ? { ...item, stock: item.stock + quantity } : item));
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, [cart]);

  const clearCart = useCallback(() => {
    if (Object.keys(cart).length) {
      setProducts((current) => current.map((item) => ({ ...item, stock: item.stock + (cart[item.id] || 0) })));
    }
    setCart({});
  }, [cart]);

  const updateStock = useCallback((id, amount) => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return false;
    setProducts((current) => current.map((item) => item.id === Number(id) ? { ...item, stock: item.stock + numericAmount } : item));
    return true;
  }, []);

  const addProduct = useCallback((product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts((current) => [newProduct, ...current]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((current) => current.map((item) => item.id === Number(id) ? { ...item, ...updates, localEdits: true, id: item.id } : item));
  }, []);

  const deleteProduct = useCallback((id) => {
    const quantity = cart[id] || 0;
    setDeletedProductIds((current) => current.includes(Number(id)) ? current : [...current, Number(id)]);
    setProducts((current) => current.filter((item) => item.id !== Number(id)));
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    return quantity;
  }, [cart]);

  const rateProduct = useCallback((id, rating) => {
    setProducts((current) => current.map((item) => item.id === Number(id) ? { ...item, rating: Number(rating), userRating: Number(rating) } : item));
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((current) => current.map((order) => order.id === Number(id) ? { ...order, status } : order));
  }, []);

  const checkout = useCallback(({ customer, email }) => {
    const entries = products.filter((product) => (cart[product.id] || 0) > 0);
    if (!entries.length) return null;
    const items = entries.map((product) => ({
      productId: product.id,
      title: product.title,
      quantity: cart[product.id],
      price: product.price,
      image: product.image,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const nextOrder = {
      id: Date.now(),
      customer: customer?.trim() || 'Guest Customer',
      email: email?.trim() || 'guest@example.com',
      date: new Date().toISOString(),
      status: 'Processing',
      subtotal,
      tax,
      total,
      items,
    };
    setOrders((current) => [nextOrder, ...current]);
    setCart({});
    return nextOrder;
  }, [products, cart]);

  const totalItems = useMemo(() => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0), [cart]);
  const totalPrice = useMemo(() => products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0), [products, cart]);

  const value = useMemo(() => ({
    products, setProducts, apiStatus, refreshProducts, cart, orders, setOrders, addToCart, changeQuantity,
    removeFromCart, clearCart, updateStock, addProduct, updateProduct,
    deleteProduct, rateProduct, updateOrderStatus, checkout, totalItems, totalPrice,
  }), [products, apiStatus, refreshProducts, cart, orders, addToCart, changeQuantity, removeFromCart, clearCart, updateStock, addProduct, updateProduct, deleteProduct, rateProduct, updateOrderStatus, checkout, totalItems, totalPrice]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider');
  return context;
}
