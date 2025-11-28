import { useState } from 'react';
import { Book, BookListProps, BookFormData } from '../../types/book.types';
import BookItem from '../BookItem/BookItem';
import BookForm from '../BookForm/BookForm';
import { mockBooks } from '../../data/mockBooks';
import './BookList.css';

function BookList({ initialBooks }: BookListProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks ?? mockBooks);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const generateBookId = (): string => {
    return `book-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  const handleAddBook = (formData: BookFormData) => {
    const newBook: Book = {
      id: generateBookId(),
      title: formData.title,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
    };

    setBooks((prevBooks) => [newBook, ...prevBooks]);
    setIsFormVisible(false);
  };

  const handleShowForm = () => {
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="bookList" data-testid="book-list">
      <div className="bookList__header">
        <div className="bookList__titleContainer">
          <h1 className="bookList__title">My Reading List</h1>
          <p className="bookList__subtitle">{books.length} books in your collection</p>
        </div>
        {!isFormVisible && (
          <button
            type="button"
            onClick={handleShowForm}
            className="bookList__addButton"
            aria-label="Add new book"
          >
            + Add Book
          </button>
        )}
      </div>

      {isFormVisible && (
        <BookForm onSubmit={handleAddBook} onCancel={handleCancelForm} />
      )}

      <div className="bookList__grid">
        {books.map((book) => (
          <BookItem
            key={book.id}
            title={book.title}
            description={book.description}
            imageUrl={book.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;
