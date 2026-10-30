import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useShop } from '../context/ShopContext.jsx';

export default function ProductRating({ product, compact = false }) {
  const { rateProduct } = useShop();
  const [hovered, setHovered] = useState(0);
  const currentRating = Math.round(Number(product.userRating ?? product.rating) || 0);

  return (
    <div className={`product-rating-control ${compact ? 'product-rating-compact' : ''}`} aria-label={`Rating for ${product.title}`}>
      <div className="rating-stars" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="link"
            className={`rating-star ${star <= (hovered || currentRating) ? 'is-filled' : ''}`}
            aria-label={`Rate ${product.title} ${star} out of 5 stars`}
            aria-pressed={currentRating === star}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => rateProduct(product.id, star)}
          >
            <i className={`bi ${star <= (hovered || currentRating) ? 'bi-star-fill' : 'bi-star'}`} />
          </Button>
        ))}
      </div>
      <span className="rating-value">{currentRating ? `${currentRating}.0` : 'Rate it'}</span>
      {!compact && <span className="rating-hint">{product.userRating ? 'Your rating saved' : 'Tap a star to rate'}</span>}
    </div>
  );
}
