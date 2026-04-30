import { apiDelete, apiPost, withApiBaseUrl } from "../client"
import { apiRoutes } from "@/config/routing/api.route"

type UploadResponse = {
  url: string
}

type DeleteResponse = {
  success: boolean
}

export async function uploadFile(
  userid: string,
  documentid: string,
  avatar: string,
  username: string,
  file: File
) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("userid", userid)
  formData.append("documentid", documentid)
  formData.append("username", username)
  formData.append("avatar", avatar)

  const response = await apiPost<UploadResponse>(apiRoutes.FILES.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response ? withApiBaseUrl(response.url) : null
}

export async function deleteFile(userid: string, fileid: string) {
  const response = await apiDelete<DeleteResponse>(apiRoutes.FILES.DELETE, { userid, fileid })
  return response?.success ?? false
}
