import { API } from "@/config/const/api.const";
import { apiRoutes } from "@/config/routing/api.route";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post(apiRoutes.FILES.UPLOAD, formData);

  return `${API.defaults.baseURL ?? ""}${response.data.url}`;
}

export async function deleteFile(url: string) {
  const response = await API.post(apiRoutes.FILES.DELETE, { url });

  return response.data.success;
}
