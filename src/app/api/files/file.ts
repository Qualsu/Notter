import { API } from "@/config/const/api.const";
import { apiRoutes } from "@/config/routing/api.route";

export async function uploadFile(userid: string, documentid: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userid", userid);
  formData.append("documentid", documentid);

  const response = await API.post(apiRoutes.FILES.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return `${API.defaults.baseURL ?? ""}${response.data.url}`;
}

export async function deleteFile(userid: string, fileid: string) {
  const response = await API.delete(apiRoutes.FILES.DELETE, { data: { userid, fileid } });

  return response.data.success;
}
