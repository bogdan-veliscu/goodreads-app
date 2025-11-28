import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookList from './BookList';
import { Book } from '../../types/book.types';

describe('BookList', () => {
  it('renders a list of books', () => {
    const books: Book[] = [
      {
        id: '1',
        title: 'Test Book 1',
        description: 'Description 1',
      },
      {
        id: '2',
        title: 'Test Book 2',
        description: 'Description 2',
      },
    ];

    render(<BookList initialBooks={books} />);

    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  it('renders Add Book button', () => {
    render(<BookList />);
    expect(screen.getByRole('button', { name: /add new book/i })).toBeInTheDocument();
  });

  it('shows form when Add Book button is clicked', () => {
    render(<BookList initialBooks={[]} />);

    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId('book-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('hides Add Book button when form is visible', () => {
    render(<BookList initialBooks={[]} />);

    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);

    expect(screen.queryByRole('button', { name: /add new book/i })).not.toBeInTheDocument();
  });

  it('adds a new book when form is submitted', () => {
    const initialBooks: Book[] = [
      {
        id: '1',
        title: 'Existing Book',
        description: 'Existing description',
      },
    ];

    render(<BookList initialBooks={initialBooks} />);

    // Click add button to show form
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Test Book' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'New description' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    // Should now have 2 books (new book appears first)
    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems).toHaveLength(2);
    expect(screen.getByText('New Test Book')).toBeInTheDocument();
  });

  it('hides form and shows Add Book button after submission', () => {
    render(<BookList initialBooks={[]} />);

    // Show form
    fireEvent.click(screen.getByRole('button', { name: /add new book/i }));

    // Fill and submit
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Book' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    // Form should be hidden
    expect(screen.queryByTestId('book-form')).not.toBeInTheDocument();
    // Add button should reappear
    expect(screen.getByRole('button', { name: /add new book/i })).toBeInTheDocument();
  });

  it('hides form when Cancel button is clicked', () => {
    render(<BookList initialBooks={[]} />);

    // Show form
    fireEvent.click(screen.getByRole('button', { name: /add new book/i }));
    expect(screen.getByTestId('book-form')).toBeInTheDocument();

    // Click cancel
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Form should be hidden
    expect(screen.queryByTestId('book-form')).not.toBeInTheDocument();
    // Add button should reappear
    expect(screen.getByRole('button', { name: /add new book/i })).toBeInTheDocument();
  });

  it('uses mock data when no initial books provided', () => {
    render(<BookList />);

    // Should render mock books
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
  });

  it('renders BookItem components for each book', () => {
    const books: Book[] = [
      {
        id: '1',
        title: 'Book 1',
        description: 'Desc 1',
        imageUrl: 'https://example.com/image1.jpg',
      },
      {
        id: '2',
        title: 'Book 2',
        description: 'Desc 2',
      },
    ];

    render(<BookList initialBooks={books} />);

    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems).toHaveLength(2);
  });

  it('handles empty initial books array', () => {
    render(<BookList initialBooks={[]} />);

    // Should show Add Book button
    expect(screen.getByRole('button', { name: /add new book/i })).toBeInTheDocument();

    // Should not show any books initially
    expect(screen.queryByTestId('book-item')).not.toBeInTheDocument();
  });

  it('new books appear at the top of the list', () => {
    const initialBooks: Book[] = [
      {
        id: '1',
        title: 'Old Book',
        description: 'Old description',
      },
    ];

    render(<BookList initialBooks={initialBooks} />);

    // Add a new book via form
    fireEvent.click(screen.getByRole('button', { name: /add new book/i }));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Book' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    // Get all book items
    const bookItems = screen.getAllByTestId('book-item');

    // New book should be first
    expect(bookItems[0]).toHaveTextContent('New Book');
    expect(bookItems[1]).toHaveTextContent('Old Book');
  });
});
