import { API } from "@/config/const/api.const";
import { apiRoutes } from "@/config/routing/api.route";

export async function uploadFile(userid: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userid", userid);

  const response = await API.post(apiRoutes.FILES.UPLOAD, formData);

  return `${API.defaults.baseURL ?? ""}${response.data.url}`;
}

export async function deleteFile(userid: string, fileid: string) {
  const response = await API.delete(apiRoutes.FILES.DELETE, { data: { userid, fileid } });

  return response.data.success;
}
