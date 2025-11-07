// api.ts

import { CreateDocument, UpdateDocument } from "./types";

const API_URL = "http://localhost:5000";  // Адрес вашего FastAPI сервера

// Создание нового документа
export const createDocument = async (doc: CreateDocument) => {
  const response = await fetch(`${API_URL}/documents/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  });

  if (!response.ok) {
    throw new Error("Failed to create document");
  }

  const data = await response.json();
  return data as Document;
};

// Получение документа по ID
export const getDocumentById = async (id: string) => {
  const response = await fetch(`${API_URL}/documents/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch document");
  }

  const data = await response.json();
  return data as Document;
};

// Обновление документа
export const updateDocument = async (id: string, updates: UpdateDocument) => {
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update document");
  }

  const data = await response.json();
  return data as Document;
};

// Удаление документа
export const deleteDocument = async (id: string) => {
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }

  const data = await response.json();
  return data as Document;
};

// Получение списка документов (например, для боковой панели)
export const getSidebarDocuments = async (userId: string, parentDocument?: string, publicSorted: boolean = false) => {
  const url = new URL(`${API_URL}/documents/sidebar/`);
  const params = new URLSearchParams();
  params.append("userId", userId);
  if (parentDocument) params.append("parentDocument", parentDocument);
  if (publicSorted) params.append("publicSorted", "true");
  
  url.search = params.toString();

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch sidebar documents");
  }

  const data = await response.json();
  return data as Document[];
};

// Архивировать документ
export const archiveDocument = async (id: string, userId: string) => {
  const response = await fetch(`${API_URL}/documents/${id}/archive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to archive document");
  }

  const data = await response.json();
  return data as Document;
};

// Восстановить документ
export const restoreDocument = async (id: string, userId: string) => {
  const response = await fetch(`${API_URL}/documents/${id}/restore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to restore document");
  }

  const data = await response.json();
  return data as Document;
};

// Получить корзину с архивированными документами
export const getTrashDocuments = async (userId: string) => {
  const response = await fetch(`${API_URL}/documents/trash/?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trash documents");
  }

  const data = await response.json();
  return data as Document[];
};

// Получить количество документов
export const getDocumentCount = async (userId: string) => {
  const response = await fetch(`${API_URL}/documents/count/?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch document count");
  }

  const count = await response.json();
  return count as number;
};
