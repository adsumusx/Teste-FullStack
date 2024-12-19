export interface Field {
  id: string;
  name: string;
  datatype: "string" | "number" | "boolean" | "date";
  isRequired: boolean;
  createdAt: string;
}

export interface Fill {
  id: string;
  fieldId: string;
  value: string | number | boolean | Date;
  createdAt: string;
  isRequired: boolean;
  field?: Field;
}

export type EditItem = Partial<Field> | Partial<Fill>;

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: EditItem) => void;
  item: Field | Fill | null;
  mode: "field" | "fill";
}

export interface ApiError {
  error: string;
  details?: Array<{ path: string; message: string }>;
}

export interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
}
