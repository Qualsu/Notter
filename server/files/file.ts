import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_QUALSU_API;

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/files/upload`,
    formData
  );

  return `${API_URL}${response.data.url}`;
}

export async function deleteFile(url: string) {
  const response = await axios.post(
    `${API_URL}/files/delete`,
    { url }
  );

  return response.data.success;
}
