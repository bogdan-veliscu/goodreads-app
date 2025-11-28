import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookItem from './BookItem';

describe('BookItem', () => {
  it('renders book title correctly', () => {
    render(<BookItem title="Test Book" />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('renders as an article element for semantic HTML', () => {
    render(<BookItem title="Test Book" />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('hides description initially', () => {
    render(
      <BookItem
        title="Test Book"
        description="This is a test description"
      />
    );
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();
  });

  it('toggles description visibility when button is clicked', () => {
    render(
      <BookItem
        title="Test Book"
        description="This is a test description"
      />
    );

    const toggleButton = screen.getByRole('button', { name: /show description/i });

    // Description should be hidden initially
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();

    // Click to show
    fireEvent.click(toggleButton);

    // Description should be visible
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide description/i })).toBeInTheDocument();

    // Click to hide again
    fireEvent.click(toggleButton);

    // Description should be hidden again
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    render(<BookItem title="Test Book" />);

    const toggleButton = screen.getByRole('button', { name: /show|hide/i });
    expect(toggleButton).toBeInTheDocument();

    // When toggled with no description, should show placeholder
    fireEvent.click(toggleButton);
    expect(screen.getByText(/no description available/i)).toBeInTheDocument();
  });

  it('renders image when valid imageUrl is provided', () => {
    const { container } = render(
      <BookItem
        title="Test Book"
        imageUrl="https://example.com/image.jpg"
      />
    );

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows placeholder message when image fails to load', () => {
    const { container } = render(
      <BookItem
        title="Test Book"
        imageUrl="https://invalid-url.com/image.jpg"
      />
    );

    const image = container.querySelector('img');

    // Simulate image error
    fireEvent.error(image!);

    // Should show placeholder
    expect(screen.getByText(/no cover/i)).toBeInTheDocument();
  });

  it('shows placeholder when imageUrl is not provided', () => {
    render(<BookItem title="Test Book" />);

    expect(screen.getByText(/no cover/i)).toBeInTheDocument();
  });

  it('has proper aria-expanded attribute on toggle button', () => {
    render(
      <BookItem
        title="Test Book"
        description="This is a test description"
      />
    );

    const toggleButton = screen.getByRole('button', { name: /show description/i });

    // Initially collapsed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-controls linking button to description region', () => {
    render(
      <BookItem
        title="Test Book"
        description="This is a test description"
      />
    );

    const toggleButton = screen.getByRole('button', { name: /show description/i });

    // Button should have aria-controls
    expect(toggleButton).toHaveAttribute('aria-controls');

    // Click to show description
    fireEvent.click(toggleButton);

    // The controlled region should exist with matching id
    const controlledId = toggleButton.getAttribute('aria-controls');
    const descriptionRegion = document.getElementById(controlledId!);
    expect(descriptionRegion).toBeInTheDocument();
    expect(descriptionRegion).toHaveTextContent('This is a test description');
  });

  it('supports keyboard interaction', () => {
    render(
      <BookItem
        title="Test Book"
        description="This is a test description"
      />
    );

    const toggleButton = screen.getByRole('button', { name: /show description/i });

    // Focus the button
    toggleButton.focus();
    expect(toggleButton).toHaveFocus();

    // Simulate Enter key press
    fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' });
    fireEvent.click(toggleButton); // buttons respond to click on Enter

    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });
});
