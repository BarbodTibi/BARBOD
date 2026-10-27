# BARBOD — React + Vite + React-Bootstrap

A portfolio-ready storefront demo built with React, Vite, React Router, React-Bootstrap, and Bootstrap Icons.

## Run locally

```bash
npm install
npm run dev
```

## Product API

The catalog is loaded with `useEffect` from `src/context/ShopContext.jsx`. The request helper is `src/services/productApi.js` and uses DummyJSON:

`https://dummyjson.com/products?limit=30`

If the API cannot be reached, the app keeps the local demo catalog and displays a warning. This is a front-end demo: cart, ratings, inventory changes, and orders are stored in this browser's `localStorage`; they are not shared with other users or persisted to a server.

## Routes

- `/` — storefront home
- `/products` — searchable, filterable product catalog
- `/products/:productId` — dedicated product detail route inside the same SPA
- `/cart` — demo cart and checkout
- `/signin` — demo sign-in for the protected admin area
- `/dashboard` and `/admin/*` — demo dashboard and management pages

Click a product image or title to open its detail page. Browser navigation remains client-side through React Router.

## Product ratings

Customers can click a star in the product cards. Their selected rating is stored in `localStorage` and remains after refresh on the same browser. Because this project has no custom backend, ratings are not global/community ratings.

## Branding

The navbar uses the custom BARBOD “B” mark at `src/assets/barbod-mark.png`.

## Notes

- `node_modules` is intentionally not included; install dependencies with `npm install`.
- This is a portfolio demo, not a production-ready commerce site. Real authentication, server-side order storage, and payment processing require a backend and are not implemented.
- API catalog refreshes preserve local stock/rating edits and locally created products; locally deleted API products are recorded in this browser’s demo storage. Clearing local storage resets those demo changes.


## API and logo troubleshooting
- Products load from `https://dummyjson.com/products?limit=30` in `src/services/productApi.js`.
- The home page displays an API status alert and a Retry API button if the request fails.
- If your browser still shows old cached data, hard-refresh with `Ctrl + Shift + R`. You can also clear this demo's local storage in DevTools > Application > Local Storage by removing keys starting with `barbod_`.
- The transparent B monogram is stored at `src/assets/barbod-mark.png` and imported by `src/components/StoreNavbar.jsx`.
- This is a frontend demo: ratings and stock are saved in the current browser only.
