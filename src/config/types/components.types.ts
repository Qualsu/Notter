import type { DropzoneOptions } from "react-dropzone"
import type * as React from "react"
import type { Doc } from "../../../convex/_generated/dataModel"

export type PriceCalculation = {
  price: number;
  oldPrice: number;
};

export interface CoverImageProps {
  url?: string
  preview?: boolean
}

export interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

export type InputProps = {
  width?: number;
  height?: number;
  className?: string;
  value?: File | string;
  onChange?: (file?: File) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

export interface IconPickerPorps {
  onChange: (icon: string) => void
  children: React.ReactNode
  asChild?: boolean
}

export interface ToolbarProps {
  initialData: Doc<"documents">
  preview?: boolean
}

export interface ConfirmmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}