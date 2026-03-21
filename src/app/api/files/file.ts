import { API } from "@/config/const/api.const";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/files/upload", formData);

  return `${API.defaults.baseURL ?? ""}${response.data.url}`;
}

export async function deleteFile(url: string) {
  const response = await API.post("/files/delete", { url });

  return response.data.success;
}
