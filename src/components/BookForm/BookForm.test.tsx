import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from './BookForm';

describe('BookForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders form with all fields', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders submit and cancel buttons', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty title', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Book Title' },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: 'https://example.com/image.jpg' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test description' },
    });

    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Book Title',
      imageUrl: 'https://example.com/image.jpg',
      description: 'Test description',
    });
  });

  it('submits form with only required title', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Only Title' },
    });

    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Only Title',
      imageUrl: '',
      description: '',
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('trims whitespace from input values', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: '  Trimmed Title  ' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: '  Trimmed description  ' },
    });

    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Trimmed Title',
      imageUrl: '',
      description: 'Trimmed description',
    });
  });

  it('clears error when user starts typing in title field', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Submit empty form to trigger error
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Start typing in title field
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'N' },
    });

    // Error should be cleared
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<BookForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toHaveAttribute('aria-required', 'true');

    // Submit to trigger error state
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
  });
});
