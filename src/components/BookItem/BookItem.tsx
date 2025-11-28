import { useState, useId } from 'react';
import { BookItemProps } from '../../types/book.types';
import './BookItem.css';

function BookItem({ title, description, imageUrl }: BookItemProps) {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const descriptionId = useId();

  const toggleDescription = () => {
    setIsDescriptionVisible((prev) => !prev);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const buttonClass = isDescriptionVisible
    ? 'bookItem__button bookItem__button--hide'
    : 'bookItem__button bookItem__button--show';

  const ariaExpandedProps = isDescriptionVisible
    ? { 'aria-expanded': 'true' as const }
    : { 'aria-expanded': 'false' as const };

  return (
    <article className="bookItem" data-testid="book-item">
      <div className="bookItem__imageContainer" aria-hidden="true">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt=""
            className="bookItem__image"
            onError={handleImageError}
          />
        ) : (
          <div className="bookItem__placeholder">No cover</div>
        )}
      </div>

      <div className="bookItem__content">
        <h3 className="bookItem__title">{title}</h3>

        <button
          type="button"
          onClick={toggleDescription}
          className={buttonClass}
          {...ariaExpandedProps}
          aria-controls={descriptionId}
        >
          {isDescriptionVisible ? 'Hide' : 'Show'} description
        </button>

        {isDescriptionVisible && (
          <div
            id={descriptionId}
            className="bookItem__description"
            role="region"
            aria-label={`Description for ${title}`}
          >
            {description || 'No description available.'}
          </div>
        )}
      </div>
    </article>
  );
}

export default BookItem;
