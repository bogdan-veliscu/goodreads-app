import { useState, useId } from 'react';
import { BookFormProps, BookFormData } from '../../types/book.types';
import './BookForm.css';

function BookForm({ onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<{ title?: string }>({});

  const titleId = useId();
  const descriptionId = useId();
  const imageUrlId = useId();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'title' && errors.title) {
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
    });
  };

  const inputClass = errors.title
    ? 'bookForm__input bookForm__input--error'
    : 'bookForm__input';

  return (
    <form onSubmit={handleSubmit} className="bookForm" data-testid="book-form">
      <h2 className="bookForm__heading">Add New Book</h2>

      <div className="bookForm__field">
        <label htmlFor={titleId} className="bookForm__label">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id={titleId}
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={inputClass}
          aria-required="true"
          {...(errors.title && { 'aria-invalid': 'true' })}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
        />
        {errors.title && (
          <div id={`${titleId}-error`} className="bookForm__error" role="alert">
            {errors.title}
          </div>
        )}
      </div>

      <div className="bookForm__field">
        <label htmlFor={imageUrlId} className="bookForm__label">
          Image URL
        </label>
        <input
          id={imageUrlId}
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="bookForm__input"
          placeholder="https://example.com/book-cover.jpg"
        />
      </div>

      <div className="bookForm__field">
        <label htmlFor={descriptionId} className="bookForm__label">
          Description
        </label>
        <textarea
          id={descriptionId}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bookForm__textarea"
          placeholder="Enter a brief description of the book..."
        />
      </div>

      <div className="bookForm__buttonContainer">
        <button type="submit" className="bookForm__submitButton">
          Add Book
        </button>
        <button type="button" onClick={onCancel} className="bookForm__cancelButton">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BookForm;
