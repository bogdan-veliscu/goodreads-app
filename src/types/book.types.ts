export interface Book {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface BookItemProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface BookListProps {
  initialBooks?: Book[];
}

export interface BookFormData {
  title: string;
  description: string;
  imageUrl: string;
}

export interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}
